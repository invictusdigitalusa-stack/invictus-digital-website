import "server-only";

import {
  buildProposalGenerationContext,
  buildProposalPromptPayload,
} from "./proposalContext";
import { createJsonCompletion } from "./openai/jsonCompletion";
import {
  type GeneratedProposal,
  type ProposalGenerateRequest,
  type ProposalGenerationContext,
} from "./proposalTypes";
import { normalizeString, normalizeStringList } from "./utils/normalize";

type GptProposalResponse = Partial<GeneratedProposal>;

const PROPOSAL_SYSTEM_PROMPT = `You write consulting-grade website and local growth proposals for Invictus Digital.

Return strict JSON only with keys:
proposalTitle, executiveSummary, whyThisMatters, whyWeChoseThisPackage, recommendedSolution, scopeSummary, expectedOutcomes, firstThirtyDays, timelineSummary, investmentJustification, nextSteps, closingStatement.

Section requirements:
1. executiveSummary: Reference company positioning, target audience, current business maturity, and biggest opportunity. Never generic.
2. whyThisMatters: Ground entirely in business profile, priority focus, biggest weaknesses, and lead intelligence. Explain why this project should happen now. Never mention audit scores. Never mention AI.
3. whyWeChoseThisPackage: Consultant reasoning for the selected package. Explain why it fits, why a smaller package is insufficient, and why a larger package is unnecessary when applicable.
4. recommendedSolution: Reference audit findings, business profile, opportunities, and conversion improvements. Avoid generic SEO language.
5. scopeSummary: Use recommended package, business maturity, and priority focus.
6. expectedOutcomes: Client-specific outcomes tied only to relevant themes among visibility, conversions, credibility, lead generation, and local presence.
7. firstThirtyDays: 5-8 ordered milestone strings for the selected package. Use Week 1, Week 2, Week 3, Week 4 style labels where appropriate.
8. investmentJustification: Reference expected ROI, opportunities, and business goals. Never promise rankings. Never guarantee revenue.
9. nextSteps: Premium, concise, actionable steps.
10. closingStatement: Professional, short, personalized closing paragraph.

Rules:
- Ground everything in supplied context only.
- Do not mention AI, audit scores, or numeric scores.
- Do not invent case studies, testimonials, clients, statistics, guarantees, or rankings.
- expectedOutcomes, firstThirtyDays, and nextSteps must be arrays of strings.
- Keep language professional and concise.`;

function normalizeMilestones(value: unknown, fallback: string[]) {
  const normalized = normalizeStringList(value);
  return normalized.length > 0 ? normalized.slice(0, 8) : fallback.slice(0, 8);
}

function mergeProposal(
  fallback: GeneratedProposal,
  parsed: GptProposalResponse
): GeneratedProposal {
  return {
    proposalTitle: normalizeString(parsed.proposalTitle, fallback.proposalTitle),
    executiveSummary: normalizeString(
      parsed.executiveSummary,
      fallback.executiveSummary
    ),
    whyThisMatters: normalizeString(parsed.whyThisMatters, fallback.whyThisMatters),
    whyWeChoseThisPackage: normalizeString(
      parsed.whyWeChoseThisPackage,
      fallback.whyWeChoseThisPackage
    ),
    recommendedSolution: normalizeString(
      parsed.recommendedSolution,
      fallback.recommendedSolution
    ),
    scopeSummary: normalizeString(parsed.scopeSummary, fallback.scopeSummary),
    expectedOutcomes: normalizeStringList(parsed.expectedOutcomes).length > 0
      ? normalizeStringList(parsed.expectedOutcomes).slice(0, 6)
      : fallback.expectedOutcomes,
    firstThirtyDays: normalizeMilestones(
      parsed.firstThirtyDays,
      fallback.firstThirtyDays
    ),
    timelineSummary: normalizeString(
      parsed.timelineSummary,
      fallback.timelineSummary
    ),
    investmentJustification: normalizeString(
      parsed.investmentJustification,
      fallback.investmentJustification
    ),
    nextSteps:
      normalizeStringList(parsed.nextSteps).length > 0
        ? normalizeStringList(parsed.nextSteps).slice(0, 5)
        : fallback.nextSteps,
    closingStatement: normalizeString(
      parsed.closingStatement,
      fallback.closingStatement
    ),
  };
}

function buildFirstThirtyDays(
  context: ProposalGenerationContext
): string[] {
  const focus = context.priorityFocus.toLowerCase();
  const company = context.companyName;

  if (context.package === "Starter") {
    return [
      "Week 1: Discovery call, brand review, and homepage strategy aligned to your core services",
      "Week 2: Wireframes and design direction focused on first impressions and contact clarity",
      `Week 3: Development of core pages with mobile-first layout and ${focus}`,
      "Week 4: Contact form setup, basic on-page structure, analytics connection, and pre-launch review",
      `Week 5: Final revisions, launch preparation, and handoff for ${company}`,
    ];
  }

  if (context.package === "Authority") {
    return [
      "Week 1: Discovery, service mapping, and content strategy aligned to your market position",
      "Week 2: Advanced local visibility planning and expanded service page architecture",
      `Week 3: Design system, homepage, and priority service pages built around ${focus}`,
      "Week 4: Content structure, advanced local presence setup, and conversion path refinement",
      "Week 5: Development sprint on expanded service pages and performance optimization",
      "Week 6: Review cycle, reporting setup, launch preparation, and post-launch support plan",
    ];
  }

  return [
    "Week 1: Discovery call, website review, and growth plan tied to your priority focus",
    "Week 2: Local presence audit, Google Business planning, and service page structure",
    `Week 3: Design and homepage build centered on ${focus} and clearer conversion paths`,
    "Week 4: Service pages, local visibility implementation, and content structure",
    "Week 5: Speed optimization, review cycle, launch preparation, and training handoff",
  ];
}

function buildWhyWeChoseThisPackage(context: ProposalGenerationContext) {
  const company = context.companyName;
  const packageName = context.package;
  const focus = context.priorityFocus.toLowerCase();
  const weakness =
    context.auditWeaknesses[0] ?? context.topImprovement ?? "current website gaps";
  const opportunity =
    context.biggestOpportunities[0] ?? "stronger local lead flow";
  const maturity = context.businessMaturity;
  const seoMaturity = maturity?.seoMaturity ?? "Medium";
  const conversionMaturity = maturity?.conversionMaturity ?? "Medium";

  if (packageName === "Starter") {
    return `${company} needs a focused foundation before investing in a broader growth system. Starter addresses ${weakness.toLowerCase()} and improves the core website experience without paying for local SEO campaigns or expanded service architecture the business is not ready to support yet. Growth would add scope around ${opportunity.toLowerCase()} before the base site and conversion path are solid. Authority would be unnecessary at this stage given ${seoMaturity.toLowerCase()} SEO maturity and ${conversionMaturity.toLowerCase()} conversion maturity.`;
  }

  if (packageName === "Authority") {
    return `${company} is positioned for a broader growth system, not a narrow website refresh. Authority supports ${opportunity.toLowerCase()}, expanded service coverage, and ongoing performance visibility while staying aligned to ${focus}. Growth would leave important local visibility and content expansion work unfinished. Starter would fail to address the maturity gap between where the business is today and where it needs to be in the market.`;
  }

  return `${company} needs more than a basic website refresh but does not need enterprise-level scope. Growth is the right fit because it directly supports ${focus}, addresses ${weakness.toLowerCase()}, and creates the local presence needed to capture ${context.industry.toLowerCase()} demand. Starter would stop short of the visibility and conversion work required for ${opportunity.toLowerCase()}. Authority would add reporting and expansion scope that is not necessary until the core growth system is in place.`;
}

function buildExpectedOutcomes(context: ProposalGenerationContext) {
  const company = context.companyName;
  const focus = context.priorityFocus.toLowerCase();
  const opportunity =
    context.biggestOpportunities[0] ?? "more qualified local inquiries";
  const outcomes: string[] = [];

  if (
    context.auditWeaknesses.some((item) =>
      /local|visibility|search|google|maps/i.test(item)
    ) ||
    (context.auditInsights?.localSeoRecommendations.length ?? 0) > 0
  ) {
    outcomes.push(
      `Stronger local presence when ${company}'s ideal customers search for ${context.industry.toLowerCase()} services nearby`
    );
  }

  if (
    context.auditWeaknesses.some((item) =>
      /conversion|contact|cta|call|form|trust/i.test(item)
    ) ||
    (context.auditInsights?.conversionRecommendations.length ?? 0) > 0
  ) {
    outcomes.push(
      `A clearer conversion path that supports ${focus} and reduces lost inquiries`
    );
  }

  if (
    context.businessProfile?.trustSignals.length ||
    context.auditWeaknesses.some((item) => /trust|credibility|review|testimonial/i.test(item))
  ) {
    outcomes.push(
      `A more credible first impression that reflects ${company}'s positioning in the local market`
    );
  }

  outcomes.push(`Better alignment between website messaging and ${opportunity.toLowerCase()}`);
  outcomes.push(
    `A launch-ready system that supports lead generation without adding unnecessary complexity`
  );

  return outcomes.slice(0, 5);
}

function buildPremiumNextSteps(context: ProposalGenerationContext) {
  return [
    `Review this proposal with your team and confirm the ${context.package} scope`,
    "Approve the agreement and submit the project deposit",
    "Schedule the discovery kickoff call with Invictus Digital",
    "Share brand assets, service details, and any existing content",
    `Confirm launch timing for the ${context.timeline.toLowerCase()} delivery plan`,
  ];
}

export function generateDeterministicProposal(
  context: ProposalGenerationContext
): GeneratedProposal {
  const company = context.companyName;
  const packageName = context.package;
  const profile = context.businessProfile;
  const intelligence = context.leadIntelligence;
  const focus = context.priorityFocus;
  const weakness =
    context.auditWeaknesses[0] ??
    context.topImprovement ??
    "gaps in website clarity and local visibility";
  const opportunity =
    context.biggestOpportunities[0] ??
    focus ??
    "stronger lead generation from local search";
  const positioning =
    profile?.brandPositioning ?? `${company} as a trusted ${context.industry.toLowerCase()} provider`;
  const audience =
    profile?.targetAudience ?? `local ${context.industry.toLowerCase()} customers`;
  const maturity = context.businessMaturity;
  const maturityLabel = maturity
    ? `${maturity.seoMaturity.toLowerCase()} SEO maturity and ${maturity.conversionMaturity.toLowerCase()} conversion maturity`
    : "a website that has not yet reached its full commercial potential";
  const conversionRecommendation =
    context.auditInsights?.conversionRecommendations[0] ??
    context.topImprovement;
  const localRecommendation =
    context.auditInsights?.localSeoRecommendations[0] ??
    opportunity;
  const urgency = intelligence?.urgency ?? "Medium";
  const nextAction =
    intelligence?.nextBestAction ?? focus ?? "Improve the website conversion path";

  return {
    proposalTitle: `${packageName} Growth Proposal for ${company}`,
    executiveSummary: `${company} is positioned as ${positioning.toLowerCase()} and serves ${audience.toLowerCase()}. Today the business shows ${maturityLabel}, which means the website is not fully supporting how customers evaluate and choose a ${context.industry.toLowerCase()} provider. The strongest near-term opportunity is ${opportunity.toLowerCase()}, and this ${packageName} proposal is designed to turn that opportunity into a clearer, more credible path to inquiry.`,
    whyThisMatters: `${company} is already competing for local attention, but ${weakness.toLowerCase()} is limiting trust and slowing decisions. With priority focus on ${focus.toLowerCase()}, delaying this project means continuing to lose inquiries to competitors who make the next step easier. ${intelligence?.reasoning ?? profile?.businessSummary ?? ""} ${urgency === "High" ? "The timing matters now because the gap is already affecting commercial momentum." : "The project should happen now because the current site is not supporting the business goals already in motion."}`.trim(),
    whyWeChoseThisPackage: buildWhyWeChoseThisPackage(context),
    recommendedSolution: `We recommend a ${packageName} engagement that rebuilds the website experience around ${focus.toLowerCase()}, strengthens the path from visit to contact, and aligns the site with how ${company} actually wins work. Findings point to ${weakness.toLowerCase()} as a current friction point, while ${opportunity.toLowerCase()} represents the most practical upside. The solution should ${conversionRecommendation?.toLowerCase() ?? "make the next step clearer"} and ${localRecommendation?.toLowerCase() ?? "improve how the business shows up locally"}. ${context.outreachContext?.summary ?? ""}`.trim(),
    scopeSummary: `This ${packageName} scope is shaped for a business at ${maturityLabel}. Work will focus on ${focus.toLowerCase()}, address ${weakness.toLowerCase()}, and deliver the core components needed for ${opportunity.toLowerCase()} without adding work that does not fit the current stage of the business. ${context.packageDetails.scope.slice(0, 3).join(". ")}.`,
    expectedOutcomes: buildExpectedOutcomes(context),
    firstThirtyDays: buildFirstThirtyDays(context),
    timelineSummary: `Delivery is planned over ${context.timeline}. Payment terms: ${context.paymentTerms}. Milestones in the first 30 days establish strategy, design direction, and build momentum before launch.`,
    investmentJustification: `The ${context.packageDetails.investment} investment supports a focused commercial upgrade for ${company}: clearer positioning, a stronger conversion path, and a system aligned to ${opportunity.toLowerCase()}. This is not spend on vanity features. It is the minimum viable growth system needed to capture opportunity already visible in the business profile and current market position. Expected return comes from better inquiry quality and a website that finally supports ${nextAction.toLowerCase()}.`,
    nextSteps: buildPremiumNextSteps(context),
    closingStatement: `${company} does not need a generic website refresh. You need a growth system that reflects how you win work locally and makes the next step easy for the right customer. We would be glad to move forward together and build that foundation with you.`,
  };
}

async function generateGptProposal(
  context: ProposalGenerationContext,
  fallback: GeneratedProposal
): Promise<GeneratedProposal | null> {
  const parsed = await createJsonCompletion<GptProposalResponse>({
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: PROPOSAL_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Generate a consulting proposal from this context.\n\n${JSON.stringify(buildProposalPromptPayload(context), null, 2)}`,
      },
    ],
  });

  if (!parsed) {
    return null;
  }

  return mergeProposal(fallback, parsed);
}

export async function generateProposal(
  input: ProposalGenerateRequest
): Promise<GeneratedProposal> {
  const context = await buildProposalGenerationContext(input);
  const fallback = generateDeterministicProposal(context);
  const gptProposal = await generateGptProposal(context, fallback);

  return gptProposal ?? fallback;
}
