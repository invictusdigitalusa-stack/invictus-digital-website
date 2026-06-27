import { Card } from "@/components/ui/Card";
import type { AuditInsights } from "@/lib/aiAudit";

function InsightList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

type AuditInsightsPanelProps = {
  insights: AuditInsights;
};

export function AuditInsightsPanel({ insights }: AuditInsightsPanelProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white md:text-2xl">
        AI Audit Insights
      </h2>

      <div className="mt-6 space-y-4">
        <Card className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            Executive Summary
          </p>
          <p className="mt-4 text-sm leading-8 text-zinc-300">
            {insights.executiveSummary}
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <InsightList title="Strengths" items={insights.strengths} />
          <InsightList title="Weaknesses" items={insights.weaknesses} />
          <InsightList
            title="SEO Recommendations"
            items={insights.seoRecommendations}
          />
          <InsightList
            title="Conversion Recommendations"
            items={insights.conversionRecommendations}
          />
          <InsightList
            title="Local SEO Recommendations"
            items={insights.localSeoRecommendations}
          />
          <InsightList
            title="AI Visibility Recommendations"
            items={insights.aiVisibilityRecommendations}
          />
        </div>

        <InsightList
          title="Prioritized Actions"
          items={insights.prioritizedActions}
        />
      </div>
    </div>
  );
}
