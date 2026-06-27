import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const reasons = [
  {
    title: "Built for Landscaping",
    text: "We specialize in landscaping companies, not generic local businesses. Every page, keyword, and CTA is built around how your customers search and buy.",
  },
  {
    title: "Full Growth System",
    text: "Website, SEO, AI visibility, and Google Business work together — not as disconnected services. That means faster results and fewer gaps.",
  },
  {
    title: "Premium Execution",
    text: "Clean design, fast performance, and strategic structure. Your brand looks credible on Google, on mobile, and inside AI-powered search experiences.",
  },
];

export function WhyInvictus() {
  return (
    <section
      id="why-invictus"
      className="border-t border-white/[0.08] bg-[#050505] py-28 text-white md:py-32"
    >
      <Container>
        <SectionHeader
          label="Why Invictus"
          title="Why clients choose us."
          description="We combine agency-level strategy with product-grade execution — built specifically for landscaping companies that want to grow."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => (
            <Card
              key={reason.title}
              className="p-10 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
            >
              <div className="h-1 w-10 rounded-full bg-[#22C55E]" aria-hidden="true" />
              <h3 className="mt-8 text-xl font-semibold">{reason.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {reason.text}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
