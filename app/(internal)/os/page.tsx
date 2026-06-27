import type { Metadata } from "next";
import { CopilotPanel } from "@/components/os/CopilotPanel";
import { OSDashboard } from "@/components/os/OSDashboard";
import { OSNavbar } from "@/components/os/OSNavbar";
import { fetchRecentAiActivityLogs } from "@/lib/aiActivityLogs";
import { getQueueStatus } from "@/lib/agentQueue";
import { fetchDashboardStats } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Invictus OS | Invictus Digital",
  description: "Internal operating system dashboard for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function OSPage() {
  const [stats, queueStatus, recentActivity] = await Promise.all([
    fetchDashboardStats(),
    getQueueStatus(),
    fetchRecentAiActivityLogs(6),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <OSNavbar />
      <div className="flex flex-col xl:flex-row">
        <div className="min-w-0 flex-1">
          <OSDashboard
            stats={stats}
            queueStatus={queueStatus}
            recentActivity={recentActivity}
          />
        </div>
        <CopilotPanel />
      </div>
    </main>
  );
}
