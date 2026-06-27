"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { CopilotAction } from "@/lib/copilotActions";
import { requiresCopilotConfirmation } from "@/lib/copilotActions";
import { useToast } from "./useToast";

function buildAuditUrl(action: CopilotAction) {
  const params = new URLSearchParams();

  if (action.company) {
    params.set("company", action.company);
  }

  if (action.leadId) {
    params.set("leadId", action.leadId);
  }

  const query = params.toString();
  return query ? `/audit?${query}` : "/audit";
}

function buildOutreachUrl(action: CopilotAction) {
  const params = new URLSearchParams();

  if (action.company) {
    params.set("company", action.company);
  }

  const query = params.toString();
  return query ? `/outreach?${query}` : "/outreach";
}

export function useCopilotActionHandlers() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleAction = useCallback(
    async (action: CopilotAction) => {
      if (action.type === "text") {
        return;
      }

      if (requiresCopilotConfirmation(action)) {
        const prompt =
          action.type === "run_ai_queue"
            ? `Run the AI pipeline for ${action.company ?? "this lead"}?`
            : `Open outreach for ${action.company ?? "this lead"}? You will still review before sending.`;

        if (!window.confirm(prompt)) {
          return;
        }
      }

      switch (action.type) {
        case "open_crm":
          router.push("/crm");
          return;
        case "open_delivery":
          router.push("/delivery");
          return;
        case "view_lead":
          router.push("/crm");
          return;
        case "open_audit":
          router.push(buildAuditUrl(action));
          return;
        case "generate_outreach":
          router.push(buildOutreachUrl(action));
          return;
        case "run_ai_queue": {
          if (!action.leadId) {
            showToast({
              title: "Lead required",
              description: "This action needs a valid lead before running AI.",
              type: "error",
            });
            return;
          }

          try {
            const response = await fetch("/api/agent/pipeline", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ leadId: action.leadId }),
            });

            const data = (await response.json()) as {
              success?: boolean;
              error?: string;
            };

            if (!response.ok) {
              throw new Error(data.error ?? "Failed to queue AI pipeline.");
            }

            showToast({
              title: "AI pipeline queued",
              description: action.company
                ? `${action.company} was added to the agent queue.`
                : "The lead was added to the agent queue.",
              type: "success",
            });
          } catch (error) {
            showToast({
              title: "Queue failed",
              description:
                error instanceof Error
                  ? error.message
                  : "Failed to queue AI pipeline.",
              type: "error",
            });
          }
          return;
        }
        default:
          return;
      }
    },
    [router, showToast]
  );

  return { handleAction };
}
