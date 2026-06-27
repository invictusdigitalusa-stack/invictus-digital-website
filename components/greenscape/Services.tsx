import { Container } from "./ui/Container";
import { SectionHeader } from "./ui/SectionHeader";

function ServiceIcon({ type }: { type: string }) {
  const stroke = "#2F7A4F";

  const icons: Record<string, React.ReactNode> = {
    "Lawn Care": (
      <path d="M4 18C4 14 8 10 12 10C16 10 20 14 20 18" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    "Landscape Design": (
      <>
        <rect x="4" y="8" width="16" height="10" rx="1" stroke={stroke} strokeWidth="1.5" />
        <path d="M8 18V14M12 18V12M16 18V15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    "Tree Trimming": (
      <path d="M12 4V20M8 10C8 7 10 5 12 5C14 5 16 7 16 10C16 13 12 16 12 16C12 16 8 13 8 10Z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
    ),
    Irrigation: (
      <>
        <path d="M6 10C6 6 9 4 12 4C15 4 18 6 18 10C18 14 12 20 12 20C12 20 6 14 6 10Z" stroke={stroke} strokeWidth="1.5" />
        <path d="M12 11V15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    Hardscaping: (
      <>
        <rect x="4" y="12" width="7" height="6" stroke={stroke} strokeWidth="1.5" />
        <rect x="13" y="8" width="7" height="10" stroke={stroke} strokeWidth="1.5" />
      </>
    ),
  };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

const services = [
  {
    title: "Lawn Care",
    description:
      "Weekly mowing, edging, fertilization, and seasonal treatments to keep your lawn healthy and vibrant year-round.",
    features: ["Weekly maintenance", "Weed control", "Seasonal fertilization"],
  },
  {
    title: "Landscape Design",
    description:
      "Custom outdoor plans tailored to your home, lifestyle, and Austin climate — from concept to completion.",
    features: ["3D concepts", "Plant selection", "Full installation"],
  },
  {
    title: "Tree Trimming",
    description:
      "Professional pruning and tree care to improve safety, health, and curb appeal for your property.",
    features: ["Crown shaping", "Deadwood removal", "Storm cleanup"],
  },
  {
    title: "Irrigation",
    description:
      "Smart irrigation systems designed to conserve water while keeping your landscape lush through Texas heat.",
    features: ["System design", "Repairs & upgrades", "Water-efficient zones"],
  },
  {
    title: "Hardscaping",
    description:
      "Patios, walkways, retaining walls, and outdoor living spaces built with premium materials and craftsmanship.",
    features: ["Stone patios", "Retaining walls", "Outdoor kitchens"],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeader
          label="Our Services"
          title="Everything your yard needs."
          description="From routine lawn care to full outdoor transformations, GreenScape delivers premium results for Austin homeowners."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-3xl border border-[#143D2B]/10 bg-[#F4F9F6] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#143D2B]/20 hover:shadow-lg hover:shadow-[#143D2B]/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#143D2B]/10">
                <ServiceIcon type={service.title} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#143D2B]">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm text-zinc-700"
                  >
                    <span className="text-[#2F7A4F]" aria-hidden="true">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
