import type { Metadata } from "next";
import { OfferBuilder } from "@/components/offer/OfferBuilder";
import { OfferNavbar } from "@/components/offer/OfferNavbar";

export const metadata: Metadata = {
  title: "Offer Builder | Invictus Digital",
  description: "Internal growth system packages and pricing for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <OfferNavbar />
      <OfferBuilder />
    </main>
  );
}
