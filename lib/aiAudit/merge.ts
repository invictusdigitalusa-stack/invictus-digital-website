import { normalizeStringList } from "@/lib/utils/normalize";
import { limitExecutiveSummary } from "./parser";
import type { AuditInsights, GptInsightResponse } from "./types";
import { GPT_LIMITS } from "./types";

export function mergeGptInsights(
  fallback: AuditInsights,
  parsed: GptInsightResponse
): AuditInsights {
  const executiveSummary =
    typeof parsed.executiveSummary === "string" &&
    parsed.executiveSummary.trim()
      ? limitExecutiveSummary(parsed.executiveSummary)
      : fallback.executiveSummary;

  const strengths = normalizeStringList(parsed.strengths, GPT_LIMITS.strengths);
  const weaknesses = normalizeStringList(parsed.weaknesses, GPT_LIMITS.weaknesses);
  const seoRecommendations = normalizeStringList(
    parsed.seoRecommendations,
    GPT_LIMITS.seoRecommendations
  );
  const conversionRecommendations = normalizeStringList(
    parsed.conversionRecommendations,
    GPT_LIMITS.conversionRecommendations
  );
  const localSeoRecommendations = normalizeStringList(
    parsed.localSeoRecommendations,
    GPT_LIMITS.localSeoRecommendations
  );
  const aiVisibilityRecommendations = normalizeStringList(
    parsed.aiVisibilityRecommendations,
    GPT_LIMITS.aiVisibilityRecommendations
  );
  const prioritizedActions = normalizeStringList(
    parsed.prioritizedActions,
    GPT_LIMITS.prioritizedActions
  );

  return {
    executiveSummary,
    strengths: strengths.length > 0 ? strengths : fallback.strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : fallback.weaknesses,
    seoRecommendations:
      seoRecommendations.length > 0
        ? seoRecommendations
        : fallback.seoRecommendations,
    conversionRecommendations:
      conversionRecommendations.length > 0
        ? conversionRecommendations
        : fallback.conversionRecommendations,
    localSeoRecommendations:
      localSeoRecommendations.length > 0
        ? localSeoRecommendations
        : fallback.localSeoRecommendations,
    aiVisibilityRecommendations:
      aiVisibilityRecommendations.length > 0
        ? aiVisibilityRecommendations
        : fallback.aiVisibilityRecommendations,
    prioritizedActions:
      prioritizedActions.length > 0
        ? prioritizedActions
        : fallback.prioritizedActions,
  };
}
