import type { AiActivityLog } from "@/lib/aiActivityLogs";
import type { LeadRow } from "@/lib/supabase";
import { AISnapshotSection } from "./AISnapshotSection";
import { ActivityTimelineSection } from "./ActivityTimelineSection";

type LeadDetailsProps = {
  lead: LeadRow;
  activityLogs: AiActivityLog[];
};

export function LeadDetails({ lead, activityLogs }: LeadDetailsProps) {
  return (
    <tr className="border-b border-white/[0.06]">
      <td colSpan={10} className="p-0">
        <AISnapshotSection lead={lead} />
        <ActivityTimelineSection logs={activityLogs} />
      </td>
    </tr>
  );
}
