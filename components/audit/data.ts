export const industries = [
  "Landscaping",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Painting",
  "Concrete",
] as const;

export type Industry = (typeof industries)[number];

export const scoreCategories = [
  { label: "Design", key: "design_score", max: 15 },
  { label: "Mobile", key: "mobile_score", max: 15 },
  { label: "Speed", key: "speed_score", max: 15 },
  { label: "SEO", key: "seo_score", max: 20 },
  { label: "Google Business", key: "google_business_score", max: 15 },
  { label: "CTA", key: "cta_score", max: 10 },
  { label: "Trust", key: "trust_score", max: 5 },
  { label: "AI Visibility", key: "ai_visibility_score", max: 5 },
] as const;

export const overallMax = 100;
