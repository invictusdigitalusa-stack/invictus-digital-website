import type { Metadata } from "next";
import { AuditEngine } from "@/components/audit/AuditEngine";
import { AuditNavbar } from "@/components/audit/AuditNavbar";

export const metadata: Metadata = {
  title: "Audit Engine | Invictus Digital",
  description: "Internal website audit tool for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

type AuditPageProps = {
  searchParams: Promise<{
    company?: string;
    website?: string;
    industry?: string;
  }>;
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <AuditNavbar />
      <AuditEngine
        initialCompany={params.company ?? ""}
        initialWebsite={params.website ?? ""}
        initialIndustry={params.industry}
      />
    </main>
  );
}
