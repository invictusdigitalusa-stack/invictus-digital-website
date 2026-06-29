import Link from "next/link";

type CRMHeroProps = {
  totalLeads: number;
  contactedLeads: number;
  proposalSent: number;
  wonLeads: number;
  pipelineValue: number;
};

export function CRMHero({
  totalLeads,
  contactedLeads,
  proposalSent,
  wonLeads,
  pipelineValue,
}: CRMHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-2xl shadow-black/30">
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#22C55E]">
            Invictus CRM
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white lg:text-6xl">
            Sales Pipeline
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
            Manage every lead, proposal, email and customer journey from one
            workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/audit"
              className="rounded-full bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
            >
              Run Audit
            </Link>

            <Link
              href="/outreach"
              className="rounded-full border border-white/[0.10] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Outreach
            </Link>

            <Link
              href="/proposal"
              className="rounded-full border border-white/[0.10] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Proposal
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <MetricCard title="Total Leads" value={totalLeads.toString()} />
          <MetricCard title="Contacted" value={contactedLeads.toString()} />
          <MetricCard title="Proposals" value={proposalSent.toString()} />
          <MetricCard title="Won" value={wonLeads.toString()} />
          <MetricCard
            title="Pipeline Value"
            value={`$${pipelineValue.toLocaleString()}`}
          />
        </div>
      </div>
    </section>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
};

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
      <p className="text-sm text-zinc-500">{title}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}