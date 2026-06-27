import type { CopilotContext, CopilotLeadSummary } from "./copilotContext";
import { normalizeString } from "./utils/normalize";

export type CopilotActionType =
  | "open_crm"
  | "open_audit"
  | "open_delivery"
  | "run_ai_queue"
  | "generate_outreach"
  | "view_lead";

export type CopilotAction = {
  label: string;
  type: CopilotActionType | "text";
  leadId?: string;
  company?: string;
};

export type CopilotResponse = {
  answer: string;
  suggestedActions: CopilotAction[];
};

const SUPPORTED_ACTION_TYPES: CopilotActionType[] = [
  "open_crm",
  "open_audit",
  "open_delivery",
  "run_ai_queue",
  "generate_outreach",
  "view_lead",
];

function leadExists(context: CopilotContext, leadId: string) {
  return context.leads.some((lead) => lead.id === leadId);
}

export function textAction(label: string): CopilotAction {
  return { label, type: "text" };
}

export function openCrmAction(label: string): CopilotAction {
  return { label, type: "open_crm" };
}

export function openDeliveryAction(label: string): CopilotAction {
  return { label, type: "open_delivery" };
}

export function viewLeadAction(
  lead: CopilotLeadSummary,
  label?: string
): CopilotAction {
  return {
    label: label ?? `View ${formatLeadName(lead)} in CRM`,
    type: "view_lead",
    leadId: lead.id,
    company: lead.company ?? undefined,
  };
}

export function openAuditAction(
  lead: CopilotLeadSummary,
  label?: string
): CopilotAction {
  return {
    label: label ?? `Open audit for ${formatLeadName(lead)}`,
    type: "open_audit",
    leadId: lead.id,
    company: lead.company ?? undefined,
  };
}

export function generateOutreachAction(
  lead: CopilotLeadSummary,
  label?: string
): CopilotAction {
  return {
    label: label ?? `Generate outreach for ${formatLeadName(lead)}`,
    type: "generate_outreach",
    leadId: lead.id,
    company: lead.company ?? undefined,
  };
}

export function runAiQueueAction(
  lead: CopilotLeadSummary,
  label?: string
): CopilotAction {
  return {
    label: label ?? `Run AI pipeline for ${formatLeadName(lead)}`,
    type: "run_ai_queue",
    leadId: lead.id,
    company: lead.company ?? undefined,
  };
}

export function formatLeadName(lead: Pick<CopilotLeadSummary, "company" | "website">) {
  return lead.company?.trim() || lead.website?.trim() || "Unnamed lead";
}

export function normalizeCopilotAction(
  raw: unknown,
  context: CopilotContext
): CopilotAction {
  if (typeof raw === "string") {
    const label = raw.trim();
    return label ? textAction(label) : textAction("Review your pipeline in CRM.");
  }

  if (!raw || typeof raw !== "object") {
    return textAction("Review your pipeline in CRM.");
  }

  const entry = raw as Record<string, unknown>;
  const label = normalizeString(entry.label);

  if (!label) {
    return textAction("Review your pipeline in CRM.");
  }

  const type = normalizeString(entry.type) as CopilotActionType | "text";

  if (type === "text") {
    return textAction(label);
  }

  if (!SUPPORTED_ACTION_TYPES.includes(type)) {
    return textAction(label);
  }

  const leadId = normalizeString(entry.leadId);
  const company = normalizeString(entry.company);

  if (leadId && !leadExists(context, leadId)) {
    return textAction(label);
  }

  if (
    (type === "run_ai_queue" || type === "generate_outreach") &&
    !leadId
  ) {
    return textAction(label);
  }

  return {
    label,
    type,
    ...(leadId ? { leadId } : {}),
    ...(company ? { company } : {}),
  };
}

export function normalizeCopilotActions(
  value: unknown,
  context: CopilotContext
): CopilotAction[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => normalizeCopilotAction(entry, context))
    .filter((entry) => entry.label.length > 0)
    .slice(0, 5);
}

export function isClickableCopilotAction(action: CopilotAction) {
  return action.type !== "text";
}

export function requiresCopilotConfirmation(action: CopilotAction) {
  return action.type === "run_ai_queue" || action.type === "generate_outreach";
}
