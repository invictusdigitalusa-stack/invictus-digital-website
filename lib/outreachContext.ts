import "server-only";

import type { AuditInsights } from "./aiAudit";
import type { AuditAnalysisResult } from "./audit";
import type { BusinessProfile } from "./businessProfileTypes";
import type { LeadIntelligence, LeadIntelligencePackage } from "./leadIntelligence";
import type { LeadOutreachRow } from "./supabase";
import type { OutreachFallbackInput } from "./outreachTypes";
import { normalizeStringList } from "@/lib/utils/normalize";

export type OutreachGenerationContext = {
  audit: AuditAnalysisResult;
  insights: AuditInsights;
  businessProfile: BusinessProfile;
  leadIntelligence: LeadIntelligence;
};

function normalizePackage(value: string | null | undefined): LeadIntelligencePackage {
  if (value === "Starter" || value === "Growth" || value === "Authority") {
    return value;
  }

  return "Growth";
}

function normalizeLevel(value: string | null | undefined) {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }

  return "Medium" as const;
}

function hasAuditData(lead: LeadOutreachRow) {
  return (
    lead.overall_score !== null ||
    Boolean(lead.top_improvement) ||
    Boolean(lead.business_summary) ||
    Boolean(lead.ai_executive_summary)
  );
}

export function buildOutreachContextFromLead(
  lead: LeadOutreachRow,
  fallbackInput: OutreachFallbackInput
): OutreachGenerationContext | null {
  if (!hasAuditData(lead)) {
    return null;
  }

  const topImprovement =
    lead.top_improvement?.trim() ||
    lead.priority_focus?.trim() ||
    fallbackInput.topImprovement;

  const audit: AuditAnalysisResult = {
    overall_score: lead.overall_score ?? 0,
    design_score: 0,
    mobile_score: 0,
    speed_score: 0,
    seo_score: 0,
    google_business_score: 0,
    cta_score: 0,
    trust_score: 0,
    ai_visibility_score: 0,
    top_improvement: topImprovement,
    audit_summary:
      lead.business_summary ??
      lead.ai_executive_summary ??
      `Website review for ${fallbackInput.companyName}`,
    audit_title: null,
    audit_meta_description: null,
    audit_h1: null,
    audit_h2_count: 0,
    audit_images_without_alt: 0,
    audit_has_cta: false,
    audit_has_phone: false,
    audit_has_email: false,
    audit_has_google_maps: false,
    audit_has_faq: false,
    audit_has_testimonials: false,
    audit_has_ssl: false,
    audit_has_viewport: false,
    audit_has_schema: false,
    audit_has_open_graph: false,
    audit_has_favicon: false,
  };

  const weaknesses =
    normalizeStringList(lead.ai_weaknesses).length > 0
      ? normalizeStringList(lead.ai_weaknesses)
      : normalizeStringList(lead.biggest_weaknesses);

  const opportunities =
    normalizeStringList(lead.ai_prioritized_actions).length > 0
      ? normalizeStringList(lead.ai_prioritized_actions)
      : normalizeStringList(lead.biggest_opportunities);

  const insights: AuditInsights = {
    executiveSummary:
      lead.ai_executive_summary ??
      lead.business_summary ??
      `The website for ${fallbackInput.companyName} has clear room to improve local visibility and conversions.`,
    strengths: normalizeStringList(lead.ai_strengths),
    weaknesses:
      weaknesses.length > 0
        ? weaknesses
        : topImprovement
          ? [topImprovement]
          : [],
    seoRecommendations: [],
    conversionRecommendations: normalizeStringList(
      lead.ai_conversion_recommendations
    ),
    localSeoRecommendations: normalizeStringList(
      lead.ai_local_seo_recommendations
    ),
    aiVisibilityRecommendations: [],
    prioritizedActions:
      opportunities.length > 0
        ? opportunities
        : lead.next_best_action
          ? [lead.next_best_action]
          : topImprovement
            ? [topImprovement]
            : [],
  };

  const businessProfile: BusinessProfile = {
    businessSummary:
      lead.business_summary ??
      insights.executiveSummary,
    companyTone:
      lead.company_tone ??
      (fallbackInput.tone === "Friendly"
        ? "Warm and approachable"
        : fallbackInput.tone === "Direct"
          ? "Direct and practical"
          : "Professional and clear"),
    targetAudience:
      lead.target_audience ?? "Local customers in their service area",
    mainServices: normalizeStringList(lead.main_services),
    uniqueSellingPoints: normalizeStringList(lead.unique_selling_points),
    competitiveAdvantages: normalizeStringList(lead.competitive_advantages),
    brandPositioning:
      lead.brand_positioning ?? "Local service provider building trust online",
    trustSignals: normalizeStringList(lead.trust_signals),
    biggestWeaknesses:
      weaknesses.length > 0
        ? weaknesses
        : topImprovement
          ? [topImprovement]
          : [],
    biggestOpportunities:
      opportunities.length > 0
        ? opportunities
        : topImprovement
          ? [topImprovement]
          : [],
    recommendedOffer:
      lead.recommended_offer ??
      `${normalizePackage(lead.recommended_package)} website and local visibility improvements`,
    recommendedPackage: normalizePackage(lead.recommended_package),
    estimatedBusinessSize:
      lead.estimated_business_size ?? "Small local business",
    seoMaturity: lead.seo_maturity ?? "Medium",
    conversionMaturity: lead.conversion_maturity ?? "Medium",
    aiVisibilityMaturity: lead.ai_visibility_maturity ?? "Medium",
    priorityFocus:
      lead.priority_focus?.trim() ||
      lead.next_best_action?.trim() ||
      topImprovement ||
      "Improve website conversions",
  };

  const leadIntelligence: LeadIntelligence = {
    conversionPotential: lead.conversion_potential ?? 50,
    revenuePotential: lead.revenue_potential ?? 50,
    closingProbability: lead.closing_probability ?? 50,
    urgency: normalizeLevel(lead.urgency),
    competition: normalizeLevel(lead.competition),
    idealPackage: normalizePackage(lead.recommended_package),
    estimatedLifetimeValue: normalizeLevel(lead.estimated_lifetime_value),
    reasoning:
      lead.reasoning ??
      `The site shows opportunities around ${businessProfile.priorityFocus.toLowerCase()}.`,
    nextBestAction:
      lead.next_best_action?.trim() ||
      businessProfile.priorityFocus ||
      topImprovement,
  };

  return {
    audit,
    insights,
    businessProfile,
    leadIntelligence,
  };
}

export function buildOutreachContextFromInput(
  fallbackInput: OutreachFallbackInput,
  primaryProblem: string
): OutreachGenerationContext {
  const topImprovement =
    fallbackInput.topImprovement.trim() ||
    "Improve the website's first impression and conversion path";
  const problem =
    primaryProblem.trim() ||
    "The website has opportunities to improve first impression, conversion and local visibility.";

  const audit: AuditAnalysisResult = {
    overall_score: 0,
    design_score: 0,
    mobile_score: 0,
    speed_score: 0,
    seo_score: 0,
    google_business_score: 0,
    cta_score: 0,
    trust_score: 0,
    ai_visibility_score: 0,
    top_improvement: topImprovement,
    audit_summary: problem,
    audit_title: null,
    audit_meta_description: null,
    audit_h1: null,
    audit_h2_count: 0,
    audit_images_without_alt: 0,
    audit_has_cta: false,
    audit_has_phone: false,
    audit_has_email: false,
    audit_has_google_maps: false,
    audit_has_faq: false,
    audit_has_testimonials: false,
    audit_has_ssl: false,
    audit_has_viewport: false,
    audit_has_schema: false,
    audit_has_open_graph: false,
    audit_has_favicon: false,
  };

  const insights: AuditInsights = {
    executiveSummary: problem,
    strengths: [],
    weaknesses: [problem, topImprovement],
    seoRecommendations: [],
    conversionRecommendations: [topImprovement],
    localSeoRecommendations: [],
    aiVisibilityRecommendations: [],
    prioritizedActions: [topImprovement],
  };

  const businessProfile: BusinessProfile = {
    businessSummary: problem,
    companyTone:
      fallbackInput.tone === "Friendly"
        ? "Warm and approachable"
        : fallbackInput.tone === "Direct"
          ? "Direct and practical"
          : "Professional and clear",
    targetAudience: `Local ${fallbackInput.industry.toLowerCase()} customers`,
    mainServices: [],
    uniqueSellingPoints: [],
    competitiveAdvantages: [],
    brandPositioning: `Trusted ${fallbackInput.industry.toLowerCase()} provider in the local market`,
    trustSignals: [],
    biggestWeaknesses: [topImprovement],
    biggestOpportunities: [topImprovement],
    recommendedOffer: `${fallbackInput.idealPackage ?? "Growth"} website improvements`,
    recommendedPackage: fallbackInput.idealPackage ?? "Growth",
    estimatedBusinessSize: "Small local business",
    seoMaturity: "Medium",
    conversionMaturity: "Medium",
    aiVisibilityMaturity: "Medium",
    priorityFocus: topImprovement,
  };

  const leadIntelligence: LeadIntelligence = {
    conversionPotential: 50,
    revenuePotential: 50,
    closingProbability: 50,
    urgency: "Medium",
    competition: "Medium",
    idealPackage: normalizePackage(fallbackInput.idealPackage),
    estimatedLifetimeValue: "Medium",
    reasoning: problem,
    nextBestAction: topImprovement,
  };

  return {
    audit,
    insights,
    businessProfile,
    leadIntelligence,
  };
}
