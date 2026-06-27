import "server-only";

import type { AuditAnalysisResult } from "@/lib/audit";
import { generateDeterministicInsights } from "./fallback";
import { generateGptInsights } from "./prompt";

export type { AuditInsights } from "./types";

export async function generateAuditInsights(
  audit: AuditAnalysisResult
) {
  const fallback = generateDeterministicInsights(audit);
  const gptInsights = await generateGptInsights(audit, fallback);

  if (!gptInsights) {
    return fallback;
  }

  return gptInsights;
}
