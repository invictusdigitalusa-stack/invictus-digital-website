import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function PortfolioCTA() {
  return (
    <section className="bg-[#050505] pb-28 text-white md:pb-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.04] px-8 py-20 text-center md:px-16 md:py-24">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_65%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Ready to grow your business?
            </h2>
            <div className="mt-10">
              <Button href="mailto:invictusdigitalusa@gmail.com">
                Book Free Growth Audit
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
