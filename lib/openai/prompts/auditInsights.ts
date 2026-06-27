import type { AuditAnalysisResult } from "@/lib/audit";

export function buildAuditPromptPayload(audit: AuditAnalysisResult) {
  return {
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
  };
}

export const AUDIT_INSIGHTS_SYSTEM_PROMPT =
  "You analyze local business website audits for Invictus Digital. Return strict JSON only with keys executiveSummary, strengths, weaknesses, seoRecommendations, conversionRecommendations, localSeoRecommendations, aiVisibilityRecommendations, prioritizedActions. Recommendations must be specific, actionable, based on the audit values, and must not use generic marketing advice. Use short bullet-style strings. Limits: executiveSummary max 80 words; strengths max 4; weaknesses max 4; seoRecommendations max 5; conversionRecommendations max 5; localSeoRecommendations max 5; aiVisibilityRecommendations max 5; prioritizedActions max 5.";

export function buildAuditInsightsUserPrompt(audit: AuditAnalysisResult) {
  return `Analyze this website audit and return JSON only.\n\nAudit data:\n${JSON.stringify(buildAuditPromptPayload(audit), null, 2)}\n\nUse the audit scores and flags to make recommendations specific to this site. Reference missing elements such as title, meta description, H1, CTA, phone, schema, FAQ, testimonials, SSL, viewport, Open Graph, favicon, and Google Maps when relevant.`;
}
