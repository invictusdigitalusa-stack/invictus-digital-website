import type { Metadata } from "next";
import { OutreachCenter } from "@/components/outreach/OutreachCenter";
import { OutreachNavbar } from "@/components/outreach/OutreachNavbar";

export const metadata: Metadata = {
  title: "Outreach Center | Invictus Digital",
  description: "Internal outreach and cold email generator for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

type OutreachPageProps = {
  searchParams: Promise<{
    company?: string;
    website?: string;
    industry?: string;
    problem?: string;
    improvement?: string;
  }>;
};

export default async function OutreachPage({ searchParams }: OutreachPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <OutreachNavbar />
      <OutreachCenter
        initialCompany={params.company ?? ""}
        initialWebsite={params.website ?? ""}
        initialIndustry={params.industry}
        initialPrimaryProblem={params.problem ?? ""}
        initialTopImprovement={params.improvement ?? ""}
      />
    </main>
  );
}
