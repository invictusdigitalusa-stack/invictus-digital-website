import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const results = [
  {
    stat: "Top 3",
    label: "Higher Rankings",
    text: "Landscaping companies move into top local map and organic positions for high-intent searches.",
  },
  {
    stat: "+68%",
    label: "More Phone Calls",
    text: "Optimized profiles, CTAs, and local pages turn search visibility into direct inbound calls.",
  },
  {
    stat: "+42%",
    label: "More Booked Jobs",
    text: "Better conversion paths and trust signals help turn website visitors into scheduled work.",
  },
  {
    stat: "2.4x",
    label: "Better Google Visibility",
    text: "Stronger local SEO and Google Business optimization increase impressions across search surfaces.",
  },
];

export function Results() {
  return (
    <section id="results" className="bg-[#050505] py-28 text-white md:py-32">
      <Container>
        <SectionHeader
          label="Results"
          title="Growth you can measure."
          description="Our systems are built to improve the metrics that matter most for landscaping businesses — rankings, calls, bookings, and visibility."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((result) => (
            <Card
              key={result.label}
              className="p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/25 hover:bg-white/[0.06]"
            >
              <p className="text-4xl font-semibold tracking-tight text-[#22C55E]">
                {result.stat}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {result.label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {result.text}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
