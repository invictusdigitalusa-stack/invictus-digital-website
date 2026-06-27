export type AuditInsights = {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  seoRecommendations: string[];
  conversionRecommendations: string[];
  localSeoRecommendations: string[];
  aiVisibilityRecommendations: string[];
  prioritizedActions: string[];
};

export type GptInsightResponse = {
  executiveSummary?: string;
  strengths?: string[];
  weaknesses?: string[];
  seoRecommendations?: string[];
  conversionRecommendations?: string[];
  localSeoRecommendations?: string[];
  aiVisibilityRecommendations?: string[];
  prioritizedActions?: string[];
};

export const GPT_LIMITS = {
  executiveSummaryWords: 80,
  strengths: 4,
  weaknesses: 4,
  seoRecommendations: 5,
  conversionRecommendations: 5,
  localSeoRecommendations: 5,
  aiVisibilityRecommendations: 5,
  prioritizedActions: 5,
} as const;
