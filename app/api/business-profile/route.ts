import type { AuditInsights } from "@/lib/aiAudit";
import type { AuditAnalysisResult } from "@/lib/audit";
import { generateBusinessProfile } from "@/lib/businessProfile";
import { apiBadRequest, apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      audit?: AuditAnalysisResult;
      insights?: AuditInsights;
    };

    if (!body.audit || !body.insights) {
      return apiBadRequest("Audit and insights are required.");
    }

    const profile = await generateBusinessProfile(body.audit, body.insights);

    return apiSuccess(profile);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to generate business profile."));
  }
}
