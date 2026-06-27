"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CommandBar } from "./CommandBar";
import { useCommandBar, type CommandDefinition } from "./useCommandBar";
import { useToast } from "./useToast";

function CommandIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function buildCommands(
  router: ReturnType<typeof useRouter>,
  showComingSoon: () => void
): CommandDefinition[] {
  const comingSoon = showComingSoon;

  return [
    {
      id: "open-crm",
      title: "Open CRM",
      description: "Go to the lead pipeline dashboard.",
      keywords: ["crm", "leads", "pipeline"],
      icon: (
        <CommandIcon>
          <path
            d="M2.5 4.5H13.5M4.5 2.5V4.5M11.5 2.5V4.5M3.5 6.5H12.5L12 13.5H4L3.5 6.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: () => router.push("/crm"),
    },
    {
      id: "open-audit",
      title: "Open Audit Engine",
      description: "Analyze a local business website.",
      keywords: ["audit", "website", "score"],
      icon: (
        <CommandIcon>
          <path
            d="M3 12.5L6.5 8.5L9 10.5L13 4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: () => router.push("/audit"),
    },
    {
      id: "open-delivery",
      title: "Open Delivery",
      description: "Manage active client projects.",
      keywords: ["delivery", "projects", "clients"],
      icon: (
        <CommandIcon>
          <path
            d="M3.5 5.5H12.5V12.5H3.5V5.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M6 3.5H10V5.5H6V3.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: () => router.push("/delivery"),
    },
    {
      id: "open-portfolio",
      title: "Open Portfolio",
      description: "View client work and demo projects.",
      keywords: ["portfolio", "work", "showcase"],
      icon: (
        <CommandIcon>
          <rect
            x="3"
            y="3"
            width="4.5"
            height="4.5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="8.5"
            y="3"
            width="4.5"
            height="4.5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="3"
            y="8.5"
            width="4.5"
            height="4.5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="8.5"
            y="8.5"
            width="4.5"
            height="4.5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </CommandIcon>
      ),
      action: () => router.push("/portfolio"),
    },
    {
      id: "open-website",
      title: "Open Invictus Website",
      description: "Open the public agency homepage.",
      keywords: ["website", "home", "public"],
      icon: (
        <CommandIcon>
          <path
            d="M2.5 8H13.5M8 2.5C10 4.5 11 6 11 8C11 10 10 11.5 8 13.5C6 11.5 5 10 5 8C5 6 6 4.5 8 2.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: () => router.push("/"),
    },
    {
      id: "run-ai",
      title: "Run AI for selected lead",
      description: "Queue the full AI pipeline for a lead.",
      keywords: ["ai", "agent", "pipeline", "lead"],
      icon: (
        <CommandIcon>
          <path
            d="M4 8H12M8 4V12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </CommandIcon>
      ),
      action: comingSoon,
    },
    {
      id: "generate-outreach",
      title: "Generate Outreach",
      description: "Create AI outreach for a lead.",
      keywords: ["outreach", "email", "cold"],
      icon: (
        <CommandIcon>
          <path
            d="M2.5 5.5L8 8.5L13.5 5.5M2.5 5.5V10.5H13.5V5.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: comingSoon,
    },
    {
      id: "generate-proposal",
      title: "Generate Proposal",
      description: "Build a proposal from lead intelligence.",
      keywords: ["proposal", "package", "sales"],
      icon: (
        <CommandIcon>
          <path
            d="M4.5 2.5H10.5L12.5 4.5V13.5H3.5V4.5L4.5 2.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </CommandIcon>
      ),
      action: comingSoon,
    },
    {
      id: "create-project",
      title: "Create Project",
      description: "Start a delivery project from a won lead.",
      keywords: ["project", "delivery", "won"],
      icon: (
        <CommandIcon>
          <path
            d="M3.5 8H12.5M8 3.5V12.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </CommandIcon>
      ),
      action: comingSoon,
    },
  ];
}

const searchIcons = {
  lead: (
    <CommandIcon>
      <path
        d="M2.5 4.5H13.5M4.5 2.5V4.5M11.5 2.5V4.5M3.5 6.5H12.5L12 13.5H4L3.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CommandIcon>
  ),
  project: (
    <CommandIcon>
      <path
        d="M3.5 5.5H12.5V12.5H3.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6 3.5H10V5.5H6V3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </CommandIcon>
  ),
  activity: (
    <CommandIcon>
      <path
        d="M3 12.5L6.5 8.5L9 10.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </CommandIcon>
  ),
};

export function CommandBarProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showToast } = useToast();
  const showComingSoon = useCallback(
    () =>
      showToast({
        title: "Coming soon",
        description: "This command is not connected yet.",
        type: "info",
      }),
    [showToast]
  );
  const commands = useMemo(
    () => buildCommands(router, showComingSoon),
    [router, showComingSoon]
  );
  const commandBar = useCommandBar(commands, router, searchIcons);

  return (
    <>
      {children}
      <CommandBar {...commandBar} />
    </>
  );
}
