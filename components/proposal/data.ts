export const industries = [
  "Landscaping",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Painting",
  "Concrete",
] as const;

export const packages = ["Starter", "Growth", "Authority"] as const;

export type PackageName = (typeof packages)[number];
export type Industry = (typeof industries)[number];

export type ProposalStatus = "Draft" | "Sent" | "Viewed" | "Signed";

export const packageDetails: Record<
  PackageName,
  { investment: string; scope: string[]; deliverables: string[] }
> = {
  Starter: {
    investment: "$2,500",
    scope: [
      "Premium website design and development",
      "Mobile-first responsive layout",
      "Contact form integration",
      "Basic on-page SEO setup",
      "Google Analytics connection",
    ],
    deliverables: [
      "Custom homepage + core pages",
      "Mobile optimization",
      "Contact form",
      "Basic SEO",
      "Google Analytics",
      "30 days post-launch support",
    ],
  },
  Growth: {
    investment: "$4,500",
    scope: [
      "Everything in Starter",
      "Local SEO strategy and implementation",
      "Google Business Profile optimization",
      "AI visibility structure",
      "Service page architecture",
      "Speed and performance optimization",
    ],
    deliverables: [
      "Full growth website",
      "Local SEO system",
      "Google Business optimization",
      "AI-ready content structure",
      "Service pages",
      "Speed optimization",
      "60 days post-launch support",
    ],
  },
  Authority: {
    investment: "$7,500",
    scope: [
      "Everything in Growth",
      "Unlimited service page expansion",
      "Advanced local SEO campaigns",
      "Content strategy roadmap",
      "Monthly performance reporting",
      "Priority support channel",
    ],
    deliverables: [
      "Authority-level website",
      "Advanced local SEO",
      "Content strategy",
      "Monthly reporting",
      "Unlimited service pages",
      "Priority support",
      "90 days post-launch support",
    ],
  },
};

export const nextSteps = [
  "Review and approve this proposal",
  "Sign agreement and submit deposit",
  "Schedule discovery kickoff call",
  "Provide brand assets and content",
  "Launch your growth system on timeline",
];
