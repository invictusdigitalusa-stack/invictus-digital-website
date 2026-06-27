import { Container } from "@/components/ui/Container";

export function PortfolioHero() {
  return (
    <section className="relative overflow-hidden bg-[#050505] pb-16 pt-40 text-white md:pb-20 md:pt-48 lg:pt-52">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,197,94,0.12),transparent_45%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#22C55E]">
            Portfolio
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
            Recent Projects
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl md:leading-9">
            Explore a selection of websites and growth systems we&apos;ve
            created for local service businesses.
          </p>
        </div>
      </Container>
    </section>
  );
}
