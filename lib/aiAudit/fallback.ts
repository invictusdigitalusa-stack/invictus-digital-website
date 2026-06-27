import type { AuditAnalysisResult } from "@/lib/audit";
import type { AuditInsights } from "./types";

type RecommendationRule = {
  when: (audit: AuditAnalysisResult) => boolean;
  recommend: string;
};

type InsightRule = {
  when: (audit: AuditAnalysisResult) => boolean;
  message: string;
};

const SCORE_THRESHOLDS = {
  design: 10,
  mobile: 10,
  speed: 10,
  seo: 12,
  googleBusiness: 10,
  cta: 8,
  trust: 3,
  aiVisibility: 4,
} as const;

function isScoreBelow(score: number, threshold: number) {
  return score < threshold;
}

function isScoreAtLeast(score: number, max: number, ratio = 0.8) {
  return score / max >= ratio;
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function applyRecommendationRules(
  rules: RecommendationRule[],
  audit: AuditAnalysisResult
) {
  return unique(
    rules.filter((rule) => rule.when(audit)).map((rule) => rule.recommend)
  );
}

function applyInsightRules(rules: InsightRule[], audit: AuditAnalysisResult) {
  return unique(rules.filter((rule) => rule.when(audit)).map((rule) => rule.message));
}

function buildDesignRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) => isScoreBelow(value.design_score, SCORE_THRESHOLDS.design),
        recommend: "Improve spacing and whitespace to create clearer visual rhythm.",
      },
      {
        when: (value) => isScoreBelow(value.design_score, SCORE_THRESHOLDS.design),
        recommend: "Strengthen typography hierarchy with clearer heading styles.",
      },
      {
        when: (value) => isScoreBelow(value.design_score, SCORE_THRESHOLDS.design),
        recommend: "Clarify page hierarchy so key sections stand out above the fold.",
      },
      {
        when: (value) => !value.audit_has_favicon,
        recommend: "Add a favicon to improve brand polish and trust.",
      },
      {
        when: (value) => !value.audit_has_open_graph,
        recommend: "Add Open Graph tags for better link previews on social platforms.",
      },
      {
        when: (value) => value.audit_images_without_alt > 0,
        recommend: "Add descriptive alt text to images for accessibility and clarity.",
      },
    ],
    audit
  );
}

function buildMobileRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) => isScoreBelow(value.mobile_score, SCORE_THRESHOLDS.mobile),
        recommend: "Add a mobile viewport meta tag for responsive rendering.",
      },
      {
        when: (value) => isScoreBelow(value.mobile_score, SCORE_THRESHOLDS.mobile),
        recommend: "Review tap targets and spacing on mobile breakpoints.",
      },
    ],
    audit
  );
}

function buildSpeedRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) => isScoreBelow(value.speed_score, SCORE_THRESHOLDS.speed),
        recommend: "Reduce page weight by optimizing images and scripts.",
      },
      {
        when: (value) => isScoreBelow(value.speed_score, SCORE_THRESHOLDS.speed),
        recommend: "Limit third-party scripts that slow initial page load.",
      },
    ],
    audit
  );
}

function buildSeoRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) => isScoreBelow(value.seo_score, SCORE_THRESHOLDS.seo),
        recommend: "Improve page titles with clearer service and location keywords.",
      },
      {
        when: (value) => isScoreBelow(value.seo_score, SCORE_THRESHOLDS.seo),
        recommend: "Add or refine meta descriptions for stronger search snippets.",
      },
      {
        when: (value) => isScoreBelow(value.seo_score, SCORE_THRESHOLDS.seo),
        recommend: "Add structured schema markup to help search engines understand the business.",
      },
      {
        when: (value) => isScoreBelow(value.seo_score, SCORE_THRESHOLDS.seo),
        recommend: "Strengthen internal links between service and location pages.",
      },
      {
        when: (value) => !value.audit_title,
        recommend: "Add a descriptive title tag that includes the business name and core service.",
      },
      {
        when: (value) => !value.audit_meta_description,
        recommend: "Write a compelling meta description to improve click-through rate.",
      },
      {
        when: (value) => !value.audit_h1,
        recommend: "Add a single clear H1 that states what the business does.",
      },
      {
        when: (value) => !value.audit_has_ssl,
        recommend: "Serve the site over HTTPS to protect users and support SEO.",
      },
    ],
    audit
  );
}

function buildConversionRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) => isScoreBelow(value.cta_score, SCORE_THRESHOLDS.cta),
        recommend: "Use a stronger primary call-to-action with action-oriented copy.",
      },
      {
        when: (value) => isScoreBelow(value.cta_score, SCORE_THRESHOLDS.cta),
        recommend: "Place a primary CTA above the fold on the homepage.",
      },
      {
        when: (value) => !value.audit_has_cta,
        recommend: "Add visible quote, contact, or schedule buttons on key pages.",
      },
      {
        when: (value) => !value.audit_has_phone,
        recommend: "Add a click-to-call phone number for faster lead capture.",
      },
      {
        when: (value) => !value.audit_has_email,
        recommend: "Make contact email or form paths easy to find.",
      },
      {
        when: (value) => isScoreBelow(value.trust_score, SCORE_THRESHOLDS.trust),
        recommend: "Add customer testimonials or reviews to improve conversion trust.",
      },
      {
        when: (value) => !value.audit_has_testimonials,
        recommend: "Show social proof near primary conversion points.",
      },
    ],
    audit
  );
}

function buildLocalSeoRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) =>
          isScoreBelow(value.google_business_score, SCORE_THRESHOLDS.googleBusiness),
        recommend: "Optimize the Google Business Profile with services, photos, and categories.",
      },
      {
        when: (value) =>
          isScoreBelow(value.google_business_score, SCORE_THRESHOLDS.googleBusiness),
        recommend: "Build a review generation process to increase local trust signals.",
      },
      {
        when: (value) => !value.audit_has_google_maps,
        recommend: "Embed Google Maps or add a directions link to reinforce local presence.",
      },
      {
        when: (value) => !value.audit_has_phone,
        recommend: "Display a local phone number prominently for service-area customers.",
      },
      {
        when: (value) => !value.audit_has_schema,
        recommend: "Add LocalBusiness schema with service area and contact details.",
      },
    ],
    audit
  );
}

function buildAiVisibilityRecommendations(audit: AuditAnalysisResult) {
  return applyRecommendationRules(
    [
      {
        when: (value) =>
          isScoreBelow(value.ai_visibility_score, SCORE_THRESHOLDS.aiVisibility),
        recommend: "Structure core service content with clear headings and concise answers.",
      },
      {
        when: (value) =>
          isScoreBelow(value.ai_visibility_score, SCORE_THRESHOLDS.aiVisibility),
        recommend: "Add FAQ schema for common customer questions.",
      },
      {
        when: (value) => !value.audit_has_faq,
        recommend: "Publish an FAQ section covering pricing, service area, and process questions.",
      },
      {
        when: (value) => !value.audit_has_schema,
        recommend: "Add structured data so AI systems can parse services and business details.",
      },
      {
        when: (value) => !value.audit_has_open_graph,
        recommend: "Add Open Graph metadata to improve content clarity when shared.",
      },
    ],
    audit
  );
}

function buildStrengths(audit: AuditAnalysisResult) {
  return applyInsightRules(
    [
      {
        when: (value) => isScoreAtLeast(value.design_score, 15),
        message: "Visual design fundamentals are in good shape.",
      },
      {
        when: (value) => isScoreAtLeast(value.mobile_score, 15),
        message: "The site has a solid mobile-ready foundation.",
      },
      {
        when: (value) => isScoreAtLeast(value.speed_score, 15),
        message: "Page performance is competitive for a local business site.",
      },
      {
        when: (value) => isScoreAtLeast(value.seo_score, 20),
        message: "Core SEO elements are well established.",
      },
      {
        when: (value) => isScoreAtLeast(value.google_business_score, 15),
        message: "Local presence signals are strong.",
      },
      {
        when: (value) => isScoreAtLeast(value.cta_score, 10),
        message: "Conversion paths and calls-to-action are clearly defined.",
      },
      {
        when: (value) => isScoreAtLeast(value.trust_score, 5),
        message: "Trust signals support lead generation.",
      },
      {
        when: (value) => isScoreAtLeast(value.ai_visibility_score, 5),
        message: "Content structure supports AI and search discovery.",
      },
      {
        when: (value) => Boolean(value.audit_has_ssl),
        message: "The site is served securely over HTTPS.",
      },
    ],
    audit
  );
}

function buildWeaknesses(audit: AuditAnalysisResult) {
  return applyInsightRules(
    [
      {
        when: (value) => isScoreBelow(value.design_score, SCORE_THRESHOLDS.design),
        message: "Design hierarchy and polish need improvement.",
      },
      {
        when: (value) => isScoreBelow(value.mobile_score, SCORE_THRESHOLDS.mobile),
        message: "Mobile experience needs refinement.",
      },
      {
        when: (value) => isScoreBelow(value.speed_score, SCORE_THRESHOLDS.speed),
        message: "Page speed is limiting first impressions.",
      },
      {
        when: (value) => isScoreBelow(value.seo_score, SCORE_THRESHOLDS.seo),
        message: "Search visibility is being held back by missing SEO fundamentals.",
      },
      {
        when: (value) =>
          isScoreBelow(value.google_business_score, SCORE_THRESHOLDS.googleBusiness),
        message: "Local SEO signals are underdeveloped.",
      },
      {
        when: (value) => isScoreBelow(value.cta_score, SCORE_THRESHOLDS.cta),
        message: "Conversion paths are too weak or hard to find.",
      },
      {
        when: (value) => isScoreBelow(value.trust_score, SCORE_THRESHOLDS.trust),
        message: "Trust and social proof are insufficient.",
      },
      {
        when: (value) =>
          isScoreBelow(value.ai_visibility_score, SCORE_THRESHOLDS.aiVisibility),
        message: "Content is not structured for AI discovery.",
      },
    ],
    audit
  );
}

function buildExecutiveSummary(
  audit: AuditAnalysisResult,
  weaknesses: string[],
  prioritizedActions: string[]
) {
  const primaryAction = prioritizedActions[0] ?? audit.top_improvement;

  if (audit.overall_score >= 85) {
    return `This website scores ${audit.overall_score}/100 and is in strong shape overall. Focus next on ${primaryAction.toLowerCase()} to maximize conversions and local visibility.`;
  }

  if (audit.overall_score >= 70) {
    return `This website scores ${audit.overall_score}/100 with a solid foundation but clear room to improve. The biggest opportunities are in ${weaknesses[0]?.toLowerCase() ?? "conversion and local visibility"}. Start with ${primaryAction.toLowerCase()}.`;
  }

  return `This website scores ${audit.overall_score}/100 and is missing several high-impact improvements. Priority focus: ${primaryAction}. Addressing this will improve search visibility, trust, and lead generation.`;
}

function buildPrioritizedActions(
  audit: AuditAnalysisResult,
  recommendations: {
    seoRecommendations: string[];
    conversionRecommendations: string[];
    localSeoRecommendations: string[];
    aiVisibilityRecommendations: string[];
    designRecommendations: string[];
  }
) {
  const ordered = unique([
    audit.top_improvement,
    ...recommendations.conversionRecommendations,
    ...recommendations.seoRecommendations,
    ...recommendations.localSeoRecommendations,
    ...recommendations.aiVisibilityRecommendations,
    ...recommendations.designRecommendations,
  ]);

  return ordered.slice(0, 8);
}

export function generateDeterministicInsights(
  audit: AuditAnalysisResult
): AuditInsights {
  const designRecommendations = buildDesignRecommendations(audit);
  const seoRecommendations = unique([
    ...buildSeoRecommendations(audit),
    ...buildMobileRecommendations(audit),
    ...buildSpeedRecommendations(audit),
  ]);
  const conversionRecommendations = buildConversionRecommendations(audit);
  const localSeoRecommendations = buildLocalSeoRecommendations(audit);
  const aiVisibilityRecommendations = buildAiVisibilityRecommendations(audit);
  const strengths = buildStrengths(audit);
  const weaknesses = buildWeaknesses(audit);
  const prioritizedActions = buildPrioritizedActions(audit, {
    seoRecommendations,
    conversionRecommendations,
    localSeoRecommendations,
    aiVisibilityRecommendations,
    designRecommendations,
  });
  const executiveSummary = buildExecutiveSummary(
    audit,
    weaknesses,
    prioritizedActions
  );

  return {
    executiveSummary,
    strengths,
    weaknesses,
    seoRecommendations,
    conversionRecommendations,
    localSeoRecommendations,
    aiVisibilityRecommendations,
    prioritizedActions,
  };
}
