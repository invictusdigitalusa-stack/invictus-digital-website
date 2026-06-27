"use client";

import { useEffect } from "react";
import type { ToastItem } from "./useToast";

type ToastProps = ToastItem & {
  onDismiss: (id: string) => void;
};

const typeStyles = {
  success: "border-[#22C55E]/30 bg-[#22C55E]/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-amber-500/30 bg-amber-500/10",
  info: "border-sky-500/30 bg-sky-500/10",
} as const;

const titleStyles = {
  success: "text-[#22C55E]",
  error: "text-red-300",
  warning: "text-amber-300",
  info: "text-sky-300",
} as const;

export function Toast({
  id,
  title,
  description,
  type,
  duration,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-2xl border bg-[#111111]/95 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl ${typeStyles[type]}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${titleStyles[type]}`}>{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-zinc-300">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-zinc-400 transition hover:border-white/[0.12] hover:text-white"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
