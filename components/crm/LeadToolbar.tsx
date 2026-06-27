import { Card } from "@/components/ui/Card";

type LeadToolbarProps = {
  stats: {
    totalLeads: number;
    meetings: number;
    clients: number;
    revenue: number;
  };
  actionMessage: {
    type: "success" | "warning" | "error";
    text: string;
    errors?: string[];
  } | null;
  showPipelineWarnings: boolean;
  onTogglePipelineWarnings: () => void;
};

export function LeadToolbar({
  stats,
  actionMessage,
  showPipelineWarnings,
  onTogglePipelineWarnings,
}: LeadToolbarProps) {
  const statCards = [
    { label: "Total Leads", value: stats.totalLeads.toString() },
    { label: "Meetings", value: stats.meetings.toString() },
    { label: "Clients", value: stats.clients.toString() },
    {
      label: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
    },
  ];

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {actionMessage ? (
        <div className="mb-4">
          <p
            className={`text-sm ${
              actionMessage.type === "success"
                ? "text-[#22C55E]"
                : actionMessage.type === "warning"
                  ? "text-amber-300"
                  : "text-red-400"
            }`}
          >
            {actionMessage.text}
          </p>
          {actionMessage.errors && actionMessage.errors.length > 0 ? (
            <div className="mt-2">
              <button
                type="button"
                onClick={onTogglePipelineWarnings}
                className="text-xs font-medium text-zinc-400 transition hover:text-white"
              >
                {showPipelineWarnings ? "Hide warnings" : "View warnings"}
              </button>
              {showPipelineWarnings ? (
                <ul className="mt-2 space-y-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  {actionMessage.errors.map((error) => (
                    <li key={error} className="text-xs leading-6 text-zinc-400">
                      {error}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
