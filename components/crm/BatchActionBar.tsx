type BatchActionBarProps = {
  selectedCount: number;
  isProcessing: boolean;
  onClear: () => void;
  onRunAI: () => void;
  onGenerateOutreach: () => void;
  onGenerateProposal: () => void;
  onMarkContacted: () => void;
  onMarkWon: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

const actionButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50";

export function BatchActionBar({
  selectedCount,
  isProcessing,
  onClear,
  onRunAI,
  onGenerateOutreach,
  onGenerateProposal,
  onMarkContacted,
  onMarkWon,
  onArchive,
  onDelete,
}: BatchActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
      <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/95 p-4 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-white">
              {selectedCount} lead{selectedCount === 1 ? "" : "s"} selected
            </p>
            <button
              type="button"
              onClick={onClear}
              disabled={isProcessing}
              className="text-xs font-medium text-zinc-500 transition hover:text-white disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRunAI}
              disabled={isProcessing}
              className={`${actionButtonClassName} border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15`}
            >
              Run AI
            </button>
            <button
              type="button"
              onClick={onGenerateOutreach}
              disabled={isProcessing}
              className={actionButtonClassName}
            >
              Generate Outreach
            </button>
            <button
              type="button"
              onClick={onGenerateProposal}
              disabled={isProcessing}
              className={actionButtonClassName}
            >
              Generate Proposal
            </button>
            <button
              type="button"
              onClick={onMarkContacted}
              disabled={isProcessing}
              className={actionButtonClassName}
            >
              Mark Contacted
            </button>
            <button
              type="button"
              onClick={onMarkWon}
              disabled={isProcessing}
              className={`${actionButtonClassName} border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/15`}
            >
              Mark Won
            </button>
            <button
              type="button"
              onClick={onArchive}
              disabled={isProcessing}
              className={actionButtonClassName}
            >
              Archive
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isProcessing}
              className={`${actionButtonClassName} border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
