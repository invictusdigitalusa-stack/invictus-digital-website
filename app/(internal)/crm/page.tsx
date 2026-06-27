import type { Metadata } from "next";
import { CRMDashboard } from "@/components/crm/CRMDashboard";
import { CRMNavbar } from "@/components/crm/CRMNavbar";
import { fetchAiActivityLogsForLeads } from "@/lib/aiActivityLogs";
import { fetchLeads } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "CRM | Invictus Digital",
  description: "Internal CRM dashboard for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  const leads = await fetchLeads();
  const activityLogsByLeadId = await fetchAiActivityLogsForLeads(
    leads.map((lead) => lead.id)
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <CRMNavbar />
      <CRMDashboard leads={leads} activityLogsByLeadId={activityLogsByLeadId} />
    </main>
  );
}
