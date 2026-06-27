import type { Metadata } from "next";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioNavbar } from "@/components/portfolio/PortfolioNavbar";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";

export const metadata: Metadata = {
  title: "Portfolio | Invictus Digital",
  description:
    "Explore websites and growth systems built by Invictus Digital for local service businesses.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <PortfolioNavbar />
      <PortfolioHero />
      <ProjectGrid />
      <PortfolioCTA />
    </main>
  );
}
