import { Card } from "@/components/ui/Card";
import { initialTasks } from "./data";

type ChecklistItem = { id: string; label: string; done?: boolean };

function Checklist({
  items,
  checked,
  onToggle,
}: {
  items: ChecklistItem[];
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isChecked = checked.has(item.id);

        return (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition hover:border-white/[0.1] hover:bg-white/[0.05]">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#22C55E]"
              />
              <span
                className={`text-sm ${isChecked ? "text-zinc-500 line-through" : "text-zinc-300"}`}
              >
                {item.label}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

type TaskChecklistProps = {
  tasks: Set<string>;
  onToggleTask: (id: string) => void;
};

export function TaskChecklist({ tasks, onToggleTask }: TaskChecklistProps) {
  return (
    <Card className="p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Tasks
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">Checklist</h2>
      <div className="mt-6">
        <Checklist
          items={initialTasks}
          checked={tasks}
          onToggle={onToggleTask}
        />
      </div>
    </Card>
  );
}
