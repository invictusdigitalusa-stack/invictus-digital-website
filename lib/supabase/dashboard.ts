import { createSupabaseClient } from "./client";
import { proposalInvestments } from "./constants";
import type { DashboardStats } from "./types";

export const emptyDashboardStats: DashboardStats = {
  totalLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  reviewedLeads: 0,
  proposalSent: 0,
  wonLeads: 0,
  activeProjects: 0,
  completedProjects: 0,
  averageAuditScore: 0,
  pipelineValue: 0,
};

function getPipelinePackageValue(packageName: string | null) {
  if (packageName && proposalInvestments[packageName]) {
    return proposalInvestments[packageName];
  }

  return proposalInvestments.Growth;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return emptyDashboardStats;
  }

  const [{ data: leads, error: leadsError }, { data: projects, error: projectsError }] =
    await Promise.all([
      supabase.from("leads").select("status, overall_score, proposal_package"),
      supabase.from("projects").select("progress, status"),
    ]);

  if (leadsError) {
    console.error("Failed to fetch dashboard lead stats:", leadsError.message);
  }

  if (projectsError) {
    console.error("Failed to fetch dashboard project stats:", projectsError.message);
  }

  const leadRows = leads ?? [];
  const projectRows = projects ?? [];

  const auditScores = leadRows
    .map((lead) => lead.overall_score)
    .filter((score): score is number => score !== null && score !== undefined);

  const averageAuditScore =
    auditScores.length > 0
      ? auditScores.reduce((sum, score) => sum + score, 0) / auditScores.length
      : 0;

  const pipelineValue = leadRows
    .filter(
      (lead) => lead.status === "Proposal Sent" || lead.status === "Won"
    )
    .reduce(
      (sum, lead) => sum + getPipelinePackageValue(lead.proposal_package),
      0
    );

  const completedProjects = projectRows.filter(
    (project) => project.progress === 100 || project.status === "Launch"
  ).length;

  return {
    totalLeads: leadRows.length,
    newLeads: leadRows.filter((lead) => lead.status === "New Lead").length,
    contactedLeads: leadRows.filter((lead) => lead.status === "Contacted").length,
    reviewedLeads: leadRows.filter((lead) => lead.status === "Reviewed").length,
    proposalSent: leadRows.filter((lead) => lead.status === "Proposal Sent").length,
    wonLeads: leadRows.filter((lead) => lead.status === "Won").length,
    activeProjects: projectRows.length - completedProjects,
    completedProjects,
    averageAuditScore,
    pipelineValue,
  };
}
