import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import type { RecentActivityLog } from "@/lib/aiActivityLogs";
import type { QueueStatus } from "@/lib/agentQueue";
import type { DashboardStats } from "@/lib/supabase";

const quickLinks = [
  {
    title: "Settings",
    href: "/settings",
    description: "Workspace, team, integrations, security, and billing.",
  },
  {
    title: "Audit Engine",
    href: "/audit",
    description: "Analyze local business websites in minutes.",
  },
  {
    title: "CRM",
    href: "/crm",
    description: "Track leads, follow-ups, and pipeline status.",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    description: "Showcase client projects and demo work.",
  },
  {
    title: "GreenScape Demo",
    href: "/greenscape",
    description: "Live demo site for landscaping prospects.",
  },
  {
    title: "Invictus Website",
    href: "/",
    description: "Public agency homepage and growth offer.",
  },
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
  return [
    { label: "Total Leads", value: stats.totalLeads.toString() },
    { label: "Reviewed Leads", value: stats.reviewedLeads.toString() },
    { label: "Contacted Leads", value: stats.contactedLeads.toString() },
    { label: "Proposal Sent", value: stats.proposalSent.toString() },
    { label: "Won Leads", value: stats.wonLeads.toString() },
    { label: "Active Projects", value: stats.activeProjects.toString() },
    { label: "Completed Projects", value: stats.completedProjects.toString() },
    {
      label: "Pipeline Value",
      value: `$${stats.pipelineValue.toLocaleString()}`,
    },
    {
      label: "Average Audit Score",
      value: Math.round(stats.averageAuditScore).toString(),
    },
  ];
}

function buildAgentMetrics(queueStatus: QueueStatus) {
  const runningCount = queueStatus.items.filter(
    (item) => item.status === "running"
  ).length;

  return [
    {
      label: "Agent Status",
      value: queueStatus.isRunning ? "Running" : "Idle",
      highlight: queueStatus.isRunning,
    },
    { label: "Queue Running", value: runningCount.toString() },
    { label: "Queue Waiting", value: queueStatus.pendingCount.toString() },
    { label: "Queue Completed", value: queueStatus.completedCount.toString() },
    { label: "Queue Failed", value: queueStatus.failedCount.toString() },
  ];
}

const nextActions = [
  "Add 20 leads to Google Sheet",
  "Audit 5 landscaping websites",
  "Write first cold email",
  "Send first 5 emails",
  "Track replies",
];

export function OSDashboard({
  stats,
  queueStatus,
  recentActivity,
}: OSDashboardProps) {
  const businessHealthMetrics = buildBusinessHealthMetrics(stats);
  const agentMetrics = buildAgentMetrics(queueStatus);

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Hub
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Invictus OS
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          The operating system for building, selling and delivering growth
          systems.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
          AI Agent Status
        </h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {agentMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="p-5 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <p className="text-sm text-zinc-500">{metric.label}</p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${
                  metric.highlight ? "text-sky-300" : "text-white"
                }`}
              >
                {metric.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Business Health
        </h2>
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

      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Recent Activity
          </p>
          {recentActivity.length > 0 ? (
            <ul className="mt-5 space-y-3">
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
            <p className="mt-5 text-sm text-zinc-500">No activity yet.</p>
          )}
        </Card>

        <div className="grid gap-6">
          <Card className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Today&apos;s Focus
            </p>
            <p className="mt-5 text-lg leading-8 text-zinc-300 md:text-xl">
              Find 20 landscaping leads, audit 5 websites, send the first 5
              personalized emails.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Next Actions
            </p>
            <ul className="mt-5 space-y-4">
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
        </div>
      </div>

      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group block">
              <Card className="h-full p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white transition group-hover:text-[#22C55E]">
                    {link.title}
                  </h3>
                  <span
                    className="text-zinc-600 transition group-hover:text-[#22C55E]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-500">
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
