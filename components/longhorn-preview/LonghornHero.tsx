const metrics = [
  { value: "15+", label: "Years Serving Austin" },
  { value: "2,400+", label: "Lawns Maintained" },
  { value: "4.9★", label: "Homeowner Rating" },
];

function PropertyDashboard() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[48px] bg-[#4ADE80]/[0.08] blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-[3px] shadow-[0_32px_100px_-32px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="rounded-[29px] border border-white/[0.05] bg-[#081F14]/90 p-6 md:p-7">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
            <div>
              <p className="text-[14px] font-semibold tracking-[-0.01em] text-white">
                Property Dashboard
              </p>
              <p className="mt-1 text-xs text-[#7FAF92]">Barton Hills · Weekly Care</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#4ADE80]/20 bg-[#4ADE80]/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              <span className="text-[11px] font-medium text-[#4ADE80]">Active</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Lawn Health", value: "Excellent", pct: 96 },
              { label: "Last Service", value: "3 days ago", pct: 100 },
              { label: "Season Plan", value: "Premium", pct: 88 },
              { label: "Curb Appeal", value: "Top 5%", pct: 92 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7FAF92]">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#4ADE80]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-[20px] border border-white/[0.06]">
            <div
              className="relative aspect-[16/7]"
              role="img"
              aria-label="Lush green lawn with professional landscaping in Austin"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A4D32_0%,#0F3322_40%,#061810_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,222,128,0.15),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#061810] to-transparent p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#7FAF92]">
                  Featured Property
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  West Austin Estate Lawn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LonghornHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44 lg:pb-40 lg:pt-52">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(74,222,128,0.08),transparent_40%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(45,122,79,0.12),transparent_35%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[46fr_54fr] lg:gap-14 xl:gap-20 lg:px-8">
        <div className="max-w-xl lg:py-6">
          <p className="inline-flex rounded-full border border-[#4ADE80]/20 bg-[#4ADE80]/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86EFAC]">
            Austin&apos;s Trusted Lawn Experts
          </p>

          <h1 className="mt-10 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-6xl lg:text-[4.25rem]">
            A lawn your neighbors
            <span className="mt-1 block text-[#86EFAC]">will notice.</span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-[1.75] text-[#9BC4AA] md:text-xl md:leading-8">
            Longhorn Lawns delivers premium lawn care, landscape maintenance,
            and outdoor beautification for Austin homeowners who expect
            flawless results — every visit.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#4ADE80] px-8 py-4 text-[15px] font-semibold text-[#052010] shadow-lg shadow-[#4ADE80]/20 transition hover:bg-[#86EFAC] hover:shadow-[#4ADE80]/30"
            >
              Get Free Estimate
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] px-8 py-4 text-[15px] font-medium text-[#C8E6D4] transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
            >
              View Our Work
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-10">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                  {metric.value}
                </dt>
                <dd className="mt-2 text-[11px] leading-4 text-[#7FAF92] md:text-xs">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="w-full lg:pl-2">
          <PropertyDashboard />
        </div>
      </div>
    </section>
  );
}
