import "server-only";

import type { AuditAnalysisResult } from "@/lib/audit";
import { createJsonCompletion } from "@/lib/openai/jsonCompletion";
import {
  AUDIT_INSIGHTS_SYSTEM_PROMPT,
  buildAuditInsightsUserPrompt,
} from "@/lib/openai/prompts/auditInsights";
import { mergeGptInsights } from "./merge";
import type { AuditInsights, GptInsightResponse } from "./types";

export async function generateGptInsights(
  audit: AuditAnalysisResult,
  fallback: AuditInsights
): Promise<AuditInsights | null> {
  const parsed = await createJsonCompletion<GptInsightResponse>({
    temperature: 0.3,
    messages: [
      { role: "system", content: AUDIT_INSIGHTS_SYSTEM_PROMPT },
      { role: "user", content: buildAuditInsightsUserPrompt(audit) },
    ],
  });

  if (!parsed) {
    return null;
  }

  return mergeGptInsights(fallback, parsed);
}
