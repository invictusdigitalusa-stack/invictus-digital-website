import type { Metadata } from "next";
import { DesignSystemDoc } from "@/components/design-system/DesignSystemDoc";
import { DesignSystemNavbar } from "@/components/design-system/DesignSystemNavbar";

export const metadata: Metadata = {
  title: "Design System | Invictus Digital",
  description: "Internal design system documentation for Invictus Digital.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DesignSystemNavbar />
      <DesignSystemDoc />
    </main>
  );
}
