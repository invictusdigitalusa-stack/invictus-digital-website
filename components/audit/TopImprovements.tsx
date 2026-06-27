import { Card } from "@/components/ui/Card";

type ImprovementItem = {
  title: string;
  description: string;
};

type TopImprovementsProps = {
  improvements: ImprovementItem[];
};

export function TopImprovements({ improvements }: TopImprovementsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white md:text-2xl">
        Top 3 Improvements
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {improvements.map((item, index) => (
          <Card
            key={item.title}
            className="p-6 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Priority {index + 1}
            </p>
            <h3 className="mt-4 text-base font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
