"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { AgentQueueItemStatus, QueueStatus } from "@/lib/agentQueue";

export type CrmQueueActionMessage = {
  type: "success" | "warning" | "error";
  text: string;
  errors?: string[];
};

type UseCrmQueueOptions = {
  router: AppRouterInstance;
  onActionMessage?: (message: CrmQueueActionMessage) => void;
  pollIntervalMs?: number;
};

export function useCrmQueue({
  router,
  onActionMessage,
  pollIntervalMs = 2000,
}: UseCrmQueueOptions) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const wasQueueActiveRef = useRef(false);
  const previousQueueItemsRef = useRef<Record<string, AgentQueueItemStatus>>({});

  const refreshQueueStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/agent/queue");
      const data = (await response.json()) as QueueStatus & { error?: string };

      if (!response.ok) {
        return;
      }

      const hasActive =
        data.isRunning ||
        data.items.some(
          (item) => item.status === "pending" || item.status === "running"
        );

      const latestByLead = new Map<string, (typeof data.items)[number]>();
      for (const item of data.items) {
        latestByLead.set(item.leadId, item);
      }

      for (const [leadId, item] of latestByLead) {
        const previous = previousQueueItemsRef.current[leadId];

        if (
          (previous === "pending" || previous === "running") &&
          item.status === "completed"
        ) {
          onActionMessage?.({
            type: "success",
            text: "AI pipeline completed.",
          });
        }

        if (
          (previous === "pending" || previous === "running") &&
          item.status === "failed"
        ) {
          onActionMessage?.({
            type: "warning",
            text: item.error ? "Completed with warnings." : "AI pipeline failed.",
            errors: item.error ? [item.error] : undefined,
          });
        }
      }

      previousQueueItemsRef.current = Object.fromEntries(
        [...latestByLead.entries()].map(([leadId, item]) => [
          leadId,
          item.status,
        ])
      );

      if (wasQueueActiveRef.current && !hasActive) {
        router.refresh();
      }

      wasQueueActiveRef.current = hasActive;
      setQueueStatus(data);
    } catch {
      // Ignore polling errors.
    }
  }, [onActionMessage, router]);

  const markLeadQueued = useCallback((leadId: string, status: QueueStatus) => {
    setQueueStatus(status);
    previousQueueItemsRef.current[leadId] = "pending";
    wasQueueActiveRef.current = true;
  }, []);

  useEffect(() => {
    void refreshQueueStatus();

    const interval = setInterval(() => {
      void refreshQueueStatus();
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [pollIntervalMs, refreshQueueStatus]);

  return {
    queueStatus,
    setQueueStatus,
    refreshQueueStatus,
    markLeadQueued,
  };
}
