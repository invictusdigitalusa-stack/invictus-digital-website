import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const services = ["Website", "Local SEO", "AI Visibility"];

export function ProjectGrid() {
  return (
    <section className="bg-[#050505] pb-28 text-white md:pb-32">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="group overflow-hidden transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] xl:col-span-1">
            <div
              className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.08]"
              role="img"
              aria-label="GreenScape Landscaping website preview"
            >
              <div className="absolute inset-0 bg-[linear-gradient(160deg,#1F5C3A_0%,#143D2B_50%,#0B2E1A_100%)] transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/[0.08] bg-[#050505]/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                Demo Project
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white">
                GreenScape Landscaping
              </h2>
              <p className="mt-2 text-sm text-zinc-500">Austin, Texas</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-300"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Button href="/greenscape">View Project</Button>
              </div>
            </div>
          </Card>

          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="flex min-h-[420px] flex-col items-center justify-center border-dashed p-8 text-center transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.03]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <span className="text-lg text-zinc-600">+</span>
              </div>
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Coming Soon
              </p>
              <p className="mt-3 max-w-[12rem] text-sm leading-6 text-zinc-600">
                New client projects will appear here.
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
