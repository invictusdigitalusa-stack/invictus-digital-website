export { createSupabaseClient } from "./client";

export {
  projectStages,
  projectStageProgress,
  proposalInvestments,
  projectStorageBuckets,
} from "./constants";
export type { ProjectStage, ProjectStorageBucket } from "./constants";

export { findLeadId, mapBusinessProfileToLeadUpdate } from "./matching";

export {
  fetchLeads,
  fetchLeadOutreachContext,
  saveAuditToLead,
  saveOutreachToLead,
  saveProposalToLead,
  updateLeadStatus,
} from "./leads";

export {
  fetchProjects,
  createProjectFromLead,
  updateProjectProgress,
  updateProjectStage,
  getProjectStageProgress,
} from "./projects";

export { fetchDashboardStats, emptyDashboardStats } from "./dashboard";

export {
  uploadProjectFile,
  deleteProjectFile,
  listProjectFiles,
  downloadProjectFile,
} from "./files";

export type {
  AuditSaveResult,
  SaveLeadResult,
  LeadRow,
  LeadOutreachRow,
  CreateProjectFromLeadInput,
  CreateProjectResult,
  ProjectRow,
  LeadMatchInput,
  AuditSaveInput,
  OutreachSaveInput,
  ProposalSaveInput,
  UpdateLeadStatusInput,
  UpdateProjectProgressInput,
  DashboardStats,
  ProjectFileInput,
  UploadProjectFileInput,
  ProjectFileItem,
  UploadProjectFileResult,
  DeleteProjectFileResult,
  ListProjectFilesResult,
  DownloadProjectFileResult,
} from "./types";
