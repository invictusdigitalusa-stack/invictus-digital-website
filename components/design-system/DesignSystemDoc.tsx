import { Container } from "@/components/ui/Container";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/[0.08] py-16 first:border-0 first:pt-0 md:py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
          {description}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const colors = [
  { name: "Primary", hex: "#22C55E", className: "bg-[#22C55E]", text: "text-black" },
  { name: "Secondary", hex: "#34D399", className: "bg-emerald-400", text: "text-black" },
  { name: "Background", hex: "#050505", className: "bg-[#050505] border border-white/[0.08]", text: "text-white" },
  { name: "Text", hex: "#FFFFFF", className: "bg-white", text: "text-black" },
  { name: "Borders", hex: "rgba(255,255,255,0.08)", className: "bg-white/[0.08]", text: "text-white" },
  { name: "Cards", hex: "rgba(255,255,255,0.04)", className: "bg-white/[0.04] border border-white/[0.08]", text: "text-white" },
  { name: "Buttons", hex: "#22C55E", className: "bg-[#22C55E]", text: "text-black" },
];

const spacingScale = [8, 16, 24, 32, 48, 64, 96, 120];

const checklist = [
  { name: "Hero", done: true },
  { name: "Navbar", done: true },
  { name: "Services", done: true },
  { name: "Testimonials", done: true },
  { name: "FAQ", done: true },
  { name: "CTA", done: true },
  { name: "Footer", done: true },
];

const bestPractices = [
  "Large photography",
  "One primary CTA",
  "Consistent spacing",
  "Minimal colors",
  "Readable typography",
  "Fast loading",
  "Responsive first",
  "Premium whitespace",
];

const icons = [
  {
    name: "Arrow",
    svg: (
      <path d="M4 8H12M12 8L9 5M12 8L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    name: "Check",
    svg: (
      <path d="M4 8.5L7 11.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    name: "Star",
    svg: (
      <path d="M8 3L9.5 6.5L13 7L10.5 9.5L11 13L8 11.5L5 13L5.5 9.5L3 7L6.5 6.5L8 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    ),
  },
  {
    name: "Location",
    svg: (
      <>
        <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12C8 12 12 9 12 7C12 4.79 10.21 3 8 3C5.79 3 4 4.79 4 7C4 9 8 12 8 12Z" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    name: "Chart",
    svg: (
      <path d="M3 12V5M8 12V8M13 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    ),
  },
  {
    name: "Menu",
    svg: (
      <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    ),
  },
];

export function DesignSystemDoc() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-12 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Documentation
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Invictus Design System
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Source of truth for color, type, components, and layout standards across
          Invictus Digital products.
        </p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2">
        {[
          "colors",
          "typography",
          "buttons",
          "cards",
          "spacing",
          "icons",
          "checklist",
          "practices",
        ].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium capitalize text-zinc-400 transition hover:border-white/[0.12] hover:text-white"
          >
            {id === "practices" ? "Best Practices" : id}
          </a>
        ))}
      </nav>

      <Section id="colors" title="Color Palette" description="Core tokens for dark-mode Invictus interfaces.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.name}
              className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04]"
            >
              <div className={`flex h-28 items-end p-4 ${color.className}`}>
                <span className={`text-xs font-semibold ${color.text}`}>{color.hex}</span>
              </div>
              <div className="p-4">
                <p className="font-medium text-white">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="typography" title="Typography" description="Geist Sans hierarchy for marketing and internal tools.">
        <div className="space-y-8 rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 md:p-8">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Display · H1</p>
            <p className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Dominate Google.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">H2</p>
            <p className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Everything you need to grow.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">H3</p>
            <p className="text-xl font-semibold text-white md:text-2xl">
              Local SEO That Ranks
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Body Large</p>
            <p className="text-lg leading-8 text-zinc-400 md:text-xl">
              Premium growth systems built for landscaping companies that want more booked jobs.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Body</p>
            <p className="text-base leading-7 text-zinc-400">
              We combine website design, local SEO, and AI visibility into one system.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Caption</p>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Build. Rank. Grow.
            </p>
          </div>
        </div>
      </Section>

      <Section id="buttons" title="Buttons" description="Primary actions use emerald fill. Secondary and ghost support hierarchy.">
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center justify-center rounded-full bg-[#22C55E] px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20">
            Primary
          </span>
          <span className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white">
            Secondary
          </span>
          <span className="inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-7 py-3.5 text-sm font-medium text-zinc-400">
            Ghost
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-[#22C55E] px-8 py-4 text-[15px] font-semibold text-black">
            Large
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-[#22C55E] px-5 py-2 text-xs font-semibold text-black">
            Small
          </span>
          <span className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-[#22C55E]/40 px-7 py-3.5 text-sm font-semibold text-black/50">
            Disabled
          </span>
        </div>
      </Section>

      <Section id="cards" title="Cards" description="Glass surfaces with soft borders and optional hover elevation.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6">
            <p className="text-sm font-semibold text-white">Example Card</p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Default card for content blocks and sections.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 transition hover:border-white/[0.15] hover:bg-white/[0.06]">
            <p className="text-sm font-semibold text-white">Hover Card</p>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Subtle border and background shift on hover.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)]">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Metric</p>
            <p className="mt-2 text-3xl font-semibold text-white">91</p>
            <p className="mt-1 text-sm text-zinc-500">Dashboard Card</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04]">
            <div className="aspect-[16/10] bg-gradient-to-br from-[#1F5C3A] to-[#061810]" />
            <div className="p-6">
              <p className="font-semibold text-white">GreenScape Landscaping</p>
              <p className="mt-1 text-sm text-zinc-500">Project Card</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="spacing" title="Spacing" description="8px base scale for consistent vertical rhythm.">
        <div className="space-y-4 rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 md:p-8">
          {spacingScale.map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="w-12 shrink-0 text-sm font-medium text-zinc-500">{size}px</span>
              <div
                className="h-3 rounded-full bg-[#22C55E]/80"
                style={{ width: `${Math.min(size, 320)}px` }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section id="icons" title="Icons" description="Simple 16–24px stroke icons. Keep weight at 1.5px.">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {icons.map((icon) => (
            <div
              key={icon.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#22C55E]">
                {icon.svg}
              </svg>
              <span className="text-xs text-zinc-500">{icon.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="checklist" title="Component Checklist" description="Homepage component completion status.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checklist.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4"
            >
              <span className="font-medium text-white">{item.name}</span>
              <span className="flex items-center gap-2 text-sm text-[#22C55E]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7.5L6 10.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Complete
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="practices" title="Best Practices" description="Non-negotiables for every Invictus build.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {bestPractices.map((practice) => (
            <li
              key={practice}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-sm text-zinc-300"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" aria-hidden="true" />
              {practice}
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  );
}
