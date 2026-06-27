"use client";

import { useState } from "react";

const navItems = [
  { label: "Services", href: "#" },
  { label: "About", href: "#" },
  { label: "Gallery", href: "#" },
  { label: "Reviews", href: "#" },
];

export function LonghornNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#061810]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3.5" aria-label="Longhorn Lawns home">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3D7A52]/40 bg-[#0F2E1C]">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M11 3L13 9H19L14.5 12.5L16 19L11 15.5L6 19L7.5 12.5L3 9H9L11 3Z"
                stroke="#6BBF8A"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="block text-[15px] font-semibold tracking-[-0.02em] text-white">
              Longhorn Lawns
            </span>
            <span className="block text-[11px] tracking-wide text-[#7FAF92]">
              Austin, Texas
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] text-[#9BC4AA] transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-[#4ADE80] px-6 py-3 text-[13px] font-semibold text-[#052010] transition hover:bg-[#86EFAC]"
          >
            Get Free Estimate
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-[#9BC4AA] lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/[0.06] px-6 py-6 lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm text-[#9BC4AA] hover:bg-white/[0.04] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#4ADE80] px-6 py-3 text-sm font-semibold text-[#052010]"
            >
              Get Free Estimate
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
