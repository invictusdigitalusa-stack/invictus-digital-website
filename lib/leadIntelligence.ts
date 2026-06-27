import "server-only";

import type { AuditInsights } from "./aiAudit";
import type { AuditAnalysisResult } from "./audit";
import type { BusinessProfile } from "./businessProfileTypes";
import { createJsonCompletion } from "./openai/jsonCompletion";
import { normalizeString } from "./utils/normalize";

export type LeadIntelligenceUrgency = "Low" | "Medium" | "High";
export type LeadIntelligenceCompetition = "Low" | "Medium" | "High";
export type LeadIntelligencePackage = "Starter" | "Growth" | "Authority";
export type LeadIntelligenceLifetimeValue = "Low" | "Medium" | "High";

export type LeadIntelligence = {
  conversionPotential: number;
  revenuePotential: number;
  closingProbability: number;
  urgency: LeadIntelligenceUrgency;
  competition: LeadIntelligenceCompetition;
  idealPackage: LeadIntelligencePackage;
  estimatedLifetimeValue: LeadIntelligenceLifetimeValue;
  reasoning: string;
  nextBestAction: string;
};

type GptLeadIntelligenceResponse = Partial<LeadIntelligence>;

const PACKAGE_VALUES: LeadIntelligencePackage[] = [
  "Starter",
  "Growth",
  "Authority",
];
const LEVEL_VALUES = ["Low", "Medium", "High"] as const;

const PACKAGE_REVENUE_WEIGHT: Record<LeadIntelligencePackage, number> = {
  Starter: 30,
  Growth: 55,
  Authority: 85,
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeScore(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return clampScore(value);
}

function normalizeLevel<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizePackage(value: unknown, fallback: LeadIntelligencePackage) {
  return normalizeLevel(value, PACKAGE_VALUES, fallback);
}

function recommendPackageFromAudit(audit: AuditAnalysisResult) {
  if (audit.overall_score < 55) {
    return "Growth" as const;
  }

  if (audit.overall_score < 75) {
    return "Growth" as const;
  }

  if (
    audit.seo_score < 14 ||
    audit.ai_visibility_score < 3 ||
    audit.google_business_score < 11
  ) {
    return "Authority" as const;
  }

  return "Starter" as const;
}

function deriveIdealPackage(
  audit: AuditAnalysisResult,
  profile: BusinessProfile
): LeadIntelligencePackage {
  return normalizePackage(profile.recommendedPackage, recommendPackageFromAudit(audit));
}

function deriveCompetition(
  audit: AuditAnalysisResult,
  profile: BusinessProfile
): LeadIntelligenceCompetition {
  if (profile.seoMaturity === "High" || audit.google_business_score >= 14) {
    return "High";
  }

  if (profile.seoMaturity === "Medium" || audit.google_business_score >= 10) {
    return "Medium";
  }

  return "Low";
}

function deriveUrgency(
  audit: AuditAnalysisResult,
  insights: AuditInsights
): LeadIntelligenceUrgency {
  const criticalGaps = [
    !audit.audit_has_cta,
    !audit.audit_has_phone,
    audit.overall_score < 50,
    audit.seo_score < 10,
    insights.weaknesses.length >= 4,
  ].filter(Boolean).length;

  if (criticalGaps >= 3 || audit.overall_score < 45) {
    return "High";
  }

  if (criticalGaps >= 1 || audit.overall_score < 65) {
    return "Medium";
  }

  return "Low";
}

function deriveConversionPotential(audit: AuditAnalysisResult) {
  const improvementRoom = 100 - audit.overall_score;
  const ctaGap = Math.max(0, 10 - audit.cta_score);
  const trustGap = Math.max(0, 3 - audit.trust_score);

  return clampScore(35 + improvementRoom * 0.45 + ctaGap * 3 + trustGap * 6);
}

function deriveRevenuePotential(
  audit: AuditAnalysisResult,
  idealPackage: LeadIntelligencePackage
) {
  const base = PACKAGE_REVENUE_WEIGHT[idealPackage];
  const needMultiplier =
    audit.overall_score < 60 ? 1.08 : audit.overall_score > 80 ? 0.88 : 1;

  return clampScore(base * needMultiplier);
}

function deriveClosingProbability(
  audit: AuditAnalysisResult,
  profile: BusinessProfile,
  insights: AuditInsights
) {
  let score = 42;

  if (audit.audit_has_phone) score += 8;
  if (audit.audit_has_email) score += 8;
  if (audit.audit_has_testimonials) score += 6;
  if (insights.prioritizedActions.length >= 2) score += 10;
  if (profile.biggestWeaknesses.length >= 2) score += 8;
  if (audit.overall_score < 55) score += 12;
  if (audit.overall_score > 85) score -= 10;

  return clampScore(score);
}

function deriveEstimatedLifetimeValue(
  idealPackage: LeadIntelligencePackage,
  profile: BusinessProfile
): LeadIntelligenceLifetimeValue {
  if (idealPackage === "Authority") {
    return "High";
  }

  if (idealPackage === "Growth") {
    return profile.estimatedBusinessSize.toLowerCase().includes("established")
      ? "High"
      : "Medium";
  }

  return "Low";
}

function buildReasoning(
  audit: AuditAnalysisResult,
  profile: BusinessProfile,
  insights: AuditInsights,
  idealPackage: LeadIntelligencePackage,
  urgency: LeadIntelligenceUrgency
) {
  const services =
    profile.mainServices.length > 0
      ? profile.mainServices.slice(0, 3).join(", ")
      : audit.audit_h1 ?? "their core services";

  const topWeakness =
    profile.biggestWeaknesses[0] ??
    insights.weaknesses[0] ??
    audit.top_improvement;

  return `Overall audit score is ${audit.overall_score}/100 with ${urgency.toLowerCase()} urgency. The business appears focused on ${services}. Key gap: ${topWeakness}. Recommended ${idealPackage} package based on ${profile.priorityFocus || audit.top_improvement}.`;
}

function buildNextBestAction(
  profile: BusinessProfile,
  insights: AuditInsights,
  audit: AuditAnalysisResult
) {
  return (
    profile.priorityFocus ||
    insights.prioritizedActions[0] ||
    audit.top_improvement ||
    "Schedule a discovery call to review audit findings."
  );
}

function buildLeadIntelligencePromptPayload(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile
) {
  return {
    audit: {
      overall_score: audit.overall_score,
      design_score: audit.design_score,
      mobile_score: audit.mobile_score,
      speed_score: audit.speed_score,
      seo_score: audit.seo_score,
      google_business_score: audit.google_business_score,
      cta_score: audit.cta_score,
      trust_score: audit.trust_score,
      ai_visibility_score: audit.ai_visibility_score,
      top_improvement: audit.top_improvement,
      audit_summary: audit.audit_summary,
      audit_title: audit.audit_title,
      audit_h1: audit.audit_h1,
      audit_has_cta: audit.audit_has_cta,
      audit_has_phone: audit.audit_has_phone,
      audit_has_email: audit.audit_has_email,
      audit_has_testimonials: audit.audit_has_testimonials,
      audit_has_google_maps: audit.audit_has_google_maps,
    },
    insights: {
      executiveSummary: insights.executiveSummary,
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      prioritizedActions: insights.prioritizedActions,
    },
    businessProfile: {
      businessSummary: profile.businessSummary,
      targetAudience: profile.targetAudience,
      mainServices: profile.mainServices,
      biggestWeaknesses: profile.biggestWeaknesses,
      biggestOpportunities: profile.biggestOpportunities,
      recommendedPackage: profile.recommendedPackage,
      estimatedBusinessSize: profile.estimatedBusinessSize,
      seoMaturity: profile.seoMaturity,
      conversionMaturity: profile.conversionMaturity,
      priorityFocus: profile.priorityFocus,
    },
  };
}

function generateDeterministicLeadIntelligence(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile
): LeadIntelligence {
  const idealPackage = deriveIdealPackage(audit, profile);
  const urgency = deriveUrgency(audit, insights);
  const competition = deriveCompetition(audit, profile);

  return {
    conversionPotential: deriveConversionPotential(audit),
    revenuePotential: deriveRevenuePotential(audit, idealPackage),
    closingProbability: deriveClosingProbability(audit, profile, insights),
    urgency,
    competition,
    idealPackage,
    estimatedLifetimeValue: deriveEstimatedLifetimeValue(idealPackage, profile),
    reasoning: buildReasoning(audit, profile, insights, idealPackage, urgency),
    nextBestAction: buildNextBestAction(profile, insights, audit),
  };
}

function mergeLeadIntelligence(
  fallback: LeadIntelligence,
  parsed: GptLeadIntelligenceResponse
): LeadIntelligence {
  const reasoning = normalizeString(parsed.reasoning);
  const nextBestAction = normalizeString(parsed.nextBestAction);

  return {
    conversionPotential: normalizeScore(
      parsed.conversionPotential,
      fallback.conversionPotential
    ),
    revenuePotential: normalizeScore(
      parsed.revenuePotential,
      fallback.revenuePotential
    ),
    closingProbability: normalizeScore(
      parsed.closingProbability,
      fallback.closingProbability
    ),
    urgency: normalizeLevel(parsed.urgency, LEVEL_VALUES, fallback.urgency),
    competition: normalizeLevel(
      parsed.competition,
      LEVEL_VALUES,
      fallback.competition
    ),
    idealPackage: normalizePackage(parsed.idealPackage, fallback.idealPackage),
    estimatedLifetimeValue: normalizeLevel(
      parsed.estimatedLifetimeValue,
      LEVEL_VALUES,
      fallback.estimatedLifetimeValue
    ),
    reasoning: reasoning || fallback.reasoning,
    nextBestAction: nextBestAction || fallback.nextBestAction,
  };
}

async function generateGptLeadIntelligence(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile,
  fallback: LeadIntelligence
): Promise<LeadIntelligence | null> {
  const parsed = await createJsonCompletion<GptLeadIntelligenceResponse>({
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You score sales lead intelligence for a web agency selling Starter, Growth, and Authority packages to local service businesses. Return strict JSON only with keys conversionPotential, revenuePotential, closingProbability, urgency, competition, idealPackage, estimatedLifetimeValue, reasoning, nextBestAction. Numeric scores must be integers from 0 to 100. urgency, competition, and estimatedLifetimeValue must be Low, Medium, or High. idealPackage must be Starter, Growth, or Authority. Base all judgments only on the provided audit, insights, and business profile data. Do not invent services, industries, or facts not present in the input. reasoning max 80 words. nextBestAction must be one concrete step grounded in prioritizedActions, priorityFocus, or top_improvement.",
      },
      {
        role: "user",
        content: `Generate lead intelligence from this data.\n\n${JSON.stringify(buildLeadIntelligencePromptPayload(audit, insights, profile), null, 2)}`,
      },
    ],
  });

  if (!parsed) {
    return null;
  }

  return mergeLeadIntelligence(fallback, parsed);
}

export async function generateLeadIntelligence(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile
): Promise<LeadIntelligence> {
  const fallback = generateDeterministicLeadIntelligence(audit, insights, profile);
  const gptIntelligence = await generateGptLeadIntelligence(
    audit,
    insights,
    profile,
    fallback
  );

  if (!gptIntelligence) {
    return fallback;
  }

  return gptIntelligence;
}
