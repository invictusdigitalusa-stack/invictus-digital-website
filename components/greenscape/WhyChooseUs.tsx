import { Container } from "./ui/Container";
import { SectionHeader } from "./ui/SectionHeader";

const reasons = [
  {
    title: "Local Austin Expertise",
    text: "We understand Central Texas soil, climate, and seasonal challenges — so your landscape thrives in every season.",
  },
  {
    title: "Premium Craftsmanship",
    text: "Every project is handled by trained professionals who take pride in clean work, clear communication, and lasting results.",
  },
  {
    title: "Transparent Pricing",
    text: "Detailed estimates, no surprises, and honest recommendations — so you always know exactly what you're paying for.",
  },
  {
    title: "Fully Licensed & Insured",
    text: "Your property is protected. We carry full licensing and insurance for complete peace of mind on every job.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-[#143D2B] py-24 text-white md:py-32">
      <Container>
        <SectionHeader
          light
          label="Why Choose Us"
          title="The GreenScape difference."
          description="Homeowners across Austin trust us for reliable service, beautiful results, and a team that treats your property like our own."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            >
              <div className="h-1 w-10 rounded-full bg-emerald-400" aria-hidden="true" />
              <h3 className="mt-6 text-xl font-semibold">{reason.title}</h3>
              <p className="mt-4 text-sm leading-7 text-emerald-50/80">
                {reason.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
