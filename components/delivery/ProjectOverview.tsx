import { Card } from "@/components/ui/Card";
import type { ProjectRow } from "@/lib/supabase";
import {
  displayProjectValue,
  formatProjectDate,
  formatProjectPackage,
} from "./data";

type ProjectOverviewProps = {
  activeProject: ProjectRow | null;
  progress: number;
  isUpdating: boolean;
  actionMessage: { type: "success" | "error"; text: string } | null;
  onUpdateProgress: () => void;
};

export function ProjectOverview({
  activeProject,
  progress,
  isUpdating,
  actionMessage,
  onUpdateProgress,
}: ProjectOverviewProps) {
  return (
    <div className="space-y-4 lg:col-span-1">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
          Client
        </p>
        {activeProject ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {displayProjectValue(activeProject.company)}
            </h2>

            <dl className="mt-6 space-y-4">
              {[
                {
                  label: "Website",
                  value: displayProjectValue(activeProject.website),
                },
                {
                  label: "Package",
                  value: formatProjectPackage(activeProject.package),
                },
                {
                  label: "Start Date",
                  value: formatProjectDate(activeProject.start_date),
                },
                {
                  label: "Launch Goal",
                  value: formatProjectDate(activeProject.launch_goal),
                },
                {
                  label: "Status",
                  value: displayProjectValue(activeProject.status),
                },
                {
                  label: "Assigned To",
                  value: displayProjectValue(activeProject.assigned_to),
                },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-300">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Overall Progress</span>
                <span className="font-semibold text-white">{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#22C55E]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-zinc-500">No projects yet.</p>
        )}
      </Card>

      {activeProject ? (
        <button
          type="button"
          onClick={onUpdateProgress}
          disabled={isUpdating || progress >= 100}
          className="w-full rounded-2xl bg-[#22C55E] px-5 py-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isUpdating ? "Updating..." : "Update Progress"}
        </button>
      ) : null}

      {actionMessage ? (
        <p
          className={`text-sm ${
            actionMessage.type === "success" ? "text-[#22C55E]" : "text-red-400"
          }`}
        >
          {actionMessage.text}
        </p>
      ) : null}
    </div>
  );
}
