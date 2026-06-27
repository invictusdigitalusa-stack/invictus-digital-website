import "server-only";

import { packageDetails } from "@/components/proposal/data";
import { normalizeOptionalString, normalizeStringList } from "@/lib/utils/normalize";
import { buildOutreachContextFromLead } from "./outreachContext";
import { fetchLeadOutreachContext, type LeadOutreachRow } from "./supabase";
import {
  isProposalPackageName,
  parseProposalPackageName,
  type ProposalGenerateRequest,
  type ProposalGenerationContext,
  type ProposalLeadStatus,
} from "./proposalTypes";

function hasAuditData(lead: LeadOutreachRow) {
  return (
    lead.overall_score !== null ||
    Boolean(lead.top_improvement?.trim()) ||
    Boolean(lead.last_audit_at)
  );
}

function hasAuditInsights(lead: LeadOutreachRow) {
  return (
    Boolean(lead.ai_executive_summary?.trim()) ||
    normalizeStringList(lead.ai_weaknesses).length > 0 ||
    normalizeStringList(lead.ai_prioritized_actions).length > 0
  );
}

function hasBusinessProfileData(lead: LeadOutreachRow) {
  return (
    Boolean(lead.business_summary?.trim()) ||
    Boolean(lead.priority_focus?.trim()) ||
    normalizeStringList(lead.main_services).length > 0 ||
    Boolean(lead.recommended_offer?.trim())
  );
}

function hasLeadIntelligenceData(lead: LeadOutreachRow) {
  return (
    lead.conversion_potential !== null ||
    lead.closing_probability !== null ||
    Boolean(lead.reasoning?.trim()) ||
    Boolean(lead.next_best_action?.trim()) ||
    Boolean(lead.recommended_package?.trim())
  );
}

export function hasProposalAiData(lead: LeadOutreachRow) {
  return (
    hasAuditData(lead) &&
    hasAuditInsights(lead) &&
    hasBusinessProfileData(lead) &&
    hasLeadIntelligenceData(lead)
  );
}

function buildEmptyProposalContext(
  input: ProposalGenerateRequest
): ProposalGenerationContext {
  const companyName = normalizeOptionalString(input.companyName);
  const website = normalizeOptionalString(input.website);
  const industry = normalizeOptionalString(input.industry) || "Landscaping";
  const packageName = parseProposalPackageName(input.package);
  const timeline = normalizeOptionalString(input.timeline) || "4–6 weeks";
  const paymentTerms =
    normalizeOptionalString(input.paymentTerms) || "50% deposit · 50% at launch";
  const projectNotes = normalizeOptionalString(input.projectNotes);
  const details = packageDetails[packageName];

  return {
    leadId: null,
    companyName,
    website,
    industry,
    package: packageName,
    timeline,
    paymentTerms,
    projectNotes,
    packageDetails: {
      investment: details.investment,
      scope: details.scope,
      deliverables: details.deliverables,
    },
    hasLeadContext: false,
    hasProposalAiData: false,
    businessProfile: null,
    auditWeaknesses: [],
    biggestOpportunities: [],
    priorityFocus: projectNotes || "Improve website conversions and local visibility",
    recommendedPackage: packageName,
    leadIntelligence: null,
    auditSummary: "",
    topImprovement: "",
    auditInsights: null,
    outreachContext: null,
    businessMaturity: null,
  };
}

export async function getProposalLeadStatus(
  companyName: string,
  website?: string
): Promise<ProposalLeadStatus> {
  const company = companyName.trim();
  const site = website?.trim() ?? "";

  if (!company) {
    return {
      found: false,
      leadId: null,
      hasAiData: false,
      company: null,
      website: site || null,
      industry: null,
      recommendedPackage: null,
    };
  }

  const lead = await fetchLeadOutreachContext(company, site);

  if (!lead) {
    return {
      found: false,
      leadId: null,
      hasAiData: false,
      company,
      website: site || null,
      industry: null,
      recommendedPackage: null,
    };
  }

  const recommendedPackage = isProposalPackageName(lead.recommended_package)
    ? lead.recommended_package
    : isProposalPackageName(lead.proposal_package)
      ? lead.proposal_package
      : null;

  return {
    found: true,
    leadId: lead.id,
    hasAiData: hasProposalAiData(lead),
    company: lead.company,
    website: lead.website,
    industry: lead.industry,
    recommendedPackage,
  };
}

export async function buildProposalGenerationContext(
  input: ProposalGenerateRequest
): Promise<ProposalGenerationContext> {
  const companyName = normalizeOptionalString(input.companyName);
  const website = normalizeOptionalString(input.website);
  const industry = normalizeOptionalString(input.industry) || "Landscaping";
  const packageName = parseProposalPackageName(input.package);
  const timeline = normalizeOptionalString(input.timeline) || "4–6 weeks";
  const paymentTerms =
    normalizeOptionalString(input.paymentTerms) || "50% deposit · 50% at launch";
  const projectNotes = normalizeOptionalString(input.projectNotes);
  const details = packageDetails[packageName];

  const lead = await fetchLeadOutreachContext(companyName, website);

  if (!lead) {
    return buildEmptyProposalContext(input);
  }

  const hasAiData = hasProposalAiData(lead);

  if (!hasAiData) {
    return {
      ...buildEmptyProposalContext(input),
      leadId: lead.id,
      hasLeadContext: true,
      industry: lead.industry?.trim() || industry,
      recommendedPackage: parseProposalPackageName(
        lead.recommended_package ?? lead.proposal_package,
        packageName
      ),
    };
  }

  const leadContext = buildOutreachContextFromLead(lead, {
    companyName,
    industry: lead.industry?.trim() || industry,
    topImprovement: "",
    tone: "Professional",
    idealPackage: packageName,
  });

  if (!leadContext) {
    return {
      ...buildEmptyProposalContext(input),
      leadId: lead.id,
      hasLeadContext: true,
    };
  }

  const profile = leadContext.businessProfile;
  const intelligence = leadContext.leadIntelligence;
  const insights = leadContext.insights;
  const recommendedPackage = parseProposalPackageName(
    profile.recommendedPackage,
    packageName
  );
  const topImprovement =
    leadContext.audit.top_improvement?.trim() ||
    profile.priorityFocus ||
    "Improve website clarity and conversions";

  const outreachSummary = lead.last_outreach_at
    ? `Outreach was sent on ${new Date(lead.last_outreach_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} focused on ${topImprovement.toLowerCase()}.`
    : intelligence.nextBestAction
      ? `The next commercial conversation should center on ${intelligence.nextBestAction.toLowerCase()}.`
      : `The commercial conversation should center on ${profile.priorityFocus.toLowerCase()}.`;

  return {
    leadId: lead.id,
    companyName,
    website: lead.website?.trim() || website,
    industry: lead.industry?.trim() || industry,
    package: packageName,
    timeline,
    paymentTerms,
    projectNotes,
    packageDetails: {
      investment: details.investment,
      scope: details.scope,
      deliverables: details.deliverables,
    },
    hasLeadContext: true,
    hasProposalAiData: true,
    businessProfile: profile,
    auditInsights: {
      executiveSummary: insights.executiveSummary,
      strengths: normalizeStringList(insights.strengths),
      weaknesses: normalizeStringList(insights.weaknesses),
      conversionRecommendations: normalizeStringList(
        insights.conversionRecommendations
      ),
      localSeoRecommendations: normalizeStringList(
        insights.localSeoRecommendations
      ),
      prioritizedActions: normalizeStringList(insights.prioritizedActions),
    },
    auditWeaknesses:
      normalizeStringList(profile.biggestWeaknesses).length > 0
        ? normalizeStringList(profile.biggestWeaknesses)
        : normalizeStringList(insights.weaknesses),
    biggestOpportunities:
      normalizeStringList(profile.biggestOpportunities).length > 0
        ? normalizeStringList(profile.biggestOpportunities)
        : normalizeStringList(insights.prioritizedActions),
    priorityFocus: profile.priorityFocus,
    recommendedPackage,
    leadIntelligence: intelligence,
    auditSummary: leadContext.audit.audit_summary,
    topImprovement,
    outreachContext: {
      sentAt: lead.last_outreach_at,
      topImprovement,
      summary: outreachSummary,
    },
    businessMaturity: {
      seoMaturity: profile.seoMaturity,
      conversionMaturity: profile.conversionMaturity,
      estimatedBusinessSize: profile.estimatedBusinessSize,
    },
  };
}

export function buildProposalPromptPayload(context: ProposalGenerationContext) {
  return {
    leadId: context.leadId,
    companyName: context.companyName,
    website: context.website,
    industry: context.industry,
    selectedPackage: context.package,
    timeline: context.timeline,
    paymentTerms: context.paymentTerms,
    projectNotes: context.projectNotes,
    packageDetails: context.packageDetails,
    businessProfile: context.businessProfile
      ? {
          businessSummary: context.businessProfile.businessSummary,
          companyTone: context.businessProfile.companyTone,
          targetAudience: context.businessProfile.targetAudience,
          mainServices: context.businessProfile.mainServices,
          uniqueSellingPoints: context.businessProfile.uniqueSellingPoints,
          competitiveAdvantages: context.businessProfile.competitiveAdvantages,
          brandPositioning: context.businessProfile.brandPositioning,
          trustSignals: context.businessProfile.trustSignals,
          biggestWeaknesses: context.auditWeaknesses,
          biggestOpportunities: context.biggestOpportunities,
          recommendedOffer: context.businessProfile.recommendedOffer,
          priorityFocus: context.priorityFocus,
          recommendedPackage: context.recommendedPackage,
        }
      : null,
    leadIntelligence: context.leadIntelligence
      ? {
          idealPackage: context.leadIntelligence.idealPackage,
          urgency: context.leadIntelligence.urgency,
          competition: context.leadIntelligence.competition,
          nextBestAction: context.leadIntelligence.nextBestAction,
          reasoning: context.leadIntelligence.reasoning,
          conversionPotential: context.leadIntelligence.conversionPotential,
          revenuePotential: context.leadIntelligence.revenuePotential,
          closingProbability: context.leadIntelligence.closingProbability,
          estimatedLifetimeValue:
            context.leadIntelligence.estimatedLifetimeValue,
        }
      : null,
    auditInsights: context.auditInsights,
    auditSummary: context.auditSummary,
    topImprovement: context.topImprovement,
    outreachContext: context.outreachContext,
    businessMaturity: context.businessMaturity,
    hasLeadContext: context.hasLeadContext,
    hasProposalAiData: context.hasProposalAiData,
  };
}
