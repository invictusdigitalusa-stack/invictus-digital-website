"use client";

import { useState } from "react";
import type { AiActivityLog, AiActivityStatus } from "@/lib/aiActivityLogs";

type ActivityTimelineProps = {
  logs: AiActivityLog[];
};

const statusStyles: Record<AiActivityStatus, string> = {
  success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  running: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

const resolvedStatusStyle =
  "border-white/[0.08] bg-white/[0.04] text-zinc-500";

type DisplayActivityLog = AiActivityLog & {
  displayStatus: AiActivityStatus | "resolved";
};

function resolveActivityLogs(logs: AiActivityLog[]): DisplayActivityLog[] {
  const eventTypes = new Set(logs.map((log) => log.event_type));
  const hideAllRunning =
    eventTypes.has("pipeline_completed") || eventTypes.has("pipeline_warning");
  const pipelineFailed = eventTypes.has("pipeline_failed");
  const auditCompleted = eventTypes.has("website_audit_completed");

  return logs
    .filter((log) => {
      if (hideAllRunning && log.status === "running") {
        return false;
      }

      if (
        auditCompleted &&
        log.event_type === "website_audit_started" &&
        log.status === "running"
      ) {
        return false;
      }

      return true;
    })
    .map((log) => {
      if (log.status === "running" && pipelineFailed) {
        return { ...log, displayStatus: "resolved" as const };
      }

      return { ...log, displayStatus: log.status };
    });
}

function getStatusStyle(displayStatus: DisplayActivityLog["displayStatus"]) {
  if (displayStatus === "resolved") {
    return resolvedStatusStyle;
  }

  return statusStyles[displayStatus];
}

function getStatusLabel(displayStatus: DisplayActivityLog["displayStatus"]) {
  if (displayStatus === "resolved") {
    return "resolved";
  }

  return displayStatus;
}

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const displayLogs = resolveActivityLogs(logs);

  return (
    <div className="border-t border-white/[0.06] bg-white/[0.01]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/[0.03] md:px-6"
        aria-expanded={expanded}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
          Activity Timeline
        </span>
        <svg
          className={`text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded ? (
        <div className="border-t border-white/[0.06] px-4 pb-4 md:px-6 md:pb-5">
          {displayLogs.length > 0 ? (
            <ul className="space-y-3 pt-4">
              {displayLogs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {log.event_label}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatActivityTime(log.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyle(log.displayStatus)}`}
                    >
                      {getStatusLabel(log.displayStatus)}
                    </span>
                  </div>
                  {log.details ? (
                    <p className="mt-3 text-xs leading-6 text-zinc-400">
                      {log.details}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pt-4 text-sm text-zinc-500">No activity yet.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
