import type { Metadata } from "next";
import { SettingsNavbar } from "@/components/settings/SettingsNavbar";
import { SettingsShell } from "@/components/settings/SettingsShell";

export const metadata: Metadata = {
  title: "Settings | Invictus Digital",
  description: "Internal workspace, team, integration, security, and billing settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <SettingsNavbar />
      <SettingsShell
        authEnforcementEnabled={process.env.INVICTUS_AUTH_ENABLED === "true"}
        supabaseAuthEnabled={
          process.env.INVICTUS_SUPABASE_AUTH_ENABLED === "true"
        }
      />
    </main>
  );
}
