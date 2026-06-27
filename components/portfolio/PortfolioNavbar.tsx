import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function PortfolioNavbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link
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
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/portfolio"
              className="hidden text-sm text-white sm:block"
            >
              Portfolio
            </Link>
            <Button href="mailto:invictusdigitalusa@gmail.com">
              Free Audit
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
