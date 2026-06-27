import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Audit",
    text: "We review your website, Google presence, SEO structure, and AI visibility gaps.",
  },
  {
    number: "02",
    title: "Build",
    text: "We create a modern website and growth system built around your services and location.",
  },
  {
    number: "03",
    title: "Optimize",
    text: "We structure your pages, content, metadata, and local signals for search visibility.",
  },
  {
    number: "04",
    title: "Grow",
    text: "We keep improving rankings, conversions, and visibility so more leads turn into jobs.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="border-t border-white/[0.08] bg-[#050505] py-28 text-white md:py-32"
    >
      <Container>
        <SectionHeader
          label="Our Process"
          title="A simple system built for results."
          description="From audit to growth, every step is designed to help landscaping companies win more local search visibility and booked jobs."
        />

        <div className="relative mt-16">
          <div
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent md:block"
            aria-hidden="true"
          />

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="h-full p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                      {step.number}
                    </div>
                    {index < steps.length - 1 ? (
                      <div
                        className="hidden h-px flex-1 bg-white/[0.08] md:block"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {step.text}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
