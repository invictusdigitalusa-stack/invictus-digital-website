import "server-only";

import type { AuditInsights } from "./aiAudit";
import type { AuditAnalysisResult } from "./audit";
import type { BusinessProfile } from "./businessProfileTypes";
import { createJsonCompletion } from "./openai/jsonCompletion";
import { normalizeString, normalizeStringList } from "./utils/normalize";

type GptBusinessProfileResponse = Partial<BusinessProfile> & {
  mainServices?: unknown;
  uniqueSellingPoints?: unknown;
  competitiveAdvantages?: unknown;
  trustSignals?: unknown;
  biggestWeaknesses?: unknown;
  biggestOpportunities?: unknown;
};

const GPT_LIST_LIMITS: Partial<Record<keyof BusinessProfile, number>> = {
  mainServices: 5,
  uniqueSellingPoints: 4,
  competitiveAdvantages: 4,
  trustSignals: 5,
  biggestWeaknesses: 4,
  biggestOpportunities: 4,
};

function limitWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return words.join(" ");
  }

  return words.slice(0, maxWords).join(" ");
}

function scoreToMaturity(score: number, max: number) {
  const ratio = score / max;

  if (ratio >= 0.8) {
    return "High";
  }

  if (ratio >= 0.5) {
    return "Medium";
  }

  return "Low";
}

function recommendPackage(audit: AuditAnalysisResult) {
  if (audit.overall_score < 55) {
    return "Growth";
  }

  if (audit.overall_score < 75) {
    return "Growth";
  }

  if (
    audit.seo_score < 14 ||
    audit.ai_visibility_score < 3 ||
    audit.google_business_score < 11
  ) {
    return "Authority";
  }

  return "Starter";
}

function buildTrustSignals(audit: AuditAnalysisResult) {
  const signals: string[] = [];

  if (audit.audit_has_ssl) signals.push("Secure HTTPS website");
  if (audit.audit_has_testimonials) signals.push("Customer testimonials visible");
  if (audit.audit_has_phone) signals.push("Phone contact available");
  if (audit.audit_has_email) signals.push("Email contact available");
  if (audit.audit_has_google_maps) signals.push("Google Maps presence");
  if (audit.audit_has_schema) signals.push("Structured business schema");

  return signals;
}

function buildMainServices(audit: AuditAnalysisResult, insights: AuditInsights) {
  const services = normalizeStringList(insights.strengths, 3);

  if (services.length > 0) {
    return services;
  }

  if (audit.audit_h1) {
    return [audit.audit_h1];
  }

  return ["Core local services"];
}

function buildAuditPromptPayload(
  audit: AuditAnalysisResult,
  insights: AuditInsights
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
      audit_meta_description: audit.audit_meta_description,
      audit_h1: audit.audit_h1,
      audit_h2_count: audit.audit_h2_count,
      audit_images_without_alt: audit.audit_images_without_alt,
      audit_has_cta: audit.audit_has_cta,
      audit_has_phone: audit.audit_has_phone,
      audit_has_email: audit.audit_has_email,
      audit_has_google_maps: audit.audit_has_google_maps,
      audit_has_faq: audit.audit_has_faq,
      audit_has_testimonials: audit.audit_has_testimonials,
      audit_has_ssl: audit.audit_has_ssl,
      audit_has_viewport: audit.audit_has_viewport,
      audit_has_schema: audit.audit_has_schema,
      audit_has_open_graph: audit.audit_has_open_graph,
      audit_has_favicon: audit.audit_has_favicon,
    },
    insights,
  };
}

function generateDeterministicBusinessProfile(
  audit: AuditAnalysisResult,
  insights: AuditInsights
): BusinessProfile {
  const recommendedPackage = recommendPackage(audit);
  const trustSignals = buildTrustSignals(audit);
  const mainServices = buildMainServices(audit, insights);

  return {
    businessSummary: insights.executiveSummary,
    companyTone:
      audit.overall_score >= 75
        ? "Professional and established"
        : "Professional with room to sharpen messaging",
    targetAudience: "Local customers searching for trusted service providers",
    mainServices,
    uniqueSellingPoints: insights.strengths.slice(0, 4),
    competitiveAdvantages: insights.strengths.slice(0, 3),
    brandPositioning:
      audit.overall_score >= 70
        ? "Reliable local provider with a credible online presence"
        : "Local service provider that needs a stronger digital first impression",
    trustSignals:
      trustSignals.length > 0
        ? trustSignals
        : ["Trust signals need to be strengthened on the website"],
    biggestWeaknesses: insights.weaknesses.slice(0, 4),
    biggestOpportunities: insights.prioritizedActions.slice(0, 4),
    recommendedOffer:
      recommendedPackage === "Authority"
        ? "Authority Growth System with advanced local SEO"
        : "Growth System website with local SEO and conversion improvements",
    recommendedPackage,
    estimatedBusinessSize:
      audit.overall_score >= 80 ? "Established small business" : "Small local business",
    seoMaturity: scoreToMaturity(audit.seo_score, 20),
    conversionMaturity: scoreToMaturity(audit.cta_score, 10),
    aiVisibilityMaturity: scoreToMaturity(audit.ai_visibility_score, 5),
    priorityFocus:
      insights.prioritizedActions[0] ?? audit.top_improvement,

    email: "",
    phone: "",
    contactName: "",
    domain: "",

    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",

    googleBusinessProfile: "",
    googleMapsUrl: "",
  };
}

function mergeBusinessProfile(
  fallback: BusinessProfile,
  parsed: GptBusinessProfileResponse
): BusinessProfile {
  const businessSummary = normalizeString(parsed.businessSummary);

  return {
    businessSummary: businessSummary
      ? limitWords(businessSummary, 80)
      : fallback.businessSummary,
    companyTone: normalizeString(parsed.companyTone) || fallback.companyTone,
    targetAudience:
      normalizeString(parsed.targetAudience) || fallback.targetAudience,
    mainServices: (() => {
      const values = normalizeStringList(
        parsed.mainServices,
        GPT_LIST_LIMITS.mainServices ?? 5
      );
      return values.length > 0 ? values : fallback.mainServices;
    })(),
    uniqueSellingPoints: (() => {
      const values = normalizeStringList(
        parsed.uniqueSellingPoints,
        GPT_LIST_LIMITS.uniqueSellingPoints ?? 4
      );
      return values.length > 0 ? values : fallback.uniqueSellingPoints;
    })(),
    competitiveAdvantages: (() => {
      const values = normalizeStringList(
        parsed.competitiveAdvantages,
        GPT_LIST_LIMITS.competitiveAdvantages ?? 4
      );
      return values.length > 0 ? values : fallback.competitiveAdvantages;
    })(),
    brandPositioning:
      normalizeString(parsed.brandPositioning) || fallback.brandPositioning,
    trustSignals: (() => {
      const values = normalizeStringList(
        parsed.trustSignals,
        GPT_LIST_LIMITS.trustSignals ?? 5
      );
      return values.length > 0 ? values : fallback.trustSignals;
    })(),
    biggestWeaknesses: (() => {
      const values = normalizeStringList(
        parsed.biggestWeaknesses,
        GPT_LIST_LIMITS.biggestWeaknesses ?? 4
      );
      return values.length > 0 ? values : fallback.biggestWeaknesses;
    })(),
    biggestOpportunities: (() => {
      const values = normalizeStringList(
        parsed.biggestOpportunities,
        GPT_LIST_LIMITS.biggestOpportunities ?? 4
      );
      return values.length > 0 ? values : fallback.biggestOpportunities;
    })(),
    recommendedOffer:
      normalizeString(parsed.recommendedOffer) || fallback.recommendedOffer,
    recommendedPackage:
      normalizeString(parsed.recommendedPackage) || fallback.recommendedPackage,
    estimatedBusinessSize:
      normalizeString(parsed.estimatedBusinessSize) ||
      fallback.estimatedBusinessSize,
    seoMaturity: normalizeString(parsed.seoMaturity) || fallback.seoMaturity,
    conversionMaturity:
      normalizeString(parsed.conversionMaturity) || fallback.conversionMaturity,
    aiVisibilityMaturity:
      normalizeString(parsed.aiVisibilityMaturity) ||
      fallback.aiVisibilityMaturity,
    priorityFocus:
      normalizeString(parsed.priorityFocus) || fallback.priorityFocus,

    email: normalizeString((parsed as any).email) || fallback.email,
    phone: normalizeString((parsed as any).phone) || fallback.phone,
    contactName:
      normalizeString((parsed as any).contactName) || fallback.contactName,
    domain: normalizeString((parsed as any).domain) || fallback.domain,

    facebook: normalizeString((parsed as any).facebook) || fallback.facebook,
    instagram: normalizeString((parsed as any).instagram) || fallback.instagram,
    linkedin: normalizeString((parsed as any).linkedin) || fallback.linkedin,
    youtube: normalizeString((parsed as any).youtube) || fallback.youtube,

    googleBusinessProfile:
      normalizeString((parsed as any).googleBusinessProfile) ||
      fallback.googleBusinessProfile,
    googleMapsUrl:
      normalizeString((parsed as any).googleMapsUrl) ||
      fallback.googleMapsUrl,
  };
}

async function generateGptBusinessProfile(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  fallback: BusinessProfile
): Promise<BusinessProfile | null> {
  const parsed = await createJsonCompletion<GptBusinessProfileResponse>({
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You build business intelligence profiles for local service businesses from website audit data. Return strict JSON only with keys businessSummary, companyTone, targetAudience, mainServices, uniqueSellingPoints, competitiveAdvantages, brandPositioning, trustSignals, biggestWeaknesses, biggestOpportunities, recommendedOffer, recommendedPackage, estimatedBusinessSize, seoMaturity, conversionMaturity, aiVisibilityMaturity, priorityFocus. Be specific to the audit. Avoid generic marketing language. recommendedPackage must be one of Starter, Growth, or Authority. Maturity fields must be Low, Medium, or High. businessSummary max 80 words. mainServices max 5 items. uniqueSellingPoints max 4. competitiveAdvantages max 4. trustSignals max 5. biggestWeaknesses max 4. biggestOpportunities max 4.",
      },
      {
        role: "user",
        content: `Create a business profile from this audit and insight data.\n\n${JSON.stringify(buildAuditPromptPayload(audit, insights), null, 2)}`,
      },
    ],
  });

  if (!parsed) {
    return null;
  }

  return mergeBusinessProfile(fallback, parsed);
}

export type { BusinessProfile } from "./businessProfileTypes";

export async function generateBusinessProfile(
  audit: AuditAnalysisResult,
  insights: AuditInsights
): Promise<BusinessProfile> {
  const fallback = generateDeterministicBusinessProfile(audit, insights);
  const gptProfile = await generateGptBusinessProfile(audit, insights, fallback);

  if (!gptProfile) {
    return fallback;
  }

  return gptProfile;
}
