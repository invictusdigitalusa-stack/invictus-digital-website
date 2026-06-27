type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  light = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p
        className={`text-sm font-semibold uppercase tracking-[0.2em] ${light ? "text-emerald-200" : "text-[#2F7A4F]"}`}
      >
        {label}
      </p>
      <h2
        className={`mt-4 text-4xl font-semibold tracking-tight md:text-5xl ${light ? "text-white" : "text-[#143D2B]"}`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-lg leading-8 ${light ? "text-emerald-50/80" : "text-zinc-600"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
