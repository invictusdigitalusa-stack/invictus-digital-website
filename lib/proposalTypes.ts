import type { BusinessProfile } from "./businessProfileTypes";
import type { LeadIntelligence } from "./leadIntelligence";

export const proposalPackages = ["Starter", "Growth", "Authority"] as const;

export type ProposalPackageName = (typeof proposalPackages)[number];

export type ProposalAuditInsights = {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  conversionRecommendations: string[];
  localSeoRecommendations: string[];
  prioritizedActions: string[];
};

export type ProposalOutreachContext = {
  sentAt: string | null;
  topImprovement: string;
  summary: string;
};

export type ProposalBusinessMaturity = {
  seoMaturity: string;
  conversionMaturity: string;
  estimatedBusinessSize: string;
};

export type GeneratedProposal = {
  proposalTitle: string;
  executiveSummary: string;
  whyThisMatters: string;
  whyWeChoseThisPackage: string;
  recommendedSolution: string;
  scopeSummary: string;
  expectedOutcomes: string[];
  firstThirtyDays: string[];
  timelineSummary: string;
  investmentJustification: string;
  nextSteps: string[];
  closingStatement: string;
};

export type ProposalGenerateRequest = {
  companyName: string;
  website?: string;
  industry?: string;
  package: ProposalPackageName;
  timeline: string;
  paymentTerms: string;
  projectNotes?: string;
};

export type ProposalPackageDetails = {
  investment: string;
  scope: string[];
  deliverables: string[];
};

export type ProposalGenerationContext = {
  leadId: string | null;
  companyName: string;
  website: string;
  industry: string;
  package: ProposalPackageName;
  timeline: string;
  paymentTerms: string;
  projectNotes: string;
  packageDetails: ProposalPackageDetails;
  hasLeadContext: boolean;
  hasProposalAiData: boolean;
  businessProfile: BusinessProfile | null;
  auditInsights: ProposalAuditInsights | null;
  auditWeaknesses: string[];
  biggestOpportunities: string[];
  priorityFocus: string;
  recommendedPackage: ProposalPackageName;
  leadIntelligence: LeadIntelligence | null;
  auditSummary: string;
  topImprovement: string;
  outreachContext: ProposalOutreachContext | null;
  businessMaturity: ProposalBusinessMaturity | null;
};

export type ProposalLeadStatus = {
  found: boolean;
  leadId: string | null;
  hasAiData: boolean;
  company: string | null;
  website: string | null;
  industry: string | null;
  recommendedPackage: ProposalPackageName | null;
};

export const PROPOSAL_MISSING_AI_ERROR = "MISSING_AI_DATA";

export function isProposalPackageName(
  value: string | undefined | null
): value is ProposalPackageName {
  return (
    value === "Starter" || value === "Growth" || value === "Authority"
  );
}

export function parseProposalPackageName(
  value: string | undefined | null,
  fallback: ProposalPackageName = "Growth"
): ProposalPackageName {
  return isProposalPackageName(value) ? value : fallback;
}
