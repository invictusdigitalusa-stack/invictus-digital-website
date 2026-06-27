import type { Metadata } from "next";
import { InspirationLibrary } from "@/components/inspiration/InspirationLibrary";
import { InspirationNavbar } from "@/components/inspiration/InspirationNavbar";

export const metadata: Metadata = {
  title: "Inspiration Library | Invictus Digital",
  description: "Internal design inspiration library for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InspirationPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <InspirationNavbar />
      <InspirationLibrary />
    </main>
  );
}
