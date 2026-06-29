"use client";

import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/os/useToast";
import type { GmailIntegrationStatus } from "@/lib/integrations/gmail/types";
import { useCallback, useEffect, useState } from "react";

const statusLabels = {
  not_connected: "Not Connected",
  connected: "Connected",
  connection_error: "Connection Error",
} as const;

const statusStyles = {
  not_connected: "border-white/[0.08] bg-white/[0.04] text-zinc-500",
  connected: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  connection_error: "border-red-500/30 bg-red-500/10 text-red-300",
} as const;

function formatLastConnected(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function SettingsField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm text-zinc-100">{value}</p>
    </div>
  );
}

type GmailIntegrationSectionProps = {
  callbackStatus?: string | null;
  callbackError?: string | null;
  onNavigateBack: () => void;
};

export function GmailIntegrationSection({
  callbackStatus,
  callbackError,
  onNavigateBack,
}: GmailIntegrationSectionProps) {
  const { showToast } = useToast();
  const [integration, setIntegration] = useState<GmailIntegrationStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/integrations/gmail/status");
      const data = (await response.json()) as {
        integration?: GmailIntegrationStatus;
        error?: string;
      };

      if (!response.ok || !data.integration) {
        setIntegration({
          status: "connection_error",
          email: null,
          lastConnected: null,
          errorMessage: data.error ?? "Unable to load Gmail integration status.",
        });
        return;
      }

      if (callbackStatus === "error" && callbackError) {
        setIntegration({
          ...data.integration,
          status: "connection_error",
          errorMessage: callbackError,
        });
        return;
      }

      setIntegration(data.integration);
    } catch {
      setIntegration({
        status: "connection_error",
        email: null,
        lastConnected: null,
        errorMessage: "Unable to load Gmail integration status.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [callbackError, callbackStatus]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (callbackStatus === "connected") {
      showToast({
        title: "Gmail connected",
        description: "Your workspace Gmail account is now linked.",
        type: "success",
      });
    }

    if (callbackStatus === "error" && callbackError) {
      showToast({
        title: "Gmail connection failed",
        description: callbackError,
        type: "error",
      });
    }
  }, [callbackError, callbackStatus, showToast]);

  function handleConnect() {
    window.location.href = "/api/integrations/gmail/connect";
  }

  async function handleDisconnect() {
    if (isDisconnecting) {
      return;
    }

    setIsDisconnecting(true);

    try {
      const response = await fetch("/api/integrations/gmail/disconnect", {
        method: "POST",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        showToast({
          title: "Disconnect failed",
          description: data.error ?? "Unable to disconnect Gmail.",
          type: "error",
        });
        return;
      }

      setIntegration({
        status: "not_connected",
        email: null,
        lastConnected: null,
        errorMessage: null,
      });

      showToast({
        title: "Gmail disconnected",
        description: "This workspace no longer has a connected Gmail account.",
        type: "success",
      });
    } catch {
      showToast({
        title: "Disconnect failed",
        description: "Unable to disconnect Gmail.",
        type: "error",
      });
    } finally {
      setIsDisconnecting(false);
    }
  }

  const displayStatus = integration?.status ?? "not_connected";

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <span aria-hidden="true">←</span>
        Back to Integrations
      </button>

      <Card className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Integrations
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Gmail</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              Connect one Gmail account per workspace for future outreach and
              inbox workflows.
            </p>
          </div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${statusStyles[displayStatus]}`}
          >
            {statusLabels[displayStatus]}
          </span>
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-zinc-400">Loading Gmail connection...</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SettingsField
                label="Connected Account"
                value={integration?.email ?? "—"}
              />
              <SettingsField
                label="Connection Status"
                value={statusLabels[displayStatus]}
              />
              <SettingsField
                label="Last Connected"
                value={formatLastConnected(integration?.lastConnected ?? null)}
              />
            </div>

            {integration?.errorMessage ? (
              <p className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {integration.errorMessage}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConnect}
                className="inline-flex items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2.5 text-xs font-semibold text-[#22C55E] transition hover:border-[#22C55E]/50 hover:bg-[#22C55E]/15"
              >
                {displayStatus === "connected" ? "Reconnect" : "Connect Gmail"}
              </button>

              {displayStatus === "connected" ? (
                <button
                  type="button"
                  onClick={() => void handleDisconnect()}
                  disabled={isDisconnecting}
                  className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              ) : null}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
