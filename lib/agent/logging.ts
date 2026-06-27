import "server-only";

import {
  createAiActivityLog,
  type AiActivityEventType,
  type AiActivityStatus,
} from "../aiActivityLogs";
import type { LeadPipelineStep } from "./types";

export function recordError(
  errors: string[],
  step: LeadPipelineStep,
  error: unknown
) {
  const message = error instanceof Error ? error.message : String(error);
  errors.push(`${step}: ${message}`);
}

export async function logPipelineActivity(
  leadId: string,
  eventType: AiActivityEventType,
  status: AiActivityStatus,
  details?: string
) {
  try {
    await createAiActivityLog({
      leadId,
      eventType,
      status,
      details,
    });
  } catch {
    // Activity logging should not block the pipeline.
  }
}

export async function finalizePipelineActivity(
  leadId: string,
  errors: string[],
  completedSteps: LeadPipelineStep[]
) {
  const auditCompleted = completedSteps.includes("audit");

  if (!auditCompleted) {
    await logPipelineActivity(
      leadId,
      "pipeline_failed",
      "error",
      errors.join(" | ") || "Pipeline failed before audit completed."
    );
    return;
  }

  if (errors.length === 0) {
    await logPipelineActivity(leadId, "pipeline_completed", "success");
    return;
  }

  await logPipelineActivity(
    leadId,
    "pipeline_warning",
    "warning",
    errors.join(" | ")
  );
}
