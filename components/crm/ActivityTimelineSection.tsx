import type { AiActivityLog } from "@/lib/aiActivityLogs";
import { ActivityTimeline } from "./ActivityTimeline";

type ActivityTimelineSectionProps = {
  logs: AiActivityLog[];
};

export function ActivityTimelineSection({ logs }: ActivityTimelineSectionProps) {
  return <ActivityTimeline logs={logs} />;
}
