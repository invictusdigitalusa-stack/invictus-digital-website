type CRMStatsProps = {
    totalLeads: number;
    contactedLeads: number;
    proposalSent: number;
    wonLeads: number;
    activeProjects: number;
    pipelineValue: number;
  };
  
  export function CRMStats({
    totalLeads,
    contactedLeads,
    proposalSent,
    wonLeads,
    activeProjects,
    pipelineValue,
  }: CRMStatsProps) {
    const winRate =
      totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
    const stats = [
      {
        label: "Total Leads",
        value: totalLeads.toString(),
      },
      {
        label: "Contacted",
        value: contactedLeads.toString(),
      },
      {
        label: "Proposal Sent",
        value: proposalSent.toString(),
      },
      {
        label: "Won Deals",
        value: wonLeads.toString(),
      },
      {
        label: "Win Rate",
        value: `${winRate}%`,
      },
      {
        label: "Active Projects",
        value: activeProjects.toString(),
      },
      {
        label: "Pipeline Value",
        value: `$${pipelineValue.toLocaleString()}`,
      },
    ];
  
    return (
      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Sales Metrics
          </p>
  
          <h2 className="mt-2 text-2xl font-semibold text-white">
            CRM Overview
          </h2>
        </div>
  
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <p className="text-sm text-zinc-500">
                {stat.label}
              </p>
  
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }