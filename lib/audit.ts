export type AuditAnalysisResult = {
  overall_score: number;
  design_score: number;
  mobile_score: number;
  speed_score: number;
  seo_score: number;
  google_business_score: number;
  cta_score: number;
  trust_score: number;
  ai_visibility_score: number;
  top_improvement: string;
  audit_summary: string;
  audit_title: string | null;
  audit_meta_description: string | null;
  audit_h1: string | null;
  audit_h2_count: number;
  audit_images_without_alt: number;
  audit_has_cta: boolean;
  audit_has_phone: boolean;
  audit_has_email: boolean;
  audit_has_google_maps: boolean;
  audit_has_faq: boolean;
  audit_has_testimonials: boolean;
  audit_has_ssl: boolean;
  audit_has_viewport: boolean;
  audit_has_schema: boolean;
  audit_has_open_graph: boolean;
  audit_has_favicon: boolean;
};

type WebsiteChecks = {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  h2Count: number;
  imagesWithoutAlt: number;
  totalImages: number;
  hasCta: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasGoogleMaps: boolean;
  hasFaq: boolean;
  hasTestimonials: boolean;
  hasSsl: boolean;
  hasViewport: boolean;
  hasSchema: boolean;
  hasOpenGraph: boolean;
  hasFavicon: boolean;
  hasButton: boolean;
  hasLocalBusinessSchema: boolean;
  responseMs: number;
  htmlSize: number;
  scriptCount: number;
};

const improvementCatalog = [
  {
    key: "title",
    test: (checks: WebsiteChecks) => !checks.title,
    title: "Add a descriptive page title",
    description:
      "Write a clear title tag that includes the business name and primary service area.",
  },
  {
    key: "meta",
    test: (checks: WebsiteChecks) => !checks.metaDescription,
    title: "Add a meta description",
    description:
      "Add a compelling meta description to improve click-through rates from search results.",
  },
  {
    key: "h1",
    test: (checks: WebsiteChecks) => !checks.h1,
    title: "Add a clear H1 headline",
    description:
      "Use one primary H1 that states what the business does and who it serves.",
  },
  {
    key: "viewport",
    test: (checks: WebsiteChecks) => !checks.hasViewport,
    title: "Add mobile viewport meta tag",
    description:
      "Include a viewport meta tag so the site renders correctly on phones and tablets.",
  },
  {
    key: "cta",
    test: (checks: WebsiteChecks) => !checks.hasCta,
    title: "Improve CTA placement",
    description:
      "Place stronger call-to-action buttons above the fold and at key decision points.",
  },
  {
    key: "phone",
    test: (checks: WebsiteChecks) => !checks.hasPhone,
    title: "Add a visible phone number",
    description:
      "Make it easy for local customers to call with a prominent phone number or click-to-call link.",
  },
  {
    key: "schema",
    test: (checks: WebsiteChecks) => !checks.hasSchema,
    title: "Add structured schema markup",
    description:
      "Add LocalBusiness or Service schema to help search engines understand the business.",
  },
  {
    key: "faq",
    test: (checks: WebsiteChecks) => !checks.hasFaq,
    title: "Add FAQ schema",
    description:
      "Structure common customer questions with FAQ content and schema markup.",
  },
  {
    key: "testimonials",
    test: (checks: WebsiteChecks) => !checks.hasTestimonials,
    title: "Add customer testimonials",
    description:
      "Show social proof with reviews or testimonials to build trust with new visitors.",
  },
  {
    key: "alt",
    test: (checks: WebsiteChecks) => checks.imagesWithoutAlt > 0,
    title: "Add alt text to images",
    description:
      "Add descriptive alt text to images for accessibility and image SEO.",
  },
  {
    key: "ssl",
    test: (checks: WebsiteChecks) => !checks.hasSsl,
    title: "Enable SSL (HTTPS)",
    description:
      "Serve the website over HTTPS to improve trust, security, and search visibility.",
  },
  {
    key: "og",
    test: (checks: WebsiteChecks) => !checks.hasOpenGraph,
    title: "Add Open Graph tags",
    description:
      "Add Open Graph metadata so shared links look professional on social platforms.",
  },
  {
    key: "favicon",
    test: (checks: WebsiteChecks) => !checks.hasFavicon,
    title: "Add a favicon",
    description:
      "Add a favicon to improve brand polish in browser tabs and bookmarks.",
  },
  {
    key: "maps",
    test: (checks: WebsiteChecks) => !checks.hasGoogleMaps,
    title: "Embed Google Maps",
    description:
      "Add a map or directions link to reinforce local presence and make visiting easier.",
  },
  {
    key: "email",
    test: (checks: WebsiteChecks) => !checks.hasEmail,
    title: "Add a contact email",
    description:
      "Provide a visible email address or contact form path for lead capture.",
  },
];

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaContent(html: string, name: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["'][^>]*>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return null;
}

function getOpenGraphContent(html: string, property: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["'][^>]*>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return null;
}

function normalizeAuditUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function analyzeHtml(html: string, finalUrl: string, responseMs: number): WebsiteChecks {
  const lowerHtml = html.toLowerCase();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1] ? decodeHtml(titleMatch[1]) : null;
  const metaDescription = getMetaContent(html, "description");
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match?.[1] ? decodeHtml(h1Match[1].replace(/<[^>]+>/g, "")) : null;
  const h2Count = (html.match(/<h2[\s>]/gi) ?? []).length;

  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  let imagesWithoutAlt = 0;

  for (const tag of imageTags) {
    const altMatch = tag.match(/\salt=["']([^"']*)["']/i);
    if (!altMatch || !altMatch[1].trim()) {
      imagesWithoutAlt += 1;
    }
  }

  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasOpenGraph =
    Boolean(getOpenGraphContent(html, "og:title")) ||
    Boolean(getOpenGraphContent(html, "og:description")) ||
    /<meta[^>]+property=["']og:/i.test(html);
  const hasFavicon =
    /<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html) ||
    /<link[^>]+rel=["']apple-touch-icon["']/i.test(html);
  const hasSchema =
    /<script[^>]+type=["']application\/ld\+json["']/i.test(html) ||
    /itemtype=["']https?:\/\/schema\.org\//i.test(html) ||
    /"@type"\s*:\s*"/i.test(html);
  const hasLocalBusinessSchema =
    /LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|LandscapeBusiness/i.test(
      html
    );
  const hasButton = /<button\b/i.test(html);

  const hasPhone =
    /href=["']tel:/i.test(html) ||
    /\(\d{3}\)\s*\d{3}[-.\s]\d{4}/.test(html) ||
    /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/.test(html);
  const hasEmail =
    /href=["']mailto:/i.test(html) ||
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(html);
  const hasGoogleMaps =
    /google\.[a-z.]+\/maps/i.test(html) ||
    /maps\.google\./i.test(html) ||
    /maps\.app\.goo\.gl/i.test(html) ||
    /google\.com\/maps\/embed/i.test(html);
  const hasFaq =
    /\bfaq\b/i.test(html) ||
    /frequently asked questions/i.test(html) ||
    /"@type"\s*:\s*"FAQPage"/i.test(html);
  const hasTestimonials =
    /testimonial/i.test(html) ||
    /customer review/i.test(html) ||
    /what our customers say/i.test(html) ||
    /review/i.test(html);
  const hasCta =
    /<button\b/i.test(html) ||
    /\b(get a quote|request a quote|free estimate|contact us|schedule|book now|call now|get started)\b/i.test(
      lowerHtml
    ) ||
    /class=["'][^"']*(?:btn|button|cta)[^"']*["']/i.test(html);

  const scriptCount = (html.match(/<script\b/gi) ?? []).length;
  const hasSsl = finalUrl.startsWith("https://");

  return {
    title,
    metaDescription,
    h1,
    h2Count,
    imagesWithoutAlt,
    totalImages: imageTags.length,
    hasCta,
    hasPhone,
    hasEmail,
    hasGoogleMaps,
    hasFaq,
    hasTestimonials,
    hasSsl,
    hasViewport,
    hasSchema,
    hasOpenGraph,
    hasFavicon,
    hasButton,
    hasLocalBusinessSchema,
    responseMs,
    htmlSize: html.length,
    scriptCount,
  };
}

function clampScore(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

function scoreWebsite(checks: WebsiteChecks) {
  let designScore = 0;
  let mobileScore = 0;
  let speedScore = 0;
  let seoScore = 0;
  let googleBusinessScore = 0;
  let ctaScore = 0;
  let trustScore = 0;
  let aiVisibilityScore = 0;

  if (checks.hasFavicon) designScore += 3;
  if (checks.hasOpenGraph) designScore += 3;
  if (checks.h1) designScore += 3;
  if (checks.h2Count >= 2) designScore += 3;
  if (checks.totalImages === 0) {
    designScore += 3;
  } else if (checks.imagesWithoutAlt === 0) {
    designScore += 3;
  } else if (checks.imagesWithoutAlt <= Math.ceil(checks.totalImages / 2)) {
    designScore += 1;
  }

  if (checks.hasViewport) mobileScore += 10;
  if (checks.hasFavicon) mobileScore += 2;
  if (checks.hasOpenGraph) mobileScore += 3;

  if (checks.responseMs < 1000) speedScore += 7;
  else if (checks.responseMs < 2000) speedScore += 5;
  else if (checks.responseMs < 4000) speedScore += 3;
  else speedScore += 1;

  if (checks.htmlSize < 500_000) speedScore += 4;
  else if (checks.htmlSize < 1_000_000) speedScore += 2;

  if (checks.scriptCount < 15) speedScore += 4;
  else if (checks.scriptCount < 30) speedScore += 2;

  if (checks.title && checks.title.length >= 10 && checks.title.length <= 60) {
    seoScore += 5;
  } else if (checks.title) {
    seoScore += 2;
  }

  if (checks.metaDescription) seoScore += 5;
  if (checks.h1) seoScore += 5;
  if (checks.h2Count >= 1) seoScore += 3;
  if (checks.hasSchema) seoScore += 2;

  if (checks.hasPhone) googleBusinessScore += 5;
  if (checks.hasGoogleMaps) googleBusinessScore += 5;
  if (checks.hasEmail) googleBusinessScore += 3;
  if (checks.hasLocalBusinessSchema) googleBusinessScore += 2;
  else if (checks.hasSchema) googleBusinessScore += 1;

  if (checks.hasCta) ctaScore += 6;
  if (checks.hasPhone) ctaScore += 2;
  if (checks.hasButton) ctaScore += 2;

  if (checks.hasTestimonials) trustScore += 3;
  if (checks.hasFaq) trustScore += 2;

  if (checks.hasSchema) aiVisibilityScore += 2;
  if (checks.hasFaq) aiVisibilityScore += 2;
  if (checks.hasOpenGraph) aiVisibilityScore += 1;

  designScore = clampScore(designScore, 15);
  mobileScore = clampScore(mobileScore, 15);
  speedScore = clampScore(speedScore, 15);
  seoScore = clampScore(seoScore, 20);
  googleBusinessScore = clampScore(googleBusinessScore, 15);
  ctaScore = clampScore(ctaScore, 10);
  trustScore = clampScore(trustScore, 5);
  aiVisibilityScore = clampScore(aiVisibilityScore, 5);

  const overallScore =
    designScore +
    mobileScore +
    speedScore +
    seoScore +
    googleBusinessScore +
    ctaScore +
    trustScore +
    aiVisibilityScore;

  const topImprovement =
    improvementCatalog.find((item) => item.test(checks))?.title ??
    "Expand local service pages";

  const passedChecks = [
    checks.title && "title tag",
    checks.metaDescription && "meta description",
    checks.h1 && "H1 headline",
    checks.hasViewport && "mobile viewport",
    checks.hasCta && "clear CTA",
    checks.hasPhone && "phone number",
    checks.hasSchema && "schema markup",
    checks.hasSsl && "SSL",
  ].filter(Boolean);

  const auditSummary =
    passedChecks.length > 0
      ? `The site includes ${passedChecks.slice(0, 4).join(", ")}. Overall score is ${overallScore}/100 with room to improve ${topImprovement.toLowerCase()}.`
      : `The website is missing several core conversion and SEO elements. Priority fix: ${topImprovement}.`;

  return {
    overall_score: overallScore,
    design_score: designScore,
    mobile_score: mobileScore,
    speed_score: speedScore,
    seo_score: seoScore,
    google_business_score: googleBusinessScore,
    cta_score: ctaScore,
    trust_score: trustScore,
    ai_visibility_score: aiVisibilityScore,
    top_improvement: topImprovement,
    audit_summary: auditSummary,
    audit_title: checks.title,
    audit_meta_description: checks.metaDescription,
    audit_h1: checks.h1,
    audit_h2_count: checks.h2Count,
    audit_images_without_alt: checks.imagesWithoutAlt,
    audit_has_cta: checks.hasCta,
    audit_has_phone: checks.hasPhone,
    audit_has_email: checks.hasEmail,
    audit_has_google_maps: checks.hasGoogleMaps,
    audit_has_faq: checks.hasFaq,
    audit_has_testimonials: checks.hasTestimonials,
    audit_has_ssl: checks.hasSsl,
    audit_has_viewport: checks.hasViewport,
    audit_has_schema: checks.hasSchema,
    audit_has_open_graph: checks.hasOpenGraph,
    audit_has_favicon: checks.hasFavicon,
  };
}

export function buildImprovementSuggestions(
  audit: AuditAnalysisResult
): { title: string; description: string }[] {
  const checks: WebsiteChecks = {
    title: audit.audit_title,
    metaDescription: audit.audit_meta_description,
    h1: audit.audit_h1,
    h2Count: audit.audit_h2_count,
    imagesWithoutAlt: audit.audit_images_without_alt,
    totalImages: audit.audit_images_without_alt,
    hasCta: audit.audit_has_cta,
    hasPhone: audit.audit_has_phone,
    hasEmail: audit.audit_has_email,
    hasGoogleMaps: audit.audit_has_google_maps,
    hasFaq: audit.audit_has_faq,
    hasTestimonials: audit.audit_has_testimonials,
    hasSsl: audit.audit_has_ssl,
    hasViewport: audit.audit_has_viewport,
    hasSchema: audit.audit_has_schema,
    hasOpenGraph: audit.audit_has_open_graph,
    hasFavicon: audit.audit_has_favicon,
    hasButton: audit.audit_has_cta,
    hasLocalBusinessSchema: audit.audit_has_schema,
    responseMs: 0,
    htmlSize: 0,
    scriptCount: 0,
  };

  const suggestions = improvementCatalog
    .filter((item) => item.test(checks))
    .map(({ title, description }) => ({ title, description }));

  if (suggestions.length === 0) {
    return [
      {
        title: audit.top_improvement,
        description:
          "Continue optimizing the site to improve conversions and local visibility.",
      },
    ];
  }

  return suggestions.slice(0, 3);
}

export async function analyzeWebsite(
  website: string
): Promise<AuditAnalysisResult> {
  const url = normalizeAuditUrl(website);

  if (!url) {
    throw new Error("Website URL is required.");
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "InvictusAuditBot/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Website returned HTTP ${response.status}.`);
    }

    const html = await response.text();
    const responseMs = Date.now() - startedAt;
    const finalUrl = response.url || url;
    const checks = analyzeHtml(html, finalUrl, responseMs);

    return scoreWebsite(checks);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Website request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getAuditGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
