import { Card } from "@/components/ui/Card";
import { launchChecklist } from "./data";

type LaunchChecklistProps = {
  launch: Set<string>;
  onToggleLaunch: (id: string) => void;
};

export function LaunchChecklist({ launch, onToggleLaunch }: LaunchChecklistProps) {
  return (
    <section className="border-t border-white/[0.08] pt-12">
      <h2 className="text-2xl font-semibold text-white md:text-3xl">
        Launch Checklist
      </h2>
      <p className="mt-3 text-sm text-zinc-500">
        Final QA before go-live.
      </p>

      <Card className="mt-8 p-6 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {launchChecklist.map((item) => {
            const isChecked = launch.has(item.id);

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 transition hover:border-white/[0.1] hover:bg-white/[0.05]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleLaunch(item.id)}
                  className="h-4 w-4 rounded accent-[#22C55E]"
                />
                <span
                  className={`text-sm font-medium ${isChecked ? "text-[#22C55E]" : "text-zinc-300"}`}
                >
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
