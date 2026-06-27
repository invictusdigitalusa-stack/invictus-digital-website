import "server-only";

import { fetchRecentAiActivityLogs } from "./aiActivityLogs";
import { getQueueStatus, type QueueStatus } from "./agentQueue";
import {
  fetchDashboardStats,
  fetchLeads,
  fetchProjects,
  type DashboardStats,
  type LeadRow,
  type ProjectRow,
} from "./supabase";

export type CopilotLeadSummary = {
  id: string;
  company: string | null;
  website: string | null;
  industry: string | null;
  status: string | null;
  priority: string | null;
  overallScore: number | null;
  closingProbability: number | null;
  conversionPotential: number | null;
  revenuePotential: number | null;
  urgency: string | null;
  proposalPackage: string | null;
  nextBestAction: string | null;
  lastAuditAt: string | null;
  lastOutreachAt: string | null;
};

export type CopilotProjectSummary = {
  id: string;
  company: string | null;
  website: string | null;
  status: string | null;
  package: string | null;
  progress: number | null;
  launchGoal: string | null;
};

export type CopilotActivitySummary = {
  id: string;
  eventLabel: string;
  status: string;
  company: string | null;
  createdAt: string;
};

export type CopilotQueueSummary = {
  isRunning: boolean;
  pendingCount: number;
  runningCount: number;
  completedCount: number;
  failedCount: number;
};

export type CopilotInsights = {
  bestLeads: CopilotLeadSummary[];
  contactFirstLeads: CopilotLeadSummary[];
  weakAuditLeads: CopilotLeadSummary[];
  openProposals: CopilotLeadSummary[];
  closestToClosing: CopilotLeadSummary[];
  activeProjects: CopilotProjectSummary[];
};

export type CopilotContext = {
  generatedAt: string;
  stats: DashboardStats;
  queueStatus: CopilotQueueSummary;
  leads: CopilotLeadSummary[];
  projects: CopilotProjectSummary[];
  recentActivity: CopilotActivitySummary[];
  insights: CopilotInsights;
};

function summarizeLead(lead: LeadRow): CopilotLeadSummary {
  return {
    id: lead.id,
    company: lead.company,
    website: lead.website,
    industry: lead.industry,
    status: lead.status,
    priority: lead.priority,
    overallScore: lead.overall_score,
    closingProbability: lead.closing_probability,
    conversionPotential: lead.conversion_potential,
    revenuePotential: lead.revenue_potential,
    urgency: lead.urgency,
    proposalPackage: lead.proposal_package,
    nextBestAction: lead.next_best_action,
    lastAuditAt: lead.last_audit_at,
    lastOutreachAt: lead.last_outreach_at,
  };
}

function summarizeProject(project: ProjectRow): CopilotProjectSummary {
  return {
    id: project.id,
    company: project.company,
    website: project.website,
    status: project.status,
    package: project.package,
    progress: project.progress,
    launchGoal: project.launch_goal,
  };
}

function summarizeQueueStatus(queueStatus: QueueStatus): CopilotQueueSummary {
  return {
    isRunning: queueStatus.isRunning,
    pendingCount: queueStatus.pendingCount,
    runningCount: queueStatus.items.filter((item) => item.status === "running")
      .length,
    completedCount: queueStatus.completedCount,
    failedCount: queueStatus.failedCount,
  };
}

function leadScore(lead: CopilotLeadSummary) {
  const closing = lead.closingProbability ?? 0;
  const conversion = lead.conversionPotential ?? 0;
  const revenue = lead.revenuePotential ?? 0;
  const audit = lead.overallScore ?? 0;

  return closing * 0.45 + conversion * 0.3 + revenue * 0.15 + audit * 0.1;
}

function isActiveProject(project: CopilotProjectSummary) {
  return (project.progress ?? 0) < 100 && project.status !== "Launch";
}

function buildInsights(
  leads: CopilotLeadSummary[],
  projects: CopilotProjectSummary[]
): CopilotInsights {
  const rankedLeads = [...leads].sort((left, right) => leadScore(right) - leadScore(left));

  const contactFirstLeads = [...leads]
    .filter((lead) => {
      const status = lead.status ?? "";
      const needsOutreach =
        !lead.lastOutreachAt &&
        (status === "New Lead" ||
          status === "Reviewed" ||
          status === "Contacted" ||
          status === "Replied");

      return needsOutreach || lead.urgency === "High";
    })
    .sort((left, right) => leadScore(right) - leadScore(left));

  const weakAuditLeads = [...leads]
    .filter(
      (lead) =>
        lead.overallScore !== null &&
        lead.overallScore < 60 &&
        lead.status !== "Won" &&
        lead.status !== "Lost"
    )
    .sort((left, right) => (left.overallScore ?? 0) - (right.overallScore ?? 0));

  const openProposals = leads.filter((lead) => lead.status === "Proposal Sent");

  const closestToClosing = [...leads]
    .filter((lead) => {
      const status = lead.status ?? "";
      const lateStage = [
        "Replied",
        "Meeting Booked",
        "Proposal Sent",
      ].includes(status);

      return lateStage || (lead.closingProbability ?? 0) >= 60;
    })
    .sort(
      (left, right) =>
        (right.closingProbability ?? 0) - (left.closingProbability ?? 0)
    );

  const activeProjects = projects.filter(isActiveProject);

  return {
    bestLeads: rankedLeads.slice(0, 5),
    contactFirstLeads: contactFirstLeads.slice(0, 5),
    weakAuditLeads: weakAuditLeads.slice(0, 5),
    openProposals,
    closestToClosing: closestToClosing.slice(0, 5),
    activeProjects,
  };
}

export async function loadCopilotContext(): Promise<CopilotContext> {
  const [stats, leads, projects, queueStatus, recentActivity] = await Promise.all([
    fetchDashboardStats(),
    fetchLeads(),
    fetchProjects(),
    getQueueStatus(),
    fetchRecentAiActivityLogs(12),
  ]);

  const leadSummaries = leads.map(summarizeLead);
  const projectSummaries = projects.map(summarizeProject);

  return {
    generatedAt: new Date().toISOString(),
    stats,
    queueStatus: summarizeQueueStatus(queueStatus),
    leads: leadSummaries,
    projects: projectSummaries,
    recentActivity: recentActivity.map((log) => ({
      id: log.id,
      eventLabel: log.event_label,
      status: log.status,
      company: log.company,
      createdAt: log.created_at,
    })),
    insights: buildInsights(leadSummaries, projectSummaries),
  };
}

export function serializeCopilotContext(context: CopilotContext) {
  return JSON.stringify(context, null, 2);
}
