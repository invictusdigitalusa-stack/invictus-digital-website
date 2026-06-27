import { Container } from "./ui/Container";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

const services = [
  "Lawn Care",
  "Landscape Design",
  "Tree Trimming",
  "Irrigation",
  "Hardscaping",
];

export function Footer() {
  return (
    <footer className="border-t border-[#143D2B]/10 bg-white py-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#143D2B] text-sm font-bold text-white">
                GS
              </div>
              <span className="text-sm font-semibold text-[#143D2B]">
                GreenScape Landscaping
              </span>
            </a>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-600">
              Premium landscaping services for Austin homeowners. Lawn care,
              design, hardscaping, and more — delivered with care and
              craftsmanship.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#143D2B]">Navigation</p>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 transition hover:text-[#143D2B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#143D2B]">Services</p>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-sm text-zinc-600">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#143D2B]/10 pt-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} GreenScape Landscaping. All rights reserved.</p>
          <p>Austin, Texas · Licensed & Insured</p>
        </div>
      </Container>
    </footer>
  );
}
