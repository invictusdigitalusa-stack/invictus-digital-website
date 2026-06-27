import { AISnapshot } from "./AISnapshot";
import type { LeadRow } from "@/lib/supabase";

type AISnapshotSectionProps = {
  lead: LeadRow;
};

export function AISnapshotSection({ lead }: AISnapshotSectionProps) {
  return <AISnapshot lead={lead} />;
}
