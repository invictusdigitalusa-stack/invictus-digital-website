"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#143D2B]/10 bg-white/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-8">
          <a href="#" className="flex items-center gap-3" aria-label="GreenScape Landscaping home">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#143D2B] text-sm font-bold text-white">
              GS
            </div>
            <div>
              <span className="block text-sm font-semibold text-[#143D2B]">
                GreenScape Landscaping
              </span>
              <span className="block text-xs text-zinc-500">Austin, Texas</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 transition hover:text-[#143D2B]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="#contact">Get Free Estimate</Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#143D2B]/10 text-[#143D2B] lg:hidden"
            aria-expanded={open}
            aria-controls="greenscape-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open ? (
          <nav
            id="greenscape-mobile-nav"
            className="border-t border-[#143D2B]/10 py-6 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm text-zinc-600 hover:bg-[#F4F9F6] hover:text-[#143D2B]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 px-4">
                <Button href="#contact" className="w-full">
                  Get Free Estimate
                </Button>
              </div>
            </div>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
