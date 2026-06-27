import { createSupabaseClient } from "./supabase";

export type AiActivityStatus = "success" | "warning" | "error" | "running";

export type AiActivityEventType =
  | "lead_loaded"
  | "website_audit_started"
  | "website_audit_completed"
  | "audit_insights_generated"
  | "business_profile_generated"
  | "lead_intelligence_generated"
  | "outreach_generated"
  | "crm_updated"
  | "pipeline_completed"
  | "pipeline_warning"
  | "pipeline_failed";

export type AiActivityLog = {
  id: string;
  lead_id: string;
  event_type: AiActivityEventType;
  event_label: string;
  status: AiActivityStatus;
  details: string | null;
  created_at: string;
};

export type CreateAiActivityLogInput = {
  leadId: string;
  eventType: AiActivityEventType;
  status: AiActivityStatus;
  details?: string | null;
};

export const AI_ACTIVITY_EVENT_LABELS: Record<AiActivityEventType, string> = {
  lead_loaded: "Lead loaded",
  website_audit_started: "Website audit started",
  website_audit_completed: "Website audit completed",
  audit_insights_generated: "Audit insights generated",
  business_profile_generated: "Business profile generated",
  lead_intelligence_generated: "Lead intelligence generated",
  outreach_generated: "Outreach generated",
  crm_updated: "CRM updated",
  pipeline_completed: "Pipeline completed",
  pipeline_warning: "Pipeline warning",
  pipeline_failed: "Pipeline failed",
};

export type CreateAiActivityLogResult = {
  success: boolean;
  log?: AiActivityLog;
  error?: string;
};

function normalizeDetails(details?: string | null) {
  if (details === undefined || details === null) {
    return null;
  }

  const trimmed = details.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createAiActivityLog({
  leadId,
  eventType,
  status,
  details,
}: CreateAiActivityLogInput): Promise<CreateAiActivityLogResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("ai_activity_logs")
    .insert({
      lead_id: leadId,
      event_type: eventType,
      event_label: AI_ACTIVITY_EVENT_LABELS[eventType],
      status,
      details: normalizeDetails(details),
    })
    .select("id, lead_id, event_type, event_label, status, details, created_at")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, log: data as AiActivityLog };
}

export type RecentActivityLog = AiActivityLog & {
  company: string | null;
};

export async function fetchAiActivityLogsForLead(
  leadId: string
): Promise<AiActivityLog[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("ai_activity_logs")
    .select("id, lead_id, event_type, event_label, status, details, created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch AI activity logs:", error.message);
    return [];
  }

  return (data ?? []) as AiActivityLog[];
}

export async function fetchRecentAiActivityLogs(
  limit = 6
): Promise<RecentActivityLog[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("ai_activity_logs")
    .select("id, lead_id, event_type, event_label, status, details, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch recent AI activity logs:", error.message);
    return [];
  }

  const logs = (data ?? []) as AiActivityLog[];

  if (logs.length === 0) {
    return [];
  }

  const leadIds = [...new Set(logs.map((log) => log.lead_id))];
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("id, company")
    .in("id", leadIds);

  if (leadsError) {
    console.error("Failed to fetch lead names for activity logs:", leadsError.message);
  }

  const companyByLeadId = new Map(
    (leads ?? []).map((lead) => [lead.id, lead.company as string | null])
  );

  return logs.map((log) => ({
    ...log,
    company: companyByLeadId.get(log.lead_id) ?? null,
  }));
}

export async function fetchAiActivityLogsForLeads(
  leadIds: string[]
): Promise<Record<string, AiActivityLog[]>> {
  const grouped: Record<string, AiActivityLog[]> = {};

  for (const leadId of leadIds) {
    grouped[leadId] = [];
  }

  if (leadIds.length === 0) {
    return grouped;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return grouped;
  }

  const { data, error } = await supabase
    .from("ai_activity_logs")
    .select("id, lead_id, event_type, event_label, status, details, created_at")
    .in("lead_id", leadIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch AI activity logs:", error.message);
    return grouped;
  }

  for (const log of (data ?? []) as AiActivityLog[]) {
    if (!grouped[log.lead_id]) {
      grouped[log.lead_id] = [];
    }

    grouped[log.lead_id].push(log);
  }

  return grouped;
}
