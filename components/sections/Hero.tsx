import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

const trustBadges = [
  "Custom Website",
  "Local SEO",
  "Google Business",
  "AI Search",
  "48 Hour Launch",
];

function TrendUp({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 10L6 6L9 9L12 4"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4H12V7"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniLineChart() {
  return (
    <svg
      viewBox="0 0 120 40"
      className="h-11 w-full transition-opacity duration-300 group-hover/widget:opacity-100 opacity-90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 32 L15 28 L30 30 L45 22 L60 24 L75 14 L90 16 L105 8 L120 10 L120 40 L0 40 Z"
        fill="url(#hero-chart-fill)"
      />
      <path
        d="M0 32 L15 28 L30 30 L45 22 L60 24 L75 14 L90 16 L105 8 L120 10"
        fill="none"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniBarChart() {
  const bars = [38, 52, 46, 64, 58, 72, 68];

  return (
    <div className="flex h-11 items-end gap-1.5" aria-hidden="true">
      {bars.map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-sm bg-[#22C55E]/10 transition-colors duration-300 group-hover/widget:bg-[#22C55E]/15"
          style={{ height: `${height}%` }}
        >
          <div
            className="h-full w-full rounded-sm bg-[#22C55E] transition-opacity duration-300"
            style={{ opacity: 0.35 + index * 0.08 }}
          />
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]"
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-[#22C55E] transition-all duration-500 ease-out group-hover/widget:brightness-110"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function DashboardWidget({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group/widget rounded-[22px] border border-white/[0.06] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-all duration-300 ease-out hover:border-white/[0.1] hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,0,0,0.5)] ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function GrowthDashboard() {
  return (
    <div className="group/dashboard relative transition-transform duration-500 ease-out hover:scale-[1.005]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[48px] bg-[#22C55E]/[0.07] blur-[80px] transition-opacity duration-500 group-hover/dashboard:opacity-100 opacity-80"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-white/[0.03] p-[3px] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-2xl transition-shadow duration-500 ease-out group-hover/dashboard:shadow-[0_32px_100px_-28px_rgba(34,197,94,0.15),0_24px_80px_-24px_rgba(0,0,0,0.8)]">
        <div className="rounded-[29px] border border-white/[0.04] bg-[#070707]/80 p-6 md:p-7">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-6">
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                Growth Dashboard
              </p>
              <p className="mt-1.5 text-xs text-zinc-500">
                GreenScape Landscaping
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#22C55E]/15 bg-[#22C55E]/[0.08] px-3.5 py-1.5 transition-colors duration-300 group-hover/dashboard:border-[#22C55E]/25">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
              <span className="text-[11px] font-medium text-[#22C55E]">Live</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <DashboardWidget label="Google Rankings">
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-zinc-500">Current Position</p>
                  <p className="mt-1.5 text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white">
                    #2
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-[#22C55E]/15 bg-[#22C55E]/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#22C55E]">
                  <TrendUp />
                  +4
                </div>
              </div>
              <div className="mt-5">
                <MiniLineChart />
              </div>
            </DashboardWidget>

            <DashboardWidget label="Google Maps">
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white">
                  Top 3
                </p>
                <span className="rounded-full border border-[#22C55E]/15 bg-[#22C55E]/[0.08] px-2.5 py-1 text-[10px] font-medium text-[#22C55E]">
                  Map Pack
                </span>
              </div>
              <div className="mt-5 space-y-2.5">
                <ProgressBar value={88} />
                <p className="text-[11px] text-zinc-500">
                  Local visibility score
                </p>
              </div>
            </DashboardWidget>

            <DashboardWidget label="Organic Traffic">
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[#22C55E]">
                  +147%
                </p>
                <TrendUp />
              </div>
              <div className="mt-5">
                <MiniLineChart />
              </div>
            </DashboardWidget>

            <DashboardWidget label="Phone Calls">
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[#22C55E]">
                  +68%
                </p>
                <span className="text-[11px] text-zinc-500">This month</span>
              </div>
              <div className="mt-5">
                <MiniBarChart />
              </div>
            </DashboardWidget>

            <DashboardWidget label="Lead Conversion">
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white">
                  2.4x
                </p>
                <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-500">
                  vs. prior
                </span>
              </div>
              <div className="mt-5 space-y-2.5">
                <ProgressBar value={76} />
                <p className="text-[11px] text-zinc-500">
                  Estimate booking rate
                </p>
              </div>
            </DashboardWidget>

            <DashboardWidget label="AI Visibility">
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-white">
                  94%
                </p>
                <TrendUp />
              </div>
              <div className="mt-5 space-y-2.5">
                <ProgressBar value={94} />
                <p className="text-[11px] text-zinc-500">Entity trust score</p>
              </div>
            </DashboardWidget>
          </div>

          <div className="mt-4 rounded-[22px] border border-white/[0.06] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300 ease-out hover:border-white/[0.1] hover:bg-white/[0.05]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  ChatGPT
                </p>
                <p className="mt-2.5 text-sm font-semibold leading-relaxed tracking-[-0.01em] text-white">
                  Recommended for &ldquo;best landscaping company near me&rdquo;
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/[0.08] px-3.5 py-2 transition-colors duration-300 hover:border-[#22C55E]/30 hover:bg-[#22C55E]/[0.12]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7.5L6 10.5L11 4"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[11px] font-semibold text-[#22C55E]">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="mt-14 rounded-[24px] border border-white/[0.06] bg-white/[0.02] px-5 py-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
        Built for landscaping growth
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {trustBadges.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300 ease-out hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050505] pb-32 pt-44 text-white md:pb-40 md:pt-52 lg:pb-48 lg:pt-56">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(34,197,94,0.07),transparent_42%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-20 lg:grid-cols-[45fr_55fr] lg:gap-16 xl:gap-20">
          <div className="max-w-[34rem] lg:py-4">
            <div className="inline-flex rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-[11px] font-medium tracking-[0.08em] text-zinc-300 uppercase transition-colors duration-300 hover:border-white/[0.1] hover:text-white">
              Landscaping Growth Systems
            </div>

            <h1 className="mt-10 text-[2.75rem] font-semibold tracking-[-0.045em] md:text-6xl md:leading-[1.04] lg:mt-12 lg:text-[4.5rem] lg:leading-[1.02]">
              <span className="block">Dominate Google.</span>
              <span className="block">Win AI Search.</span>
              <span className="mt-6 block text-[1.65rem] font-medium tracking-[-0.035em] text-zinc-400 md:mt-7 md:text-[2rem] md:leading-[1.15] lg:mt-8 lg:text-[2.125rem]">
                Generate More Qualified Leads.
              </span>
            </h1>

            <p className="mt-10 max-w-[30rem] text-[1.0625rem] leading-[1.75] text-zinc-500 md:mt-12 md:text-lg md:leading-8">
              We help landscaping companies get more phone calls, booked
              estimates and long-term growth through custom websites, Local SEO
              and AI visibility.
            </p>

            <div className="mt-12 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:items-center sm:gap-4">
              <Button
                href="mailto:invictusdigitalusa@gmail.com"
                className="px-8 py-4 text-[15px] shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/35"
              >
                Get Free Growth Audit
              </Button>
              <Button
                href="#services"
                variant="secondary"
                className="border-transparent bg-transparent px-6 py-3.5 text-sm font-medium text-zinc-500 shadow-none hover:scale-100 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-zinc-300 active:scale-100"
              >
                See Demo
              </Button>
            </div>

            <TrustBar />
          </div>

          <div className="w-full lg:pl-2 xl:pl-4">
            <GrowthDashboard />
          </div>
        </div>
      </Container>
    </section>
  );
}
