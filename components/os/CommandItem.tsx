type CommandItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  statusLabel?: string | null;
  statusStyle?: string;
};

export function CommandItem({
  title,
  description,
  icon,
  isSelected,
  onClick,
  onMouseEnter,
  statusLabel,
  statusStyle,
}: CommandItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex w-full items-start gap-4 rounded-2xl border px-4 py-3 text-left transition ${
        isSelected
          ? "border-[#22C55E]/30 bg-[#22C55E]/10"
          : "border-transparent bg-transparent hover:border-white/[0.08] hover:bg-white/[0.04]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          isSelected
            ? "border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]"
            : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-white">{title}</span>
          {statusLabel ? (
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyle ?? "border-white/[0.08] bg-white/[0.04] text-zinc-300"}`}
            >
              {statusLabel}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-zinc-500">
          {description}
        </span>
      </span>
    </button>
  );
}
