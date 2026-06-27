import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const services = [
  {
    title: "Website Design",
    text: "Modern, mobile-first websites built to turn visitors into booked landscaping jobs.",
    points: ["Custom design", "Fast loading", "Mobile optimized", "Conversion focused"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M3 9H21" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M8 17L10 14L13 16L16 12" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Local SEO",
    text: "We optimize your site so local customers find you when they search for landscaping services.",
    points: ["Keyword strategy", "On-page SEO", "Local pages", "Ranking growth"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="10" r="3" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M12 21C12 21 19 14.5 19 10C19 6.134 15.866 3 12 3C8.134 3 5 6.134 5 10C5 14.5 12 21 12 21Z" stroke="#22C55E" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "AI Visibility",
    text: "We structure your business so AI tools understand, trust, and recommend your company.",
    points: ["AI-ready content", "Entity signals", "FAQ structure", "Schema markup"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" stroke="#22C55E" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Google Business Optimization",
    text: "We strengthen your Google Business Profile to drive calls, directions, and local trust.",
    points: ["Profile optimization", "Review strategy", "Photo updates", "Local visibility"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7H20V17C20 18.105 19.105 19 18 19H6C4.895 19 4 18.105 4 17V7Z" stroke="#22C55E" strokeWidth="1.5" />
        <path d="M8 11H16M8 14H13" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section id="services" className="bg-[#050505] py-28 text-white md:py-32">
      <Container>
        <SectionHeader
          label="Our Growth System"
          title="Everything you need to grow."
          description="We combine website design, local SEO, AI visibility, and Google Business optimization into one system built for landscaping companies."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] transition group-hover:border-[#22C55E]/20 group-hover:bg-[#22C55E]/10">
                {service.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {service.text}
              </p>
              <ul className="mt-6 space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-zinc-300">
                    <span className="text-[#22C55E]" aria-hidden="true">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
