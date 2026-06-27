import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

export function CTA() {
  return (
    <section className="bg-[#050505] py-28 text-white md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.04] px-8 py-20 text-center md:px-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_65%)]" aria-hidden="true" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#22C55E]">
              Start Growing
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Ready to dominate local search?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Book a free website audit and discover how Invictus Digital can
              help your landscaping company rank higher, get more calls, and
              win more jobs.
            </p>
            <div className="mt-10">
              <Button href="mailto:invictusdigitalusa@gmail.com">
                Book Free Website Audit
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
