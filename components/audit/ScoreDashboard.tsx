import { Card } from "@/components/ui/Card";
import { getAuditGrade } from "@/lib/audit";
import { overallMax, scoreCategories } from "./data";

type ScoreBreakdownItem = {
  label: string;
  score: number;
  max: number;
};

function ScoreBar({ score, max }: { score: number; max: number }) {
  const percentage = (score / max) * 100;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-[#22C55E] transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

type ScoreDashboardProps = {
  overallScore: number;
  scoreBreakdown: ScoreBreakdownItem[];
};

export function ScoreDashboard({
  overallScore,
  scoreBreakdown,
}: ScoreDashboardProps) {
  return (
    <Card className="overflow-hidden p-8 md:p-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            Overall Score
          </p>
          <p className="mt-4 text-6xl font-semibold tracking-tight text-white md:text-7xl">
            {overallScore}
            <span className="text-3xl font-medium text-zinc-500 md:text-4xl">
              {" "}
              / {overallMax}
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#22C55E]">
            Grade
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {getAuditGrade(overallScore)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {scoreBreakdown.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition hover:border-white/[0.1] hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-300">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-white">
                {item.score}{" "}
                <span className="text-zinc-500">/ {item.max}</span>
              </p>
            </div>
            <div className="mt-4">
              <ScoreBar score={item.score} max={item.max} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
