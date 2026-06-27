"use client";

import { useState } from "react";
import type { LeadRow } from "@/lib/supabase";
import { displayValue } from "./data";

type AISnapshotProps = {
  lead: LeadRow;
};

type SnapshotField = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value}/100`;
}

function buildSnapshotFields(lead: LeadRow): SnapshotField[] {
  return [
    { label: "Business Summary", value: displayValue(lead.business_summary), fullWidth: true },
    { label: "Priority Focus", value: displayValue(lead.priority_focus), fullWidth: true },
    { label: "Recommended Package", value: displayValue(lead.recommended_package) },
    {
      label: "Conversion Potential",
      value: formatScore(lead.conversion_potential),
    },
    {
      label: "Revenue Potential",
      value: formatScore(lead.revenue_potential),
    },
    {
      label: "Closing Probability",
      value: formatScore(lead.closing_probability),
    },
    { label: "Urgency", value: displayValue(lead.urgency) },
    { label: "Competition", value: displayValue(lead.competition) },
    {
      label: "Estimated Lifetime Value",
      value: displayValue(lead.estimated_lifetime_value),
    },
    { label: "Next Best Action", value: displayValue(lead.next_best_action), fullWidth: true },
    { label: "Reasoning", value: displayValue(lead.reasoning), fullWidth: true },
  ];
}

function hasSnapshotData(lead: LeadRow) {
  return Boolean(
    lead.business_summary ||
      lead.priority_focus ||
      lead.recommended_package ||
      lead.conversion_potential !== null ||
      lead.revenue_potential !== null ||
      lead.closing_probability !== null ||
      lead.urgency ||
      lead.competition ||
      lead.estimated_lifetime_value ||
      lead.next_best_action ||
      lead.reasoning
  );
}

export function AISnapshot({ lead }: AISnapshotProps) {
  const [expanded, setExpanded] = useState(false);
  const fields = buildSnapshotFields(lead);
  const hasData = hasSnapshotData(lead);

  return (
    <div className="border-t border-white/[0.06] bg-white/[0.015]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/[0.03] md:px-6"
        aria-expanded={expanded}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
          AI Snapshot
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
          {hasData ? (
            <div className="grid gap-3 pt-4 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 ${
                    field.fullWidth ? "md:col-span-2" : ""
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="pt-4 text-sm text-zinc-500">
              No AI snapshot saved for this lead yet. Run an audit and save to CRM.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
