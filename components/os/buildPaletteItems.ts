import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  defaultStatusStyle,
  getStatusStyle,
} from "@/components/crm/data";
import type { GlobalSearchResults } from "@/lib/globalSearch";
import type { CommandDefinition } from "./useCommandBar";

const activityStatusStyles: Record<string, string> = {
  success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  running: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

function normalizeSearchText(command: CommandDefinition) {
  return [command.title, command.description, ...(command.keywords ?? [])]
    .join(" ")
    .toLowerCase();
}

function fuzzyMatch(text: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  let queryIndex = 0;

  for (let index = 0; index < text.length && queryIndex < normalizedQuery.length; index++) {
    if (text[index] === normalizedQuery[queryIndex]) {
      queryIndex += 1;
    }
  }

  return queryIndex === normalizedQuery.length;
}

function fuzzyScore(command: CommandDefinition, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  const title = command.title.toLowerCase();
  const description = command.description.toLowerCase();

  if (title.startsWith(normalizedQuery)) {
    return 100;
  }

  if (title.includes(normalizedQuery)) {
    return 80;
  }

  if (description.includes(normalizedQuery)) {
    return 60;
  }

  if (fuzzyMatch(normalizeSearchText(command), normalizedQuery)) {
    return 40;
  }

  return -1;
}

export function filterCommands(commands: CommandDefinition[], query: string) {
  return commands
    .map((command) => ({
      command,
      score: fuzzyScore(command, query),
    }))
    .filter((entry) => entry.score >= 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.command);
}

function buildLeadAuditUrl(
  company: string | null,
  website: string | null,
  industry: string | null
) {
  const params = new URLSearchParams();

  if (company) {
    params.set("company", company);
  }

  if (website) {
    params.set("website", website);
  }

  if (industry) {
    params.set("industry", industry);
  }

  const queryString = params.toString();
  return queryString ? `/audit?${queryString}` : "/crm";
}

function formatActivitySubtitle(
  company: string | null,
  createdAt: string
) {
  const companyLabel = company?.trim() || "Unknown lead";
  const timestamp = new Date(createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return `${companyLabel} · ${timestamp}`;
}

function getActivityStatusStyle(status: string) {
  return activityStatusStyles[status] ?? defaultStatusStyle;
}

function isExactMatch(value: string | null | undefined, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return false;
  }

  return (value?.trim().toLowerCase() ?? "") === normalizedQuery;
}

function getSearchResultScore(
  group: "Leads" | "Projects" | "Activity",
  title: string,
  query: string
) {
  if (group === "Leads") {
    return isExactMatch(title, query) ? 300 : 290;
  }

  if (group === "Projects") {
    return isExactMatch(title, query) ? 200 : 190;
  }

  return 100;
}

export function buildPaletteItems(
  commands: CommandDefinition[],
  searchResults: GlobalSearchResults,
  query: string,
  router: AppRouterInstance,
  icons: {
    lead: React.ReactNode;
    project: React.ReactNode;
    activity: React.ReactNode;
  }
): CommandDefinition[] {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return filterCommands(commands, trimmed);
  }

  const items: CommandDefinition[] = [];

  for (const lead of searchResults.leads) {
    items.push({
      id: `lead-${lead.id}`,
      group: "Leads",
      title: lead.company?.trim() || "Unnamed lead",
      description: lead.website?.trim() || lead.industry?.trim() || "No website on file",
      statusLabel: lead.status,
      statusStyle: getStatusStyle(lead.status),
      icon: icons.lead,
      action: () =>
        router.push(
          buildLeadAuditUrl(lead.company, lead.website, lead.industry)
        ),
    });
  }

  for (const project of searchResults.projects) {
    items.push({
      id: `project-${project.id}`,
      group: "Projects",
      title: project.company?.trim() || "Unnamed project",
      description:
        project.website?.trim() ||
        project.package?.trim() ||
        "Active delivery project",
      statusLabel: project.status,
      statusStyle: getStatusStyle(project.status),
      icon: icons.project,
      action: () => router.push("/delivery"),
    });
  }

  for (const activity of searchResults.activity) {
    items.push({
      id: `activity-${activity.id}`,
      group: "Activity",
      title: activity.eventLabel,
      description: formatActivitySubtitle(activity.company, activity.createdAt),
      statusLabel: activity.status,
      statusStyle: getActivityStatusStyle(activity.status),
      icon: icons.activity,
      action: () => router.push("/crm"),
    });
  }

  items.sort(
    (left, right) =>
      getSearchResultScore(right.group as "Leads" | "Projects" | "Activity", right.title, trimmed) -
      getSearchResultScore(left.group as "Leads" | "Projects" | "Activity", left.title, trimmed)
  );

  const matchingCommands = filterCommands(
    commands.filter((command) => command.id !== "search-lead"),
    trimmed
  ).map((command) => ({
    ...command,
    group: "Commands" as const,
  }));

  return [...items, ...matchingCommands];
}
