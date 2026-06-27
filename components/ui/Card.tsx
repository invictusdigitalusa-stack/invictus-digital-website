type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/[0.08] bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}
