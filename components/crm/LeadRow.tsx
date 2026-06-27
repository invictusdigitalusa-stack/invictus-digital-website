import Link from "next/link";
import type { LeadRow } from "@/lib/supabase";
import type { QueueStatus } from "@/lib/agentQueue";
import {
  displayValue,
  formatLastAuditDate,
  formatLastOutreachDate,
  getStatusStyle,
} from "./data";
import { getRunAiButtonConfig } from "./queueHelpers";

function StatusBadge({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(status)}`}
    >
      {displayValue(status)}
    </span>
  );
}

export function buildAuditUrl(lead: LeadRow) {
  const params = new URLSearchParams();

  if (lead.company) params.set("company", lead.company);
  if (lead.website) params.set("website", lead.website);
  if (lead.industry) params.set("industry", lead.industry);

  const query = params.toString();
  return query ? `/audit?${query}` : "/audit";
}

type LeadRowProps = {
  lead: LeadRow;
  isSelected: boolean;
  onToggleSelection: (leadId: string) => void;
  queueStatus: QueueStatus | null | undefined;
  markingId: string | null;
  onRunAI: (lead: LeadRow) => void;
  onMarkWon: (lead: LeadRow) => void;
};

export function LeadRowComponent({
  lead,
  isSelected,
  onToggleSelection,
  queueStatus,
  markingId,
  onRunAI,
  onMarkWon,
}: LeadRowProps) {
  const runAiButton = getRunAiButtonConfig(
    queueStatus?.items ?? [],
    lead.id
  );

  return (
    <tr className="border-b border-white/[0.06] transition hover:bg-white/[0.03]">
      <td className="px-4 py-4 md:px-6">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelection(lead.id)}
          aria-label={`Select ${lead.company ?? "lead"}`}
          className="h-4 w-4 rounded border-white/[0.15] bg-white/[0.03] accent-[#22C55E]"
        />
      </td>
      <td className="px-4 py-4 font-medium text-white md:px-6">
        {displayValue(lead.company)}
      </td>
      <td className="px-4 py-4 text-zinc-400 md:px-6">
        {displayValue(lead.website)}
      </td>
      <td className="px-4 py-4 text-zinc-400 md:px-6">
        {displayValue(lead.industry)}
      </td>
      <td className="px-4 py-4 md:px-6">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-4 text-zinc-400 md:px-6">
        {displayValue(lead.priority)}
      </td>
      <td className="px-4 py-4 text-zinc-400 md:px-6">
        {lead.overall_score ?? "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-400 md:px-6">
        {formatLastAuditDate(lead.last_audit_at)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-zinc-400 md:px-6">
        {formatLastOutreachDate(lead.last_outreach_at)}
      </td>
      <td className="px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onRunAI(lead)}
            disabled={!lead.website?.trim() || runAiButton.disabled}
            className={runAiButton.className}
          >
            {runAiButton.label}
          </button>
          <Link
            href={buildAuditUrl(lead)}
            className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
          >
            Audit
          </Link>
          {lead.status === "Won" ? (
            <span className="inline-flex items-center justify-center px-2 py-2 text-xs font-semibold text-[#22C55E]">
              Won
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onMarkWon(lead)}
              disabled={markingId === lead.id}
              className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-2 text-xs font-semibold text-[#22C55E] transition hover:bg-[#22C55E]/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markingId === lead.id ? "Saving..." : "Mark Won"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
