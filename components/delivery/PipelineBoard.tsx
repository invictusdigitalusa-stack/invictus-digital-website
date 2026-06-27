import { Card } from "@/components/ui/Card";
import { pipelineStages, statusColor } from "./data";

export function PipelineBoard() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Pipeline
      </h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[960px] gap-3">
          {pipelineStages.map((stage, index) => (
            <Card
              key={stage.id}
              className={`min-w-[140px] flex-1 p-4 transition hover:border-white/[0.12] hover:bg-white/[0.06] ${
                stage.status === "In Progress"
                  ? "border-[#22C55E]/25 bg-[#22C55E]/[0.04]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-[#22C55E]">
                  {String(stage.id).padStart(2, "0")}
                </span>
                {index < pipelineStages.length - 1 ? (
                  <span className="text-zinc-700" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{stage.title}</h3>
              <span
                className={`mt-3 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(stage.status)}`}
              >
                {stage.status}
              </span>
              <p className="mt-3 text-xs text-zinc-500">
                {stage.completion}% complete
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#22C55E]"
                  style={{ width: `${stage.completion}%` }}
                />
              </div>
              <p className="mt-3 text-[11px] text-zinc-500">{stage.date}</p>
              <p className="mt-1 text-[11px] text-zinc-400">{stage.assigned}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
