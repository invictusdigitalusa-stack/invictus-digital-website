import { Container } from "../ui/Container";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#22C55E] text-sm font-black text-black">
                ID
              </div>
              <span className="text-sm font-semibold tracking-wide">
                Invictus Digital
              </span>
            </a>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              Premium AI growth systems for landscaping companies. Website
              design, local SEO, AI visibility, and Google Business
              optimization — built to generate more leads.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Navigation</p>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="mailto:invictusdigitalusa@gmail.com"
                  className="text-sm text-zinc-400 transition hover:text-white"
                >
                  invictusdigitalusa@gmail.com
                </a>
              </li>
            </ul>

            <p className="mt-8 text-sm font-semibold text-white">Social</p>
            <ul className="mt-5 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-white"
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Invictus Digital. All rights reserved.</p>
          <p>Built for landscaping companies across the United States.</p>
        </div>
      </Container>
    </footer>
  );
}
