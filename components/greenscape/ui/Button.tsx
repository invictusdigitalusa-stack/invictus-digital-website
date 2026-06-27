type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles = {
    primary:
      "bg-[#143D2B] text-white shadow-lg shadow-[#143D2B]/20 hover:bg-[#1F5C3A]",
    secondary:
      "bg-white text-[#143D2B] shadow-md hover:bg-[#F4F9F6]",
    outline:
      "border border-white/30 bg-transparent text-white hover:bg-white/10",
  }[variant];

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
