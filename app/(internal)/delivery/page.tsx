import type { Metadata } from "next";
import { DeliveryNavbar } from "@/components/delivery/DeliveryNavbar";
import { DeliverySystem } from "@/components/delivery/DeliverySystem";
import { fetchProjects } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Delivery System | Invictus Digital",
  description: "Internal client delivery pipeline for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const projects = await fetchProjects();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DeliveryNavbar />
      <DeliverySystem projects={projects} />
    </main>
  );
}
