import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F4F9F6] pt-36 pb-24 md:pt-44 md:pb-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(20,61,43,0.08),transparent_45%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="inline-flex rounded-full border border-[#143D2B]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#2F7A4F]">
              Austin&apos;s Premium Landscaping Team
            </p>

            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-[#143D2B] md:text-6xl lg:text-[4rem] lg:leading-[1.05]">
              Beautiful yards.
              <span className="mt-2 block">Built to last.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600">
              GreenScape Landscaping helps Austin homeowners transform outdoor
              spaces with expert lawn care, design, and year-round maintenance —
              done right the first time.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="#contact">Get Free Estimate</Button>
              <Button href="#services" variant="secondary">
                View Services
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[#143D2B]/10 pt-10">
              {[
                { value: "12+", label: "Years in Austin" },
                { value: "850+", label: "Projects Completed" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-semibold text-[#143D2B] md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-zinc-500 md:text-sm">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#143D2B]/10 bg-[#143D2B] shadow-2xl shadow-[#143D2B]/15"
              role="img"
              aria-label="Lush landscaped backyard with green lawn and stone patio in Austin, Texas"
            >
              <div className="absolute inset-0 bg-[linear-gradient(160deg,#1F5C3A_0%,#143D2B_45%,#0B2E1A_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.12),transparent_50%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-sm font-medium text-emerald-100">
                  Featured Project
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  Westlake Hills Backyard
                </p>
                <p className="mt-2 text-sm text-emerald-100/80">
                  Design · Hardscaping · Irrigation
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#143D2B]/10 bg-white px-5 py-4 shadow-xl md:-left-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2F7A4F]">
                Licensed & Insured
              </p>
              <p className="mt-1 text-sm font-semibold text-[#143D2B]">
                Serving Greater Austin
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
