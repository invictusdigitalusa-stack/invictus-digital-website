import "server-only";

import { runLeadPipeline } from "./agent";
import { createSupabaseClient } from "./supabase";

export type AgentQueueItemStatus = "pending" | "running" | "completed" | "failed";

export type AgentQueueItem = {
  id: string;
  leadId: string;
  status: AgentQueueItemStatus;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  createdAt: string;
};

export type EnqueueLeadResult = {
  success: boolean;
  item?: AgentQueueItem;
  alreadyQueued?: boolean;
  error?: string;
};

export type DequeueLeadResult = {
  success: boolean;
  item: AgentQueueItem | null;
  error?: string;
};

export type QueueStatus = {
  isRunning: boolean;
  pendingCount: number;
  runningLeadId: string | null;
  completedCount: number;
  failedCount: number;
  items: AgentQueueItem[];
};

export type RunQueueResult = {
  success: boolean;
  processedLeadIds: string[];
  errors: string[];
  status: QueueStatus;
  error?: string;
};

type QueueRow = {
  id: string;
  lead_id: string;
  status: AgentQueueItemStatus;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  created_at: string;
};

const ACTIVE_QUEUE_STATUSES: AgentQueueItemStatus[] = ["pending", "running"];
const QUEUE_ITEM_SELECT =
  "id, lead_id, status, started_at, completed_at, error, created_at";

function mapQueueRow(row: QueueRow): AgentQueueItem {
  return {
    id: row.id,
    leadId: row.lead_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    error: row.error,
    createdAt: row.created_at,
  };
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function fetchQueueItems(limit = 100): Promise<AgentQueueItem[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("ai_agent_queue")
    .select(QUEUE_ITEM_SELECT)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch AI agent queue:", error.message);
    return [];
  }

  return ((data ?? []) as QueueRow[]).map(mapQueueRow);
}

async function completeQueueItem(
  queueItemId: string,
  status: Extract<AgentQueueItemStatus, "completed" | "failed">,
  error?: string | null
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { data, error: updateError } = await supabase
    .from("ai_agent_queue")
    .update({
      status,
      completed_at: new Date().toISOString(),
      error: error?.trim() || null,
    })
    .eq("id", queueItemId)
    .select(QUEUE_ITEM_SELECT)
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, item: mapQueueRow(data as QueueRow) };
}

export async function enqueueLead(leadId: string): Promise<EnqueueLeadResult> {
  const normalizedLeadId = leadId.trim();

  if (!normalizedLeadId) {
    return { success: false, error: "Lead ID is required." };
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("ai_agent_queue")
    .select(QUEUE_ITEM_SELECT)
    .eq("lead_id", normalizedLeadId)
    .in("status", ACTIVE_QUEUE_STATUSES)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return { success: false, error: existingError.message };
  }

  if (existing) {
    return {
      success: true,
      item: mapQueueRow(existing as QueueRow),
      alreadyQueued: true,
    };
  }

  const { data, error } = await supabase
    .from("ai_agent_queue")
    .insert({
      lead_id: normalizedLeadId,
      status: "pending",
    })
    .select(QUEUE_ITEM_SELECT)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    item: mapQueueRow(data as QueueRow),
  };
}

export async function dequeueLead(): Promise<DequeueLeadResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return {
      success: false,
      item: null,
      error: "Supabase is not configured.",
    };
  }

  const { data: runningItem, error: runningError } = await supabase
    .from("ai_agent_queue")
    .select(QUEUE_ITEM_SELECT)
    .eq("status", "running")
    .order("started_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (runningError) {
    return { success: false, item: null, error: runningError.message };
  }

  if (runningItem) {
    return { success: true, item: null };
  }

  const { data: nextItem, error: nextError } = await supabase
    .from("ai_agent_queue")
    .select(QUEUE_ITEM_SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextError) {
    return { success: false, item: null, error: nextError.message };
  }

  if (!nextItem) {
    return { success: true, item: null };
  }

  const startedAt = new Date().toISOString();
  const { data: updatedItem, error: updateError } = await supabase
    .from("ai_agent_queue")
    .update({
      status: "running",
      started_at: startedAt,
      error: null,
    })
    .eq("id", nextItem.id)
    .eq("status", "pending")
    .select(QUEUE_ITEM_SELECT)
    .single();

  if (updateError) {
    return { success: false, item: null, error: updateError.message };
  }

  return {
    success: true,
    item: mapQueueRow(updatedItem as QueueRow),
  };
}

export async function getQueueStatus(): Promise<QueueStatus> {
  const items = await fetchQueueItems();
  const pendingItems = items.filter((item) => item.status === "pending");
  const runningItem = items.find((item) => item.status === "running");

  return {
    isRunning: Boolean(runningItem),
    pendingCount: pendingItems.length,
    runningLeadId: runningItem?.leadId ?? null,
    completedCount: items.filter((item) => item.status === "completed").length,
    failedCount: items.filter((item) => item.status === "failed").length,
    items,
  };
}

export async function runQueue(): Promise<RunQueueResult> {
  const processedLeadIds: string[] = [];
  const errors: string[] = [];

  while (true) {
    const dequeueResult = await dequeueLead();

    if (!dequeueResult.success) {
      const status = await getQueueStatus();
      return {
        success: false,
        processedLeadIds,
        errors,
        status,
        error: dequeueResult.error ?? "Failed to dequeue lead.",
      };
    }

    if (!dequeueResult.item) {
      break;
    }

    const queueItem = dequeueResult.item;

    try {
      const pipelineResult = await runLeadPipeline(queueItem.leadId);
      const pipelineError =
        pipelineResult.errors.length > 0
          ? pipelineResult.errors.join(" | ")
          : null;

      if (!pipelineResult.success) {
        errors.push(
          pipelineError ?? `Pipeline failed for lead ${queueItem.leadId}.`
        );
      }

      const completeResult = await completeQueueItem(
        queueItem.id,
        pipelineResult.success ? "completed" : "failed",
        pipelineError
      );

      if (!completeResult.success) {
        errors.push(
          completeResult.error ??
            `Failed to update queue item for lead ${queueItem.leadId}.`
        );
      }

      processedLeadIds.push(queueItem.leadId);
    } catch (error) {
      const message = normalizeError(error);
      errors.push(`runQueue: ${message}`);

      const completeResult = await completeQueueItem(
        queueItem.id,
        "failed",
        message
      );

      if (!completeResult.success) {
        errors.push(
          completeResult.error ??
            `Failed to mark queue item failed for lead ${queueItem.leadId}.`
        );
      }

      processedLeadIds.push(queueItem.leadId);
    }
  }

  const status = await getQueueStatus();

  return {
    success: errors.length === 0,
    processedLeadIds,
    errors,
    status,
  };
}
