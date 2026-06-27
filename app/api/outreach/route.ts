import type { AuditInsights } from "@/lib/aiAudit";
import type { AuditAnalysisResult } from "@/lib/audit";
import type { BusinessProfile } from "@/lib/businessProfileTypes";
import type { LeadIntelligence } from "@/lib/leadIntelligence";
import { generateOutreachEmail } from "@/lib/outreachAI";
import {
  buildOutreachContextFromInput,
  buildOutreachContextFromLead,
} from "@/lib/outreachContext";
import type { OutreachTone } from "@/lib/outreachTypes";
import { fetchLeadOutreachContext } from "@/lib/supabase";
import {
  apiBadRequest,
  apiError,
  apiSuccess,
  getErrorMessage,
} from "@/lib/api/responses";

type OutreachRequestBody = {
  companyName?: string;
  website?: string;
  industry?: string;
  primaryProblem?: string;
  topImprovement?: string;
  tone?: OutreachTone;
  audit?: AuditAnalysisResult;
  insights?: AuditInsights;
  businessProfile?: BusinessProfile;
  leadIntelligence?: LeadIntelligence;
};

const tones: OutreachTone[] = ["Professional", "Friendly", "Direct"];

function parseTone(value?: string): OutreachTone {
  if (value && tones.includes(value as OutreachTone)) {
    return value as OutreachTone;
  }

  return "Professional";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OutreachRequestBody;
    const companyName = body.companyName?.trim() ?? "";

    if (!companyName) {
      return apiBadRequest("Company name is required.");
    }

    const tone = parseTone(body.tone);
    const industry = body.industry?.trim() || "Landscaping";
    const topImprovement = body.topImprovement?.trim() ?? "";
    const primaryProblem = body.primaryProblem?.trim() ?? "";
    const fallbackInput = {
      companyName,
      industry,
      topImprovement,
      tone,
    };

    let context =
      body.audit && body.insights && body.businessProfile && body.leadIntelligence
        ? {
            audit: body.audit,
            insights: body.insights,
            businessProfile: body.businessProfile,
            leadIntelligence: body.leadIntelligence,
          }
        : null;

    if (!context) {
      const lead = await fetchLeadOutreachContext(
        companyName,
        body.website?.trim() ?? ""
      );

      if (lead) {
        context = buildOutreachContextFromLead(lead, fallbackInput);
      }
    }

    if (!context) {
      context = buildOutreachContextFromInput(fallbackInput, primaryProblem);
    }

    const email = await generateOutreachEmail(
      context.audit,
      context.insights,
      context.businessProfile,
      context.leadIntelligence,
      {
        companyName,
        industry,
        topImprovement,
        tone,
      }
    );

    return apiSuccess(email);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to generate outreach email."));
  }
}
