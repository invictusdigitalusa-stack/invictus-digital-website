import type { AuditAnalysisResult } from "@/lib/audit";
import { generateAuditInsights } from "@/lib/aiAudit";
import { apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function POST(request: Request) {
  try {
    const audit = (await request.json()) as AuditAnalysisResult;
    const insights = await generateAuditInsights(audit);

    return apiSuccess(insights);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to generate audit insights."));
  }
}
