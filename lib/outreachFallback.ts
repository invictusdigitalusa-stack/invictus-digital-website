import type { OutreachEmail, OutreachFallbackInput } from "./outreachTypes";

const closings: Record<OutreachFallbackInput["tone"], string> = {
  Professional: "Best,\nDouglas\nInvictus Digital",
  Friendly: "Cheers,\nDouglas\nInvictus Digital",
  Direct: "— Douglas\nInvictus Digital",
};

const openings: Record<OutreachFallbackInput["tone"], (company: string) => string> =
  {
    Professional: (company) => `Hi ${company},`,
    Friendly: (company) => `Hey ${company} team,`,
    Direct: (company) => `${company} — quick note.`,
  };

export function generateFallbackOutreach(
  input: OutreachFallbackInput
): OutreachEmail {
  const company = input.companyName.trim() || "{{Company}}";
  const improvement = input.topImprovement.trim() || "{{Top Improvement}}";
  const industryLabel = input.industry.toLowerCase();
  const packageName = input.idealPackage?.trim() || "Growth";

  const opening = openings[input.tone](company);
  const body = `I came across your website while looking at ${industryLabel} companies in your area.

I noticed a few opportunities that could help improve conversions and local visibility.

The biggest improvement I saw was:

${improvement}

We help local businesses like yours with a focused ${packageName} package when the site is leaving leads on the table.`;
  const cta =
    "If you're open to it, I'd be happy to walk you through a quick concept and what fixing this could look like.";

  return {
    subject: `Quick idea for ${company}`,
    opening,
    body,
    cta,
  };
}

export function composeOutreachEmail(
  email: OutreachEmail,
  tone: OutreachFallbackInput["tone"]
): { subject: string; body: string } {
  return {
    subject: email.subject,
    body: `${email.opening}\n\n${email.body}\n\n${email.cta}\n\n${closings[tone]}`,
  };
}
