type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#22C55E]">
        {label}
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}
