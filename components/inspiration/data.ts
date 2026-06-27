export type InspirationCategory =
  | "Landscaping"
  | "Home Services"
  | "General Web Design";

export type InspirationItem = {
  id: string;
  company: string;
  country: string;
  category: InspirationCategory;
  reason: string;
  website: string;
  gradient: string;
};

export const categories: InspirationCategory[] = [
  "Landscaping",
  "Home Services",
  "General Web Design",
];

export const sortOptions = [
  "Recently Added",
  "Company A–Z",
  "Country A–Z",
] as const;

export type SortOption = (typeof sortOptions)[number];

export const designPrinciples = [
  "Large photography",
  "Strong typography",
  "Clear CTA",
  "Generous whitespace",
  "Premium spacing",
  "Minimal color palette",
  "Soft shadows",
  "Rounded corners",
];

export const inspirations: InspirationItem[] = [
  {
    id: "l1",
    company: "Field Notes Landscaping",
    country: "United States",
    category: "Landscaping",
    reason: "Hero photography and service hierarchy feel editorial, not contractor-template.",
    website: "https://example.com",
    gradient: "from-[#1A4D32] via-[#0F3322] to-[#061810]",
  },
  {
    id: "l2",
    company: "Verde Outdoor Co.",
    country: "Spain",
    category: "Landscaping",
    reason: "Muted green palette with oversized type creates instant premium positioning.",
    website: "https://example.com",
    gradient: "from-[#2D5A40] via-[#1E3D2B] to-[#0A1F14]",
  },
  {
    id: "l3",
    company: "Summit Garden Studio",
    country: "United Kingdom",
    category: "Landscaping",
    reason: "Before/after gallery layout drives trust without cluttering the homepage.",
    website: "https://example.com",
    gradient: "from-[#3A6B4F] via-[#244A35] to-[#122820]",
  },
  {
    id: "l4",
    company: "Oakline Estates",
    country: "Canada",
    category: "Landscaping",
    reason: "Whitespace-heavy layout makes high-ticket design work feel luxury-grade.",
    website: "https://example.com",
    gradient: "from-[#1F4D38] via-[#163528] to-[#0B1A12]",
  },
  {
    id: "l5",
    company: "Horizon Lawn Group",
    country: "Australia",
    category: "Landscaping",
    reason: "Local trust badges are integrated cleanly above the fold, not bolted on.",
    website: "https://example.com",
    gradient: "from-[#2F6048] via-[#1B4030] to-[#0D2218]",
  },
  {
    id: "l6",
    company: "Cedar & Stone",
    country: "United States",
    category: "Landscaping",
    reason: "Hardscaping portfolio uses full-bleed imagery with minimal UI chrome.",
    website: "https://example.com",
    gradient: "from-[#3D5A48] via-[#2A3F32] to-[#141F18]",
  },
  {
    id: "l7",
    company: "Greenline Collective",
    country: "Germany",
    category: "Landscaping",
    reason: "Typography scale and grid rhythm feel closer to architecture than lawn care.",
    website: "https://example.com",
    gradient: "from-[#1E5238] via-[#143824] to-[#081810]",
  },
  {
    id: "l8",
    company: "Prairie Form Landscapes",
    country: "United States",
    category: "Landscaping",
    reason: "Single primary CTA repeated with restraint keeps the page focused on leads.",
    website: "https://example.com",
    gradient: "from-[#2A5540] via-[#1A3828] to-[#0C1810]",
  },
  {
    id: "h1",
    company: "Northwind HVAC",
    country: "United States",
    category: "Home Services",
    reason: "Emergency CTA and service areas are structured with clear visual priority.",
    website: "https://example.com",
    gradient: "from-[#1E3A5F] via-[#142840] to-[#0A1420]",
  },
  {
    id: "h2",
    company: "Atlas Roofing",
    country: "United Kingdom",
    category: "Home Services",
    reason: "Project stats in the hero sell outcomes before scrolling a single section.",
    website: "https://example.com",
    gradient: "from-[#3A3A48] via-[#252530] to-[#121218]",
  },
  {
    id: "h3",
    company: "FlowState Plumbing",
    country: "Canada",
    category: "Home Services",
    reason: "Icon system and card spacing create a polished SaaS-like service breakdown.",
    website: "https://example.com",
    gradient: "from-[#1A4A58] via-[#123038] to-[#081820]",
  },
  {
    id: "h4",
    company: "Precision Paint Co.",
    country: "United States",
    category: "Home Services",
    reason: "Color swatches and process steps use photography frames that feel custom-built.",
    website: "https://example.com",
    gradient: "from-[#4A3848] via-[#302430] to-[#181018]",
  },
  {
    id: "h5",
    company: "SolidCore Concrete",
    country: "Australia",
    category: "Home Services",
    reason: "Industrial brand tone paired with soft rounded UI avoids the typical gritty look.",
    website: "https://example.com",
    gradient: "from-[#3A3A3A] via-[#282828] to-[#141414]",
  },
  {
    id: "h6",
    company: "BrightSpark Electric",
    country: "United States",
    category: "Home Services",
    reason: "Dark hero with amber accent proves home services can feel premium, not cheap.",
    website: "https://example.com",
    gradient: "from-[#3A3018] via-[#282010] to-[#141008]",
  },
  {
    id: "h7",
    company: "ClearAir Systems",
    country: "Netherlands",
    category: "Home Services",
    reason: "Minimal copy and strong headline make a technical service feel approachable.",
    website: "https://example.com",
    gradient: "from-[#1A4858] via-[#123040] to-[#081820]",
  },
  {
    id: "h8",
    company: "Redline Garage Doors",
    country: "United States",
    category: "Home Services",
    reason: "Trust row and review snippets are woven into layout, not stacked as widgets.",
    website: "https://example.com",
    gradient: "from-[#4A2020] via-[#301818] to-[#180C0C]",
  },
  {
    id: "g1",
    company: "Linear",
    country: "United States",
    category: "General Web Design",
    reason: "Dark UI, subtle borders, and typographic hierarchy set the bar for SaaS polish.",
    website: "https://linear.app",
    gradient: "from-[#2A2A38] via-[#1A1A24] to-[#0A0A10]",
  },
  {
    id: "g2",
    company: "Stripe",
    country: "United States",
    category: "General Web Design",
    reason: "Gradient restraint and motion discipline show how to feel premium at scale.",
    website: "https://stripe.com",
    gradient: "from-[#1A2858] via-[#101838] to-[#080C18]",
  },
  {
    id: "g3",
    company: "Vercel",
    country: "United States",
    category: "General Web Design",
    reason: "High-contrast dark theme with crisp CTAs is a masterclass in developer-brand design.",
    website: "https://vercel.com",
    gradient: "from-[#1A1A1A] via-[#101010] to-[#050505]",
  },
  {
    id: "g4",
    company: "Apple",
    country: "United States",
    category: "General Web Design",
    reason: "Product-first layouts prove that one focal point beats ten competing messages.",
    website: "https://apple.com",
    gradient: "from-[#2A2A2A] via-[#181818] to-[#080808]",
  },
  {
    id: "g5",
    company: "Ramp",
    country: "United States",
    category: "General Web Design",
    reason: "Financial SaaS copy and UI spacing feel confident without being loud.",
    website: "https://ramp.com",
    gradient: "from-[#1A3828] via-[#102818] to-[#081410]",
  },
  {
    id: "g6",
    company: "Arc Browser",
    country: "United States",
    category: "General Web Design",
    reason: "Playful color accents on dark backgrounds show personality without losing polish.",
    website: "https://arc.net",
    gradient: "from-[#3A2048] via-[#281830] to-[#140C18]",
  },
  {
    id: "g7",
    company: "Framer",
    country: "Netherlands",
    category: "General Web Design",
    reason: "Marketing site feels like the product — cohesive, animated, and conversion-aware.",
    website: "https://framer.com",
    gradient: "from-[#2A2040] via-[#1A1430] to-[#0C0818]",
  },
  {
    id: "g8",
    company: "Notion",
    country: "United States",
    category: "General Web Design",
    reason: "Friendly illustration balanced with clean type makes complex software feel simple.",
    website: "https://notion.so",
    gradient: "from-[#2A2A2A] via-[#1A1A1A] to-[#0A0A0A]",
  },
];
