type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[#22C55E] text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/30"
      : "border border-white/[0.08] bg-white/[0.04] text-white hover:border-white/[0.15] hover:bg-white/[0.08]";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
