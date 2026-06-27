import { Container } from "./ui/Container";
import { SectionHeader } from "./ui/SectionHeader";

const projects = [
  {
    title: "Tarrytown Front Yard",
    service: "Landscape Design + Lawn Care",
    before: "from-[#8B7355] via-[#6B5B4F] to-[#4A4035]",
    after: "from-[#3D9970] via-[#2F7A4F] to-[#1F5C3A]",
  },
  {
    title: "Mueller Backyard Patio",
    service: "Hardscaping + Irrigation",
    before: "from-[#7A6A55] via-[#5C4E42] to-[#3E3530]",
    after: "from-[#4A8060] via-[#2F6B4F] to-[#1A4D35]",
  },
  {
    title: "Circle C Outdoor Living",
    service: "Full Landscape Renovation",
    before: "from-[#9A8570] via-[#756555] to-[#524840]",
    after: "from-[#45A070] via-[#35855C] to-[#1F5C3A]",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-[#F4F9F6] py-24 md:py-32">
      <Container>
        <SectionHeader
          label="Our Work"
          title="Before & after transformations."
          description="See the difference professional landscaping makes — real results for Austin homeowners."
        />

        <div className="mt-16 space-y-12">
          {projects.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-[2rem] border border-[#143D2B]/10 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.before}`}
                    role="img"
                    aria-label={`Before photo of ${project.title}`}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.after}`}
                    role="img"
                    aria-label={`After photo of ${project.title}`}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#143D2B]/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    After
                  </span>
                </div>
              </div>
              <div className="border-t border-[#143D2B]/10 px-6 py-5 md:px-8">
                <h3 className="text-lg font-semibold text-[#143D2B]">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{project.service}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
