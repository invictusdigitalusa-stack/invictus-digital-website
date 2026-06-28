"use client";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/components/os/useToast";
import type { Session } from "@/lib/auth/types";
import { useEffect, useState } from "react";
import {
  integrationCards,
  settingsSections,
  type SettingsSection,
} from "./settingsSections";
import { WorkspaceSettingsSection } from "./WorkspaceSettingsSection";

type WorkspaceStats = {
  memberCount: number;
  createdAt: string | null;
};

type SettingsShellProps = {
  authEnforcementEnabled: boolean;
  supabaseAuthEnabled: boolean;
};

function SettingsField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-white/[0.06] py-4 last:border-0 last:pb-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-zinc-200">{value}</p>
    </div>
  );
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
    </Card>
  );
}

export function SettingsShell({
  authEnforcementEnabled,
  supabaseAuthEnabled,
}: SettingsShellProps) {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<SettingsSection>("workspace");
  const [session, setSession] = useState<Session | null>(null);
  const [workspaceStats, setWorkspaceStats] = useState<WorkspaceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json()) as {
          session?: Session | null;
          workspaceStats?: WorkspaceStats | null;
        };

        if (isMounted) {
          setSession(data.session ?? null);
          setWorkspaceStats(data.workspaceStats ?? null);
        }
      } catch {
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleConfigureIntegration(name: string) {
    showToast({
      title: "Coming soon",
      description: `${name} integration is not connected yet.`,
      type: "info",
    });
  }

  const activeSectionMeta = settingsSections.find(
    (section) => section.id === activeSection
  );

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
          Invictus OS
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Settings
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
          Manage workspace configuration, integrations, security, and billing.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {settingsSections.map((section) => {
            const isActive = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-white"
                    : "border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="block text-sm font-semibold">{section.label}</span>
                <span className="mt-1 hidden text-xs leading-5 text-zinc-500 lg:block">
                  {section.description}
                </span>
              </button>
            );
          })}
        </nav>

        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              {activeSectionMeta?.label} Settings
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {activeSectionMeta?.description}
            </p>
          </div>

          {isLoading ? (
            <Card className="p-6 md:p-8">
              <p className="text-sm text-zinc-400">Loading settings...</p>
            </Card>
          ) : null}

          {!isLoading && activeSection === "workspace" ? (
            <WorkspaceSettingsSection
              session={session}
              workspaceStats={workspaceStats}
              supabaseAuthEnabled={supabaseAuthEnabled}
            />
          ) : null}

          {!isLoading && activeSection === "team" ? (
            <PlaceholderCard
              title="Team management coming soon"
              description="Invite teammates, assign roles, and manage workspace access from this section."
            />
          ) : null}

          {!isLoading && activeSection === "integrations" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {integrationCards.map((integration) => (
                <Card key={integration.id} className="flex h-full flex-col p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {integration.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {integration.description}
                    </p>
                    <p className="mt-4 inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                      Not connected
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConfigureIntegration(integration.name)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
                  >
                    Configure
                  </button>
                </Card>
              ))}
            </div>
          ) : null}

          {!isLoading && activeSection === "security" ? (
            <Card className="p-6 md:p-8">
              <SettingsField
                label="Authentication Enabled"
                value={authEnforcementEnabled ? "Yes" : "No"}
              />
              <SettingsField
                label="Supabase Auth Enabled"
                value={supabaseAuthEnabled ? "Yes" : "No"}
              />
              <SettingsField
                label="Current Role"
                value={session?.role ?? "—"}
              />
              <div className="border-b border-white/[0.06] py-4 last:border-0 last:pb-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Permissions
                </p>
                {session?.permissions?.length ? (
                  <ul className="mt-3 space-y-2">
                    {session.permissions.map((permission) => (
                      <li
                        key={permission}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-xs text-zinc-300"
                      >
                        {permission}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">—</p>
                )}
              </div>
            </Card>
          ) : null}

          {!isLoading && activeSection === "billing" ? (
            <PlaceholderCard
              title="Billing is not configured yet"
              description="Subscription plans, invoices, and payment methods will appear here once billing is enabled."
            />
          ) : null}
        </section>
      </div>
    </Container>
  );
}
