import { Card } from "@/components/ui/Card";
import { industries, type Industry } from "./data";

export type AuditFormValues = {
  companyName: string;
  websiteUrl: string;
  industry: Industry;
};

export function parseIndustry(value?: string): Industry {
  if (value && industries.includes(value as Industry)) {
    return value as Industry;
  }
  return "Landscaping";
}

type AuditFormProps = {
  form: AuditFormValues;
  onFormChange: (form: AuditFormValues) => void;
  isAnalyzing: boolean;
  analyzeMessage: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

const inputClassName =
  "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]";

export function AuditForm({
  form,
  onFormChange,
  isAnalyzing,
  analyzeMessage,
  onSubmit,
}: AuditFormProps) {
  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="company-name"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            placeholder="Summit Roofing Co."
            value={form.companyName}
            onChange={(e) =>
              onFormChange({ ...form, companyName: e.target.value })
            }
            className={inputClassName}
            required
          />
        </div>

        <div>
          <label
            htmlFor="website-url"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Website URL
          </label>
          <input
            id="website-url"
            type="url"
            placeholder="https://example.com"
            value={form.websiteUrl}
            onChange={(e) =>
              onFormChange({ ...form, websiteUrl: e.target.value })
            }
            className={inputClassName}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="industry"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Industry
          </label>
          <select
            id="industry"
            value={form.industry}
            onChange={(e) =>
              onFormChange({
                ...form,
                industry: e.target.value as Industry,
              })
            }
            className={`${inputClassName} cursor-pointer`}
          >
            {industries.map((industry) => (
              <option key={industry} value={industry} className="bg-[#0a0a0a]">
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#22C55E] px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Website"}
          </button>
        </div>
      </form>

      {analyzeMessage ? (
        <p className="mt-4 text-sm text-red-400">{analyzeMessage}</p>
      ) : null}
    </Card>
  );
}
