import type { Metadata } from "next";
import { ProposalGenerator } from "@/components/proposal/ProposalGenerator";
import { ProposalNavbar } from "@/components/proposal/ProposalNavbar";

export const metadata: Metadata = {
  title: "Proposal Generator | Invictus Digital",
  description: "Internal proposal generator for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

type ProposalPageProps = {
  searchParams: Promise<{
    company?: string;
    website?: string;
    industry?: string;
    package?: string;
    timeline?: string;
    payment?: string;
  }>;
};

export default async function ProposalPage({ searchParams }: ProposalPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <ProposalNavbar />
      <ProposalGenerator
        initialCompany={params.company ?? ""}
        initialWebsite={params.website ?? ""}
        initialIndustry={params.industry}
        initialPackage={params.package}
        initialTimeline={params.timeline}
        initialPaymentTerms={params.payment}
      />
    </main>
  );
}
