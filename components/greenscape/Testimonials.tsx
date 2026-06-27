import { Container } from "./ui/Container";
import { SectionHeader } from "./ui/SectionHeader";

const testimonials = [
  {
    quote:
      "GreenScape completely transformed our backyard. The team was professional, on time, and the results exceeded our expectations.",
    name: "Sarah Mitchell",
    location: "Westlake, Austin",
    service: "Hardscaping + Design",
  },
  {
    quote:
      "We've used three landscaping companies before GreenScape. They're the first team that actually listens and delivers consistently.",
    name: "James & Karen Lopez",
    location: "Circle C Ranch",
    service: "Lawn Care + Irrigation",
  },
  {
    quote:
      "Our curb appeal went through the roof. Neighbors ask who did our front yard every week. Worth every penny.",
    name: "David Chen",
    location: "Mueller, Austin",
    service: "Landscape Design",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeader
          label="Reviews"
          title="Trusted by Austin homeowners."
          description="Don't take our word for it — hear from neighbors who chose GreenScape for their outdoor spaces."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="flex h-full flex-col rounded-3xl border border-[#143D2B]/10 bg-[#F4F9F6] p-8"
            >
              <div className="flex text-[#2F7A4F]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-6 flex-1 text-base leading-8 text-zinc-700">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-8 border-t border-[#143D2B]/10 pt-6">
                <cite className="not-italic">
                  <p className="font-semibold text-[#143D2B]">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {testimonial.location}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#2F7A4F]">
                    {testimonial.service}
                  </p>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
