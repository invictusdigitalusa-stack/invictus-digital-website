import type { Metadata } from "next";
import { Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="px-6 py-12 text-sm text-zinc-400">Loading settings...</div>
        }
      >
        <SettingsShell
          authEnforcementEnabled={process.env.INVICTUS_AUTH_ENABLED === "true"}
          supabaseAuthEnabled={
            process.env.INVICTUS_SUPABASE_AUTH_ENABLED === "true"
          }
        />
      </Suspense>
    </main>
  );
}
