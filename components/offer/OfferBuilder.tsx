import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const packages = [
  {
    name: "Starter",
    price: "$2,500",
    popular: false,
    features: [
      "Premium Website",
      "Mobile Optimization",
      "Contact Form",
      "Basic SEO",
      "Google Analytics",
      "30 Days Support",
    ],
  },
  {
    name: "Growth",
    price: "$4,500",
    popular: true,
    includesPrevious: "Everything in Starter",
    features: [
      "Local SEO",
      "Google Business Optimization",
      "AI Visibility Optimization",
      "Service Pages",
      "Speed Optimization",
      "60 Days Support",
    ],
  },
  {
    name: "Authority",
    price: "$7,500",
    popular: false,
    includesPrevious: "Everything in Growth",
    features: [
      "Unlimited Service Pages",
      "Advanced Local SEO",
      "Content Strategy",
      "Monthly Reporting",
      "Priority Support",
      "90 Days Support",
    ],
  },
];

const addOns = [
  {
    title: "Monthly SEO",
    description: "Ongoing local SEO, rankings tracking, and on-page improvements.",
  },
  {
    title: "Google Ads Management",
    description: "Campaign setup, optimization, and lead-focused ad management.",
  },
  {
    title: "Monthly Website Care",
    description: "Updates, backups, performance checks, and minor content edits.",
  },
  {
    title: "Blog Content",
    description: "SEO-driven articles built to rank and support AI visibility.",
  },
  {
    title: "Review Management",
    description: "Google review strategy, responses, and reputation monitoring.",
  },
];

const processSteps = [
  { step: "01", title: "Discovery", text: "Understand the business, goals, and local market." },
  { step: "02", title: "Audit", text: "Review website, SEO, Google Business, and AI visibility." },
  { step: "03", title: "Design", text: "Build a premium layout focused on leads and trust." },
  { step: "04", title: "Development", text: "Develop, optimize, and structure for search growth." },
  { step: "05", title: "Launch", text: "Deploy, connect analytics, and go live with confidence." },
  { step: "06", title: "Growth", text: "Improve rankings, conversions, and long-term visibility." },
];

const faqs = [
  {
    question: "How long does it take?",
    answer:
      "Most Starter and Growth projects launch in 3–6 weeks depending on scope, content readiness, and revision speed. Authority projects typically run 6–10 weeks.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes. We offer split payments for qualified projects — typically 50% to start and 50% at launch, with custom terms available for Authority packages.",
  },
  {
    question: "Do you redesign existing websites?",
    answer:
      "Absolutely. We often rebuild outdated sites while preserving SEO equity, then layer local SEO and AI visibility on top.",
  },
  {
    question: "Do you work outside landscaping?",
    answer:
      "Yes. Our growth systems are built for local service businesses including roofing, HVAC, plumbing, painting, concrete, and more.",
  },
];

export function OfferBuilder() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Offer Builder
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Growth System Packages
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Our complete service offering for local service businesses.
        </p>
      </div>

      <section>
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative flex h-full flex-col p-8 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] ${
                pkg.popular
                  ? "border-[#22C55E]/30 shadow-[0_24px_80px_-24px_rgba(34,197,94,0.2)]"
                  : ""
              }`}
            >
              {pkg.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#22C55E]/30 bg-[#22C55E] px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-black">
                  Most Popular
                </span>
              ) : null}

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
                {pkg.name}
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
                {pkg.price}
              </p>

              <div className="mt-8 flex-1">
                {pkg.includesPrevious ? (
                  <p className="mb-4 text-sm font-medium text-zinc-300">
                    {pkg.includesPrevious}
                  </p>
                ) : null}
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-zinc-400">
                      <span className="text-[#22C55E]" aria-hidden="true">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-white/[0.08] pt-20">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Add-ons</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
          Optional ongoing services to extend any package after launch.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {addOns.map((addOn) => (
            <Card
              key={addOn.title}
              className="p-6 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
            >
              <h3 className="text-base font-semibold text-white">{addOn.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {addOn.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 border-t border-white/[0.08] pt-20">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          Process Timeline
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
          Every project follows the same proven growth system.
        </p>

        <div className="relative mt-10">
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent lg:block"
            aria-hidden="true"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {processSteps.map((item) => (
              <Card
                key={item.title}
                className="p-6 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <p className="text-xs font-semibold text-[#22C55E]">{item.step}</p>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 border-t border-white/[0.08] pt-20 pb-8">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">FAQ</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
          Common questions when presenting packages to prospects.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
