import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export function CTA() {
  return (
    <section id="contact" className="bg-[#F4F9F6] py-24 md:py-32">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-[#143D2B] px-8 py-16 text-center md:px-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Ready to get started?
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Get your free estimate today.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80">
            Tell us about your project and we&apos;ll provide a detailed,
            no-obligation estimate within 24 hours. Serving all of Greater
            Austin.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="tel:+15125550187" variant="secondary">
              Call (512) 555-0187
            </Button>
            <Button href="mailto:hello@greenscapeaustin.com" variant="outline">
              Email Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
