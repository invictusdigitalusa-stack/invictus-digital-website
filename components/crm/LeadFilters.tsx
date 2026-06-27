import { allIndustries, allStatuses } from "./data";

type LeadFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  industryFilter: string;
  onIndustryFilterChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
};

export function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  industryFilter,
  onIndustryFilterChange,
  filteredCount,
  totalCount,
}: LeadFiltersProps) {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-md">
          <span className="sr-only">Search leads</span>
          <input
            type="search"
            placeholder="Search company, website, industry, status..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3 pr-4 pl-11 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]"
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </label>
        <p className="text-sm text-zinc-500">
          Showing {filteredCount} of {totalCount} leads
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onStatusFilterChange("All")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            statusFilter === "All"
              ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
              : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.12] hover:text-white"
          }`}
        >
          All Status
        </button>
        {allStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusFilterChange(status)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === status
                ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.12] hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onIndustryFilterChange("All")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            industryFilter === "All"
              ? "border-white/[0.15] bg-white/[0.08] text-white"
              : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.12] hover:text-white"
          }`}
        >
          All Industries
        </button>
        {allIndustries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => onIndustryFilterChange(industry)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              industryFilter === industry
                ? "border-white/[0.15] bg-white/[0.08] text-white"
                : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.12] hover:text-white"
            }`}
          >
            {industry}
          </button>
        ))}
      </div>
    </>
  );
}
