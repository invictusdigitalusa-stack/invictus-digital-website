"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <a
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="Invictus Digital home"
          >
            <Image
              src="/invictus-logo.svg"
              alt="Invictus Digital"
              width={210}
              height={52}
              priority
              className="h-auto w-[165px] md:w-[210px]"
            />
          </a>

          <nav className="hidden items-center gap-10 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="mailto:invictusdigitalusa@gmail.com">
              Free Audit
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 py-6 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-4">
                <Button href="mailto:invictusdigitalusa@gmail.com">
                  Free Audit
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}