import type { AgentQueueItem } from "@/lib/agentQueue";

export function getLatestQueueItemForLead(items: AgentQueueItem[], leadId: string) {
  const leadItems = items.filter((item) => item.leadId === leadId);

  if (leadItems.length === 0) {
    return null;
  }

  return leadItems[leadItems.length - 1];
}

export function getLeadQueueButtonItem(items: AgentQueueItem[], leadId: string) {
  const latest = getLatestQueueItemForLead(items, leadId);

  if (!latest) {
    return null;
  }

  if (latest.status === "pending" || latest.status === "running") {
    return latest;
  }

  const queueActive = items.some(
    (item) => item.status === "pending" || item.status === "running"
  );

  if (queueActive) {
    return latest;
  }

  if (latest.completedAt) {
    const completedAt = new Date(latest.completedAt).getTime();

    if (
      !Number.isNaN(completedAt) &&
      Date.now() - completedAt < 10000 &&
      (latest.status === "completed" || latest.status === "failed")
    ) {
      return latest;
    }
  }

  return null;
}

export function getRunAiButtonConfig(items: AgentQueueItem[], leadId: string) {
  const baseClassName =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const item = getLeadQueueButtonItem(items, leadId);

  if (!item) {
    return {
      label: "Run AI",
      disabled: false,
      className: `${baseClassName} border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15`,
    };
  }

  switch (item.status) {
    case "pending":
      return {
        label: "Queued...",
        disabled: true,
        className: `${baseClassName} border-amber-500/20 bg-amber-500/10 text-amber-300`,
      };
    case "running":
      return {
        label: "Running...",
        disabled: true,
        className: `${baseClassName} border-sky-500/20 bg-sky-500/10 text-sky-300`,
      };
    case "completed":
      return {
        label: "Completed",
        disabled: true,
        className: `${baseClassName} border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]`,
      };
    case "failed":
      return {
        label: "Failed",
        disabled: false,
        className: `${baseClassName} border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15`,
      };
    default:
      return {
        label: "Run AI",
        disabled: false,
        className: `${baseClassName} border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15`,
      };
  }
}

export function isQueueItemActive(item: AgentQueueItem | null) {
  return item?.status === "pending" || item?.status === "running";
}
