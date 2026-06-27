import type { LeadRow } from "@/lib/supabase";

export type Lead = LeadRow;

export type LeadStatus = string;

export type Industry = string;

export const statusStyles: Record<string, string> = {
  "New Lead": "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  Contacted: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Replied: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "Meeting Booked": "border-violet-500/30 bg-violet-500/10 text-violet-300",
  "Proposal Sent": "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Won: "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]",
  Lost: "border-red-500/30 bg-red-500/10 text-red-300",
};

export const defaultStatusStyle =
  "border-white/[0.08] bg-white/[0.04] text-zinc-300";

export const allStatuses = [
  "New Lead",
  "Contacted",
  "Replied",
  "Meeting Booked",
  "Proposal Sent",
  "Won",
  "Lost",
];

export const allIndustries = [
  "Landscaping",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Painting",
  "Concrete",
];

export function getStatusStyle(status: string | null) {
  if (!status) return defaultStatusStyle;
  return statusStyles[status] ?? defaultStatusStyle;
}

export function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
}

export function formatLeadDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const formatLastAuditDate = formatLeadDate;
export const formatLastOutreachDate = formatLeadDate;
