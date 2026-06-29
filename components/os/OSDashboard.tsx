import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { RecentActivityLog } from "@/lib/aiActivityLogs";
import type { QueueStatus } from "@/lib/agentQueue";
import type { DashboardStats } from "@/lib/supabase";

const coreModules = [
  {
    title: "CRM",
    href: "/crm",
    description: "Manage leads, stages, AI context, and pipeline movement.",
    status: "Live",
  },
  {
    title: "Audit Engine",
    href: "/audit",
    description: "Analyze company websites and identify sales opportunities.",
    status: "Live",
  },
  {
    title: "Proposal Engine",
    href: "/proposal",
    description: "Generate structured proposals from CRM and audit context.",
    status: "Live",
  },
  {
    title: "Outreach Engine",
    href: "/outreach",
    description: "Create personalized sales messages from lead intelligence.",
    status: "Live",
  },
  {
    title: "Delivery",
    href: "/delivery",
    description: "Move won deals into projects, checklists, and launch flow.",
    status: "Live",
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Manage workspace, Gmail, authentication, and integrations.",
    status: "Live",
  },
];

const salesWorkflow = [
  "Add or qualify lead",
  "Run AI audit",
  "Generate business profile",
  "Create proposal context",
  "Generate outreach",
  "Review email",
  "Send with Gmail",
  "Track activity",
];

const nextActions = [
  "Connect Outreach UI to Gmail Send API",
  "Add email activity logs to CRM timeline",
  "Build inbox foundation for sent and received emails",
  "Create workspace notification center",
  "Turn Copilot into action executor",
];

const activityStatusStyles = {
  success: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  running: "border-sky-500/30 bg-sky-500/10 text-sky-300",
} as const;

type OSDashboardProps = {
  stats: DashboardStats;
  queueStatus: QueueStatus;
  recentActivity: RecentActivityLog[];
};

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildBusinessHealthMetrics(stats: DashboardStats) {
  const winRate =
    stats.totalLeads > 0
      ? Math.round((stats.wonLeads / stats.totalLeads) * 100)
      : 0;

  return [
    { label: "Total Leads", value: stats.totalLeads.toString() },
    { label: "Reviewed", value: stats.reviewedLeads.toString() },
    { label: "Contacted", value: stats.contactedLeads.toString() },
    { label: "Proposals", value: stats.proposalSent.toString() },
    { label: "Won", value: stats.wonLeads.toString() },
    { label: "Win Rate", value: `${winRate}%` },
    { label: "Active Projects", value: stats.activeProjects.toString() },
    { label: "Completed", value: stats.completedProjects.toString() },
    {
      label: "Pipeline Value",
      value: `$${stats.pipelineValue.toLocaleString()}`,
    },
  ];
}

function buildAgentMetrics(queueStatus: QueueStatus) {
  const runningCount = queueStatus.items.filter(
    (item) => item.status === "running"
  ).length;

  return [
    {
      label: "Agent",
      value: queueStatus.isRunning ? "Running" : "Idle",
      detail: queueStatus.isRunning
        ? "Automation is active"
        : "Ready for next task",
      highlight: queueStatus.isRunning,
    },
    {
      label: "Running",
      value: runningCount.toString(),
      detail: "Jobs in progress",
      highlight: runningCount > 0,
    },
    {
      label: "Waiting",
      value: queueStatus.pendingCount.toString(),
      detail: "Queued jobs",
      highlight: queueStatus.pendingCount > 0,
    },
    {
      label: "Completed",
      value: queueStatus.completedCount.toString(),
      detail: "Finished jobs",
      highlight: false,
    },
    {
      label: "Failed",
      value: queueStatus.failedCount.toString(),
      detail: "Needs review",
      highlight: queueStatus.failedCount > 0,
    },
  ];
}

export function OSDashboard({
  stats,
  queueStatus,
  recentActivity,
}: OSDashboardProps) {
  const businessHealthMetrics = buildBusinessHealthMetrics(stats);
  const agentMetrics = buildAgentMetrics(queueStatus);

  return (
    <Container className="py-8 md:py-12">
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-2xl shadow-black/30 md:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#22C55E]">
              Invictus Digital Command Center
            </p>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Run sales, delivery, AI and operations from one workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
              Invictus OS connects CRM, audits, proposals, outreach, Gmail and
              delivery into one operating system for the agency.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/outreach"
                className="rounded-full bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
              >
                Open Outreach
              </Link>
              <Link
                href="/crm"
                className="rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                View CRM
              </Link>
              <Link
                href="/settings?section=integrations&integration=gmail"
                className="rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Gmail Settings
              </Link>
            </div>
          </div>

          <Card className="bg-black/30 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Current Sprint
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Sprint 8
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Build the AI workspace dashboard, connect Outreach to Gmail Send,
              and prepare Inbox, notifications and agent actions.
            </p>
            <div className="mt-6 rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 p-4">
              <p className="text-sm font-medium text-[#22C55E]">
                Gmail Send API is live
              </p>
              <p className="mt-2 text-xs leading-6 text-zinc-400">
                OAuth, reconnect, database storage and real email sending have
                been verified.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Business Health
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Pipeline overview
            </h2>
          </div>
          <p className="hidden text-sm text-zinc-500 md:block">
            Live workspace metrics
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {businessHealthMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="p-5 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <p className="text-sm text-zinc-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {metric.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              AI Agent
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Queue status
            </h2>
          </div>
          <p className="hidden text-sm text-zinc-500 md:block">
            Agent foundation
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {agentMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="p-5 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <p className="text-sm text-zinc-500">{metric.label}</p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${
                  metric.highlight ? "text-[#22C55E]" : "text-white"
                }`}
              >
                {metric.value}
              </p>
              <p className="mt-2 text-xs text-zinc-600">{metric.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Sales Workflow
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            From lead to sent email
          </h2>
          <div className="mt-6 space-y-3">
            {salesWorkflow.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                  {index + 1}
                </span>
                <p className="text-sm text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Recent Activity
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Latest system events
          </h2>
          {recentActivity.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {log.event_label}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {log.company ?? "Unknown lead"} ·{" "}
                        {formatActivityTime(log.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${activityStatusStyles[log.status]}`}
                    >
                      {log.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-zinc-500">No activity yet.</p>
          )}
        </Card>
      </section>

      <section className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Next Actions
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            What we build next
          </h2>
          <ul className="mt-6 space-y-4">
            {nextActions.map((action) => (
              <li
                key={action}
                className="flex gap-3 border-b border-white/[0.06] pb-4 text-sm text-zinc-300 last:border-0 last:pb-0 md:text-base"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]"
                  aria-hidden="true"
                />
                {action}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Workspace Health
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Foundation status
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Auth verified",
              "Workspace verified",
              "Gmail connected",
              "Send API verified",
              "CRM available",
              "Proposal available",
              "Outreach available",
              "Delivery available",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 p-4"
              >
                <p className="text-sm font-medium text-[#22C55E]">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Core Modules
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Operating system navigation
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {coreModules.map((link) => (
            <Link key={link.href} href={link.href} className="group block">
              <Card className="h-full p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white transition group-hover:text-[#22C55E]">
                      {link.title}
                    </h3>
                    <span className="mt-3 inline-flex rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-2.5 py-1 text-[11px] font-medium text-[#22C55E]">
                      {link.status}
                    </span>
                  </div>
                  <span
                    className="text-zinc-600 transition group-hover:text-[#22C55E]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {link.description}
                </p>
                <p className="mt-4 text-xs font-medium text-zinc-600">
                  {link.href}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}