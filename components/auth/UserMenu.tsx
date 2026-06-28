"use client";

import { logout } from "@/lib/auth/logout";
import type { Session } from "@/lib/auth/types";
import { useToast } from "@/components/os/useToast";
import { useEffect, useRef, useState } from "react";

function getDisplayEmail(session: Session | null) {
  const email = session?.user?.email?.trim();
  return email || "Signed in";
}

function getDisplayRole(session: Session | null) {
  return session?.role ?? "Signed in";
}

function getDisplayWorkspace(session: Session | null) {
  return session?.workspace?.name?.trim() || "Signed in";
}

export function UserMenu() {
  const { showToast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json()) as { session?: Session | null };

        if (isMounted) {
          setSession(data.session ?? null);
        }
      } catch {
        if (isMounted) {
          setSession(null);
        }
      }
    }

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
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

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    await logout({
      redirect: false,
      onSuccess: () => {
        showToast({
          title: "Signed out",
          description: "You have been logged out successfully.",
          type: "success",
        });
        window.setTimeout(() => {
          window.location.href = "/login";
        }, 150);
      },
      onError: (message) => {
        showToast({
          title: "Logout failed",
          description: message,
          type: "error",
        });
        setIsLoggingOut(false);
      },
    });
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white"
      >
        <span className="max-w-[160px] truncate">{getDisplayEmail(session)}</span>
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
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-4 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]"
        >
          <div className="space-y-3 border-b border-white/[0.08] pb-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Email
              </p>
              <p className="mt-1 truncate text-sm text-white">
                {getDisplayEmail(session)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Role
              </p>
              <p className="mt-1 text-sm capitalize text-zinc-300">
                {getDisplayRole(session)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Workspace
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {getDisplayWorkspace(session)}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
