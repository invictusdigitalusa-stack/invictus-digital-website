"use client";

import { useToast } from "@/components/os/useToast";
import type { Session, Workspace } from "@/lib/auth/types";
import { useEffect, useRef, useState } from "react";

type WorkspaceSwitcherProps = {
  session: Session | null;
  workspaces: Workspace[];
  onSessionChange: (session: Session) => void;
};

function getDisplayWorkspace(session: Session | null) {
  return session?.workspace?.name?.trim() || "Signed in";
}

export function WorkspaceSwitcher({
  session,
  workspaces,
  onSessionChange,
}: WorkspaceSwitcherProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const currentWorkspaceId = session?.workspace?.id ?? null;
  const canSwitch = workspaces.length > 1;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleSelect(workspaceId: string) {
    if (
      isSwitching ||
      !currentWorkspaceId ||
      workspaceId === currentWorkspaceId
    ) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);

    try {
      const response = await fetch("/api/auth/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      const data = (await response.json()) as {
        session?: Session;
        error?: string;
      };

      if (!response.ok || !data.session) {
        showToast({
          title: "Workspace switch failed",
          description: data.error ?? "Unable to switch workspace.",
          type: "error",
        });
        return;
      }

      onSessionChange(data.session);
      setIsOpen(false);
      showToast({
        title: "Workspace updated",
        description: `Now in ${data.session.workspace.name}.`,
        type: "success",
      });
      window.location.reload();
    } catch {
      showToast({
        title: "Workspace switch failed",
        description: "Unable to switch workspace.",
        type: "error",
      });
    } finally {
      setIsSwitching(false);
    }
  }

  if (!canSwitch) {
    return (
      <p className="mt-1 text-sm text-zinc-300">{getDisplayWorkspace(session)}</p>
    );
  }

  return (
    <div ref={switcherRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isSwitching}
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate">{getDisplayWorkspace(session)}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label="Available workspaces"
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]"
        >
          {workspaces.map((workspace) => {
            const isActive = workspace.id === currentWorkspaceId;

            return (
              <button
                key={workspace.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => void handleSelect(workspace.id)}
                disabled={isSwitching || isActive}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-white/[0.06] disabled:cursor-default ${
                  isActive ? "bg-white/[0.04] text-white" : "text-zinc-300"
                }`}
              >
                <span className="truncate">{workspace.name}</span>
                {isActive ? (
                  <span className="ml-2 shrink-0 text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                    Active
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
