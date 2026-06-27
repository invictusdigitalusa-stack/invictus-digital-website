import type { AuditInsights } from "../aiAudit";
import type { AuditAnalysisResult } from "../audit";
import type { BusinessProfile } from "../businessProfileTypes";
import type {
  AuditSaveResult,
  SaveLeadResult,
} from "../types/results";
import type { ProjectStage, ProjectStorageBucket } from "./constants";

export type { AuditSaveResult, SaveLeadResult, ProjectStage, ProjectStorageBucket };

export type LeadRow = {
  id: string;
  company: string | null;
  website: string | null;
  industry: string | null;
  status: string | null;
  priority: string | null;
  overall_score: number | null;
  last_audit_at: string | null;
  last_outreach_at: string | null;
  proposal_package: string | null;
  business_summary: string | null;
  priority_focus: string | null;
  recommended_package: string | null;
  conversion_potential: number | null;
  revenue_potential: number | null;
  closing_probability: number | null;
  urgency: string | null;
  competition: string | null;
  estimated_lifetime_value: string | null;
  next_best_action: string | null;
  reasoning: string | null;
};

export type LeadOutreachRow = LeadRow & {
  top_improvement: string | null;
  company_tone: string | null;
  target_audience: string | null;
  main_services: string[] | null;
  unique_selling_points: string[] | null;
  competitive_advantages: string[] | null;
  brand_positioning: string | null;
  trust_signals: string[] | null;
  biggest_weaknesses: string[] | null;
  biggest_opportunities: string[] | null;
  recommended_offer: string | null;
  estimated_business_size: string | null;
  seo_maturity: string | null;
  conversion_maturity: string | null;
  ai_visibility_maturity: string | null;
  ai_executive_summary: string | null;
  ai_strengths: string[] | null;
  ai_weaknesses: string[] | null;
  ai_prioritized_actions: string[] | null;
  ai_conversion_recommendations: string[] | null;
  ai_local_seo_recommendations: string[] | null;
};

export type CreateProjectFromLeadInput = {
  leadId: string;
  company: string | null;
  website: string | null;
  industry: string | null;
  proposalPackage: string | null;
};

export type CreateProjectResult = {
  success: boolean;
  created?: boolean;
  error?: string;
};

export type ProjectRow = {
  id: string;
  lead_id: string | null;
  company: string | null;
  website: string | null;
  industry: string | null;
  package: string | null;
  status: string | null;
  progress: number | null;
  start_date: string | null;
  launch_goal: string | null;
  assigned_to: string | null;
  created_at: string | null;
};

export type LeadMatchInput = {
  companyName: string;
  websiteUrl: string;
};

export type AuditSaveInput = LeadMatchInput &
  AuditAnalysisResult & {
    insights?: AuditInsights;
    businessProfile?: BusinessProfile;
  };

export type OutreachSaveInput = LeadMatchInput;

export type ProposalSaveInput = LeadMatchInput & {
  proposalPackage: string;
  proposalTimeline: string;
  proposalPaymentTerms: string;
};

export type UpdateLeadStatusInput = {
  leadId?: string;
  companyName?: string;
  websiteUrl?: string;
  status: string;
};

export type UpdateProjectProgressInput = {
  projectId: string;
  progress: number;
  status: string;
};

export type DashboardStats = {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  reviewedLeads: number;
  proposalSent: number;
  wonLeads: number;
  activeProjects: number;
  completedProjects: number;
  averageAuditScore: number;
  pipelineValue: number;
};

export type ProjectFileInput = {
  projectId: string;
  bucket: ProjectStorageBucket;
  filename: string;
};

export type UploadProjectFileInput = ProjectFileInput & {
  file: Blob | ArrayBuffer | Uint8Array | File;
  contentType?: string;
};

export type ProjectFileItem = {
  name: string;
  path: string;
  createdAt: string | null;
  updatedAt: string | null;
  size: number | null;
  contentType: string | null;
};

export type UploadProjectFileResult = SaveLeadResult & {
  path?: string;
};

export type DeleteProjectFileResult = SaveLeadResult & {
  path?: string;
};

export type ListProjectFilesResult = SaveLeadResult & {
  files?: ProjectFileItem[];
};

export type DownloadProjectFileResult = SaveLeadResult & {
  data?: Blob;
  path?: string;
};
