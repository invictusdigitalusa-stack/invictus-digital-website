export const packageInvestments: Record<string, number> = {
  Starter: 2500,
  Growth: 4500,
  Authority: 7500,
};

export function formatProjectDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatProjectPackage(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const investment = packageInvestments[value];

  if (investment) {
    return `${value} — $${investment.toLocaleString()}`;
  }

  return value;
}

export function displayProjectValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export const pipelineStages = [
  {
    id: 1,
    title: "Lead Won",
    status: "Complete",
    completion: 100,
    date: "Mar 1, 2026",
    assigned: "Douglas",
  },
  {
    id: 2,
    title: "Invoice Sent",
    status: "Complete",
    completion: 100,
    date: "Mar 2, 2026",
    assigned: "Douglas",
  },
  {
    id: 3,
    title: "Discovery Call",
    status: "Complete",
    completion: 100,
    date: "Mar 5, 2026",
    assigned: "Douglas",
  },
  {
    id: 4,
    title: "Content Received",
    status: "In Progress",
    completion: 65,
    date: "Mar 18, 2026",
    assigned: "Client",
  },
  {
    id: 5,
    title: "Design",
    status: "Pending",
    completion: 0,
    date: "Mar 22, 2026",
    assigned: "Douglas",
  },
  {
    id: 6,
    title: "Development",
    status: "Pending",
    completion: 0,
    date: "Apr 2, 2026",
    assigned: "Douglas",
  },
  {
    id: 7,
    title: "Review",
    status: "Pending",
    completion: 0,
    date: "Apr 12, 2026",
    assigned: "Client",
  },
  {
    id: 8,
    title: "Launch",
    status: "Pending",
    completion: 0,
    date: "Apr 18, 2026",
    assigned: "Douglas",
  },
];

export const initialTasks = [
  { id: "logo", label: "Receive logo", done: true },
  { id: "images", label: "Receive images", done: true },
  { id: "text", label: "Receive text", done: false },
  { id: "domain", label: "Connect domain", done: false },
  { id: "seo", label: "SEO setup", done: false },
  { id: "analytics", label: "Analytics", done: false },
  { id: "gbp", label: "Google Business", done: false },
  { id: "perf", label: "Performance test", done: false },
  { id: "mobile", label: "Mobile QA", done: false },
  { id: "launch", label: "Launch", done: false },
];

export const projectAssetTypes = [
  { id: "logo", name: "Logo", bucket: "logos" },
  { id: "images", name: "Images", bucket: "images" },
  { id: "brand-guide", name: "Brand Guide", bucket: "brand-guides" },
  { id: "content", name: "Content", bucket: "content" },
  { id: "contracts", name: "Contracts", bucket: "contracts" },
] as const;

export type ProjectAssetType = (typeof projectAssetTypes)[number];

export const launchChecklist = [
  { id: "ssl", label: "SSL" },
  { id: "forms", label: "Forms" },
  { id: "speed", label: "Speed" },
  { id: "seo", label: "SEO" },
  { id: "analytics", label: "Analytics" },
  { id: "mobile", label: "Mobile" },
  { id: "404", label: "404" },
  { id: "favicon", label: "Favicon" },
];

export function statusColor(status: string) {
  if (status === "Complete" || status === "Signed" || status === "Uploaded") {
    return "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]";
  }
  if (status === "In Progress" || status === "In Review" || status === "Partial") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
  return "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";
}
