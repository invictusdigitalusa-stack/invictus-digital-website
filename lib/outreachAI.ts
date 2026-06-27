import "server-only";

import type { AuditInsights } from "./aiAudit";
import type { AuditAnalysisResult } from "./audit";
import type { BusinessProfile } from "./businessProfileTypes";
import type { LeadIntelligence } from "./leadIntelligence";
import { createJsonCompletion } from "./openai/jsonCompletion";
import { generateFallbackOutreach } from "./outreachFallback";
import type { OutreachEmail, OutreachFallbackInput } from "./outreachTypes";
import { normalizeString } from "./utils/normalize";

type GptOutreachResponse = Partial<OutreachEmail>;

const MIN_WORDS = 120;
const MAX_WORDS = 220;

function countWords(parts: string[]) {
  return parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function buildOutreachPromptPayload(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile,
  intelligence: LeadIntelligence,
  companyName: string,
  industry: string
) {
  return {
    companyName,
    industry,
    audit: {
      top_improvement: audit.top_improvement,
      audit_summary: audit.audit_summary,
      audit_title: audit.audit_title,
      audit_h1: audit.audit_h1,
      audit_has_cta: audit.audit_has_cta,
      audit_has_phone: audit.audit_has_phone,
      audit_has_testimonials: audit.audit_has_testimonials,
      audit_has_google_maps: audit.audit_has_google_maps,
    },
    insights: {
      executiveSummary: insights.executiveSummary,
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      prioritizedActions: insights.prioritizedActions,
      conversionRecommendations: insights.conversionRecommendations,
      localSeoRecommendations: insights.localSeoRecommendations,
    },
    businessProfile: {
      businessSummary: profile.businessSummary,
      companyTone: profile.companyTone,
      mainServices: profile.mainServices,
      biggestWeaknesses: profile.biggestWeaknesses,
      biggestOpportunities: profile.biggestOpportunities,
      priorityFocus: profile.priorityFocus,
      recommendedOffer: profile.recommendedOffer,
    },
    leadIntelligence: {
      idealPackage: intelligence.idealPackage,
      urgency: intelligence.urgency,
      nextBestAction: intelligence.nextBestAction,
      reasoning: intelligence.reasoning,
    },
  };
}

function buildFallbackInput(
  companyName: string,
  industry: string,
  topImprovement: string,
  tone: OutreachFallbackInput["tone"],
  intelligence: LeadIntelligence
): OutreachFallbackInput {
  return {
    companyName,
    industry,
    topImprovement,
    tone,
    idealPackage: intelligence.idealPackage,
  };
}

function isValidOutreachEmail(email: OutreachEmail) {
  if (
    !email.subject ||
    !email.opening ||
    !email.body ||
    !email.cta
  ) {
    return false;
  }

  const wordCount = countWords([email.opening, email.body, email.cta]);
  return wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;
}

function mergeOutreachEmail(
  fallback: OutreachEmail,
  parsed: GptOutreachResponse
): OutreachEmail {
  return {
    subject: normalizeString(parsed.subject) || fallback.subject,
    opening: normalizeString(parsed.opening) || fallback.opening,
    body: normalizeString(parsed.body) || fallback.body,
    cta: normalizeString(parsed.cta) || fallback.cta,
  };
}

async function generateGptOutreachEmail(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile,
  intelligence: LeadIntelligence,
  companyName: string,
  industry: string,
  fallback: OutreachEmail
): Promise<OutreachEmail | null> {
  const parsed = await createJsonCompletion<GptOutreachResponse>({
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You write personalized cold outreach emails for Invictus Digital, a web agency for local service businesses. Return strict JSON only with keys subject, opening, body, cta. Write like one thoughtful person reaching out, not a template. Reference only weaknesses and opportunities present in the input. Use only services listed in businessProfile.mainServices when mentioning what the business does; if mainServices is empty, stay general about their website and local visibility. Match the voice to businessProfile.companyTone. Recommend leadIntelligence.idealPackage naturally in the body or cta. Adjust directness based on leadIntelligence.urgency: High = concise and time-sensitive, Medium = balanced, Low = consultative. Never mention AI, audits, audit scores, or that you analyzed their site with a tool. Do not include a sender name or email signature. Total word count across opening, body, and cta must be 120-220 words.",
      },
      {
        role: "user",
        content: `Write a cold outreach email from this lead context.\n\n${JSON.stringify(buildOutreachPromptPayload(audit, insights, profile, intelligence, companyName, industry), null, 2)}`,
      },
    ],
  });

  if (!parsed) {
    return null;
  }

  const merged = mergeOutreachEmail(fallback, parsed);

  if (!isValidOutreachEmail(merged)) {
    return null;
  }

  return merged;
}

export type { OutreachEmail } from "./outreachTypes";

export async function generateOutreachEmail(
  audit: AuditAnalysisResult,
  insights: AuditInsights,
  profile: BusinessProfile,
  intelligence: LeadIntelligence,
  options: {
    companyName: string;
    industry: string;
    topImprovement: string;
    tone: OutreachFallbackInput["tone"];
  }
): Promise<OutreachEmail> {
  const fallback = generateFallbackOutreach(
    buildFallbackInput(
      options.companyName,
      options.industry,
      options.topImprovement || audit.top_improvement || profile.priorityFocus,
      options.tone,
      intelligence
    )
  );

  const gptEmail = await generateGptOutreachEmail(
    audit,
    insights,
    profile,
    intelligence,
    options.companyName,
    options.industry,
    fallback
  );

  if (!gptEmail) {
    return fallback;
  }

  return gptEmail;
}
