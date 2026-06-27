export type OutreachEmail = {
  subject: string;
  opening: string;
  body: string;
  cta: string;
};

export type OutreachTone = "Professional" | "Friendly" | "Direct";

export type OutreachFallbackInput = {
  companyName: string;
  industry: string;
  topImprovement: string;
  tone: OutreachTone;
  idealPackage?: string;
};
