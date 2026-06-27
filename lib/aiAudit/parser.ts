import { GPT_LIMITS } from "./types";

export function limitWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return words.join(" ");
  }

  return words.slice(0, maxWords).join(" ");
}

export function limitExecutiveSummary(text: string) {
  return limitWords(text, GPT_LIMITS.executiveSummaryWords);
}
