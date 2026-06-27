import type { Metadata } from "next";
import { CTA } from "@/components/greenscape/CTA";
import { Footer } from "@/components/greenscape/Footer";
import { Gallery } from "@/components/greenscape/Gallery";
import { Hero } from "@/components/greenscape/Hero";
import { Navbar } from "@/components/greenscape/Navbar";
import { Services } from "@/components/greenscape/Services";
import { Testimonials } from "@/components/greenscape/Testimonials";
import { WhyChooseUs } from "@/components/greenscape/WhyChooseUs";

export const metadata: Metadata = {
  title: "GreenScape Landscaping | Premium Landscaping in Austin, TX",
  description:
    "GreenScape Landscaping provides premium lawn care, landscape design, tree trimming, irrigation, and hardscaping for Austin homeowners.",
  keywords: [
    "landscaping Austin TX",
    "lawn care Austin",
    "landscape design Austin",
    "hardscaping Austin",
    "tree trimming Austin",
    "irrigation Austin",
  ],
  openGraph: {
    title: "GreenScape Landscaping | Austin, Texas",
    description:
      "Beautiful yards built to last. Premium landscaping services for Austin homeowners.",
    type: "website",
  },
};

export default function GreenScapePage() {
  return (
    <main className="min-h-screen bg-white text-[#143D2B]">
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
