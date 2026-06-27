import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function DesignSystemNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050505]/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <Image
                src="/invictus-logo.svg"
                alt="Invictus Digital"
                width={160}
                height={40}
                className="h-auto w-[130px] md:w-[160px]"
              />
            </Link>
            <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 sm:inline-flex">
              Internal
            </span>
          </div>
          <p className="text-xs text-zinc-500 md:text-sm">Design System</p>
        </div>
      </Container>
    </header>
  );
}
