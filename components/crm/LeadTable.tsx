import { Fragment, type RefObject } from "react";
import { Card } from "@/components/ui/Card";
import type { AiActivityLog } from "@/lib/aiActivityLogs";
import type { LeadRow } from "@/lib/supabase";
import type { QueueStatus } from "@/lib/agentQueue";
import { LeadDetails } from "./LeadDetails";
import { LeadRowComponent } from "./LeadRow";

const TABLE_COLUMNS = [
  "Company",
  "Website",
  "Industry",
  "Status",
  "Priority",
  "Overall Score",
  "Last Audit",
  "Last Outreach",
  "Actions",
] as const;

type LeadTableProps = {
  filtered: LeadRow[];
  emptyMessage: string;
  selectedLeadIds: Set<string>;
  selectAllRef: RefObject<HTMLInputElement | null>;
  allFilteredSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleLeadSelection: (leadId: string) => void;
  queueStatus: QueueStatus | null | undefined;
  markingId: string | null;
  activityLogsByLeadId: Record<string, AiActivityLog[]>;
  onRunAI: (lead: LeadRow) => void;
  onMarkWon: (lead: LeadRow) => void;
};

export function LeadTable({
  filtered,
  emptyMessage,
  selectedLeadIds,
  selectAllRef,
  allFilteredSelected,
  onToggleSelectAll,
  onToggleLeadSelection,
  queueStatus,
  markingId,
  activityLogsByLeadId,
  onRunAI,
  onMarkWon,
}: LeadTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="w-12 px-4 py-4 md:px-6">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all filtered leads"
                  className="h-4 w-4 rounded border-white/[0.15] bg-white/[0.03] accent-[#22C55E]"
                />
              </th>
              {TABLE_COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 md:px-6"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((lead) => (
                <Fragment key={lead.id}>
                  <LeadRowComponent
                    lead={lead}
                    isSelected={selectedLeadIds.has(lead.id)}
                    onToggleSelection={onToggleLeadSelection}
                    queueStatus={queueStatus}
                    markingId={markingId}
                    onRunAI={onRunAI}
                    onMarkWon={onMarkWon}
                  />
                  <LeadDetails
                    lead={lead}
                    activityLogs={activityLogsByLeadId[lead.id] ?? []}
                  />
                </Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-16 text-center text-zinc-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
