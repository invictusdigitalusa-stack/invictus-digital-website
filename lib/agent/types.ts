export type LeadPipelineStep =
  | "loadLead"
  | "audit"
  | "insights"
  | "businessProfile"
  | "leadIntelligence"
  | "saveToCrm"
  | "outreach";

export type LeadPipelineResult = {
  success: boolean;
  completedSteps: LeadPipelineStep[];
  errors: string[];
  audit?: import("../audit").AuditAnalysisResult;
  insights?: import("../aiAudit").AuditInsights;
  businessProfile?: import("../businessProfileTypes").BusinessProfile;
  leadIntelligence?: import("../leadIntelligence").LeadIntelligence;
  outreach?: import("../outreachTypes").OutreachEmail;
};

export type PipelineLead = {
  id: string;
  company: string | null;
  website: string | null;
  industry: string | null;
};
