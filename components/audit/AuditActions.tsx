const AUDIT_PRIMARY_PROBLEM =
  "The website has opportunities to improve first impression, conversion and local visibility.";

type AuditResultForActions = {
  companyName: string;
  websiteUrl: string;
  industry: string;
  top_improvement: string;
};

export function buildOutreachUrl(result: AuditResultForActions) {
  const params = new URLSearchParams();
  params.set("company", result.companyName);
  params.set("website", result.websiteUrl);
  params.set("industry", result.industry);
  params.set("problem", AUDIT_PRIMARY_PROBLEM);
  params.set("improvement", result.top_improvement);
  return `/outreach?${params.toString()}`;
}

type AuditActionsProps = {
  isSaving: boolean;
  saveMessage: { type: "success" | "error"; text: string } | null;
  onGenerateColdEmail: () => void;
  onSaveToCRM: () => void;
};

export function AuditActions({
  isSaving,
  saveMessage,
  onGenerateColdEmail,
  onSaveToCRM,
}: AuditActionsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 py-5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.08] hover:scale-[1.01] active:scale-[0.99]"
        >
          Copy Audit
        </button>
        <button
          type="button"
          onClick={onGenerateColdEmail}
          className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-6 py-5 text-sm font-semibold text-[#22C55E] transition-all duration-300 hover:border-[#22C55E]/30 hover:bg-[#22C55E]/15 hover:scale-[1.01] active:scale-[0.99]"
        >
          Generate Cold Email
        </button>
        <button
          type="button"
          onClick={onSaveToCRM}
          disabled={isSaving}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 py-5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.08] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save to CRM"}
        </button>
      </div>

      {saveMessage ? (
        <p
          className={`text-center text-sm ${
            saveMessage.type === "success"
              ? "text-[#22C55E]"
              : "text-red-400"
          }`}
        >
          {saveMessage.text}
        </p>
      ) : null}
    </>
  );
}
