export const projectStages = [
  "Lead Won",
  "Discovery Call",
  "Content Received",
  "Design",
  "Development",
  "Review",
  "Launch",
] as const;

export type ProjectStage = (typeof projectStages)[number];

export const projectStageProgress: Record<ProjectStage, number> = {
  "Lead Won": 0,
  "Discovery Call": 15,
  "Content Received": 30,
  Design: 45,
  Development: 70,
  Review: 90,
  Launch: 100,
};

export const proposalInvestments: Record<string, number> = {
  Starter: 2500,
  Growth: 4500,
  Authority: 7500,
};

export const projectStorageBuckets = [
  "logos",
  "images",
  "content",
  "contracts",
  "brand-guides",
] as const;

export type ProjectStorageBucket = (typeof projectStorageBuckets)[number];
