import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const testimonials = [
  {
    quote:
      "Invictus rebuilt our website and local SEO system. We went from page two to the map pack in under four months, and our phone has not stopped ringing.",
    name: "Marcus Reed",
    role: "Owner, Greenline Landscaping Co.",
    location: "Austin, TX",
  },
  {
    quote:
      "They made our business look premium online and structured everything for Google and AI search. We are booking more maintenance contracts than ever.",
    name: "Danielle Brooks",
    role: "Founder, Summit Lawn & Design",
    location: "Denver, CO",
  },
  {
    quote:
      "The process was clear, fast, and focused on leads — not fluff. Our Google Business profile, website, and local pages finally work as one system.",
    name: "Tyler Harmon",
    role: "Director, Evergreen Outdoor Services",
    location: "Charlotte, NC",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-[#050505] py-28 text-white md:py-32"
    >
      <Container>
        <SectionHeader
          label="Testimonials"
          title="Trusted by growing landscaping brands."
          description="Fictional client examples showcasing the kind of outcomes Invictus Digital is built to deliver."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="flex h-full flex-col p-8 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
            >
              <div className="text-[#22C55E]" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M10 18H6C6 14.686 8.686 12 12 12V8C7.582 8 4 11.582 4 16V18H10V18ZM22 18H18C18 14.686 20.686 12 24 12V8C19.582 8 16 11.582 16 16V18H22V18Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                </svg>
              </div>
              <blockquote className="mt-6 flex-1 text-base leading-8 text-zinc-300">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <footer className="mt-8 border-t border-white/[0.08] pt-6">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{testimonial.role}</p>
                <p className="mt-1 text-sm text-zinc-500">{testimonial.location}</p>
              </footer>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
