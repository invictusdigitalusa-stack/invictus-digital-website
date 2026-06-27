import type { ProjectStage } from "@/lib/supabase";

export type AssetFileState = {
  count: number;
  status: "Uploaded" | "Missing";
  isUploading: boolean;
};

export const taskStageMap: Partial<Record<string, ProjectStage>> = {
  logo: "Content Received",
  images: "Content Received",
  text: "Content Received",
  seo: "Design",
  perf: "Review",
  launch: "Launch",
};

export const uploadStageMap: Partial<Record<string, ProjectStage>> = {
  content: "Content Received",
  "brand-guide": "Content Received",
};

export function getNextProgressStep(currentProgress: number) {
  switch (currentProgress) {
    case 0:
      return { progress: 25, status: "Discovery Call" };
    case 25:
      return { progress: 50, status: "Content Received" };
    case 50:
      return { progress: 75, status: "Development" };
    case 75:
      return { progress: 100, status: "Launch" };
    default:
      return null;
  }
}
