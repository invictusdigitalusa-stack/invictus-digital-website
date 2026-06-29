"use client";

import { Card } from "@/components/ui/Card";
import type { GmailIntegrationStatus } from "@/lib/integrations/gmail/types";
import { integrationCards } from "./settingsSections";

const statusLabels = {
  not_connected: "Not Connected",
  connected: "Connected",
  connection_error: "Connection Error",
} as const;

type IntegrationsGridProps = {
  gmailStatus: GmailIntegrationStatus | null;
  onOpenIntegration: (integrationId: string) => void;
  onConfigurePlaceholder: (name: string) => void;
};

export function IntegrationsGrid({
  gmailStatus,
  onOpenIntegration,
  onConfigurePlaceholder,
}: IntegrationsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {integrationCards.map((integration) => {
        const isGmail = integration.id === "gmail";
        const status = isGmail
          ? gmailStatus?.status ?? "not_connected"
          : "not_connected";

        return (
          <Card key={integration.id} className="flex h-full flex-col p-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {integration.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {integration.description}
              </p>
              <p
                className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${
                  status === "connected"
                    ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                    : status === "connection_error"
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-white/[0.08] bg-white/[0.04] text-zinc-500"
                }`}
              >
                {statusLabels[status]}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                isGmail
                  ? onOpenIntegration(integration.id)
                  : onConfigurePlaceholder(integration.name)
              }
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
            >
              {isGmail ? "Manage" : "Configure"}
            </button>
          </Card>
        );
      })}
    </div>
  );
}
