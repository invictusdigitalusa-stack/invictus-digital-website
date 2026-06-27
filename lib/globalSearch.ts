import { createSupabaseClient } from "./supabase";

export type GlobalSearchLeadResult = {
  id: string;
  company: string | null;
  website: string | null;
  industry: string | null;
  status: string | null;
};

export type GlobalSearchProjectResult = {
  id: string;
  company: string | null;
  website: string | null;
  status: string | null;
  package: string | null;
};

export type GlobalSearchActivityResult = {
  id: string;
  leadId: string;
  eventLabel: string;
  status: string;
  createdAt: string;
  company: string | null;
};

export type GlobalSearchResults = {
  leads: GlobalSearchLeadResult[];
  projects: GlobalSearchProjectResult[];
  activity: GlobalSearchActivityResult[];
};

const emptyResults: GlobalSearchResults = {
  leads: [],
  projects: [],
  activity: [],
};

function escapeIlike(value: string) {
  return value.replace(/[%_\\]/g, "\\$&");
}

function buildIlikePattern(query: string) {
  const escaped = escapeIlike(query.trim());
  // PostgREST accepts * as a wildcard alias for % in ilike patterns.
  return `*${escaped}*`;
}

function quoteIlikeValue(pattern: string) {
  return `"${pattern.replace(/"/g, '\\"')}"`;
}

function buildLeadOrFilter(pattern: string) {
  const value = quoteIlikeValue(pattern);
  return [
    `company.ilike.${value}`,
    `website.ilike.${value}`,
    `industry.ilike.${value}`,
    `status.ilike.${value}`,
  ].join(",");
}

function buildProjectOrFilter(pattern: string) {
  const value = quoteIlikeValue(pattern);
  // Avoid filtering on `package` here — it breaks PostgREST `.or()` parsing.
  return [
    `company.ilike.${value}`,
    `website.ilike.${value}`,
    `industry.ilike.${value}`,
    `status.ilike.${value}`,
  ].join(",");
}

function buildActivityOrFilter(pattern: string) {
  const value = quoteIlikeValue(pattern);
  return [
    `event_label.ilike.${value}`,
    `details.ilike.${value}`,
    `status.ilike.${value}`,
  ].join(",");
}

export async function searchGlobal(query: string): Promise<GlobalSearchResults> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return emptyResults;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return emptyResults;
  }

  const pattern = buildIlikePattern(trimmed);

  const [
    { data: leads, error: leadsError },
    { data: projects, error: projectsError },
    { data: directActivity, error: activityError },
    { data: matchingLeads, error: matchingLeadsError },
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id, company, website, industry, status")
      .or(buildLeadOrFilter(pattern))
      .order("company", { ascending: true })
      .limit(8),
    supabase
      .from("projects")
      .select("id, company, website, status, package")
      .or(buildProjectOrFilter(pattern))
      .order("company", { ascending: true })
      .limit(8),
    supabase
      .from("ai_activity_logs")
      .select("id, lead_id, event_label, status, created_at")
      .or(buildActivityOrFilter(pattern))
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("leads")
      .select("id")
      .or(buildLeadOrFilter(pattern))
      .limit(12),
  ]);

  if (leadsError) {
    console.error("Global search leads failed:", leadsError.message);
  }

  if (projectsError) {
    console.error("Global search projects failed:", projectsError.message);
  }

  if (activityError) {
    console.error("Global search activity failed:", activityError.message);
  }

  if (matchingLeadsError) {
    console.error("Global search matching leads failed:", matchingLeadsError.message);
  }

  const leadIds = (matchingLeads ?? []).map((lead) => lead.id);
  let leadActivity: typeof directActivity = [];
  let linkedProjects: typeof projects = [];

  if (leadIds.length > 0) {
    const [{ data: activityData, error: activityByLeadError }, { data: projectData, error: linkedProjectsError }] =
      await Promise.all([
        supabase
          .from("ai_activity_logs")
          .select("id, lead_id, event_label, status, created_at")
          .in("lead_id", leadIds)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("projects")
          .select("id, company, website, status, package")
          .in("lead_id", leadIds)
          .order("company", { ascending: true })
          .limit(8),
      ]);

    if (activityByLeadError) {
      console.error("Global search lead activity failed:", activityByLeadError.message);
    } else {
      leadActivity = activityData ?? [];
    }

    if (linkedProjectsError) {
      console.error("Global search linked projects failed:", linkedProjectsError.message);
    } else {
      linkedProjects = projectData ?? [];
    }
  }

  const activityMap = new Map<
    string,
    {
      id: string;
      lead_id: string;
      event_label: string;
      status: string;
      created_at: string;
    }
  >();

  for (const log of [...(directActivity ?? []), ...leadActivity]) {
    activityMap.set(log.id, log);
  }

  const activityRows = [...activityMap.values()]
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    )
    .slice(0, 8);

  const activityLeadIds = [...new Set(activityRows.map((log) => log.lead_id))];
  const companyByLeadId = new Map<string, string | null>();

  if (activityLeadIds.length > 0) {
    const { data: activityLeadRows, error } = await supabase
      .from("leads")
      .select("id, company")
      .in("id", activityLeadIds);

    if (error) {
      console.error("Global search activity lead names failed:", error.message);
    } else {
      for (const lead of activityLeadRows ?? []) {
        companyByLeadId.set(lead.id, lead.company);
      }
    }
  }

  return {
    leads: (leads ?? []).map((lead) => ({
      id: lead.id,
      company: lead.company,
      website: lead.website,
      industry: lead.industry,
      status: lead.status,
    })),
    projects: [...new Map(
      [...(projects ?? []), ...linkedProjects].map((project) => [project.id, project])
    ).values()].map((project) => ({
      id: project.id,
      company: project.company,
      website: project.website,
      status: project.status,
      package: project.package,
    })),
    activity: activityRows.map((log) => ({
      id: log.id,
      leadId: log.lead_id,
      eventLabel: log.event_label,
      status: log.status,
      createdAt: log.created_at,
      company: companyByLeadId.get(log.lead_id) ?? null,
    })),
  };
}
