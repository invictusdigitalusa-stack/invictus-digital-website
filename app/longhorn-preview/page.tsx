import type { Metadata } from "next";
import { LonghornHero } from "@/components/longhorn-preview/LonghornHero";
import { LonghornNavbar } from "@/components/longhorn-preview/LonghornNavbar";

export const metadata: Metadata = {
  title: "Longhorn Lawns Preview | Redesign Concept",
  description:
    "Premium homepage hero redesign concept for Longhorn Lawns — Austin lawn care and landscaping.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LonghornPreviewPage() {
  return (
    <main className="min-h-screen text-white">
      <LonghornNavbar />
      <LonghornHero />
    </main>
  );
}
