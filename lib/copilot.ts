import "server-only";

import {
  formatLeadName,
  generateOutreachAction,
  normalizeCopilotActions,
  openAuditAction,
  openCrmAction,
  openDeliveryAction,
  textAction,
  viewLeadAction,
  type CopilotAction,
  type CopilotResponse,
} from "./copilotActions";
import type { CopilotContext, CopilotLeadSummary } from "./copilotContext";
import { createJsonCompletion } from "./openai/jsonCompletion";
import { normalizeString } from "./utils/normalize";

export type { CopilotAction, CopilotResponse } from "./copilotActions";

type GptCopilotResponse = {
  answer?: string;
  suggestedActions?: unknown;
};

function formatLeadLine(lead: CopilotLeadSummary) {
  const parts = [
    formatLeadName(lead),
    lead.status ? `status ${lead.status}` : null,
    lead.overallScore !== null ? `audit ${lead.overallScore}` : null,
    lead.closingProbability !== null
      ? `closing ${lead.closingProbability}%`
      : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function formatProjectName(project: { company: string | null; website: string | null }) {
  return project.company?.trim() || project.website?.trim() || "Unnamed project";
}

function buildTodayActions(context: CopilotContext): CopilotAction[] {
  const actions: CopilotAction[] = [];

  if (context.insights.contactFirstLeads.length > 0) {
    actions.push(
      generateOutreachAction(
        context.insights.contactFirstLeads[0],
        `Contact ${formatLeadName(context.insights.contactFirstLeads[0])} first`
      )
    );
  }

  if (context.insights.weakAuditLeads.length > 0) {
    actions.push(
      openAuditAction(
        context.insights.weakAuditLeads[0],
        `Re-audit ${formatLeadName(context.insights.weakAuditLeads[0])}`
      )
    );
  }

  if (context.insights.openProposals.length > 0) {
    actions.push(
      viewLeadAction(
        context.insights.openProposals[0],
        `Follow up on ${formatLeadName(context.insights.openProposals[0])}'s proposal`
      )
    );
  }

  if (context.insights.activeProjects.length > 0) {
    actions.push(
      openDeliveryAction(
        `Check delivery for ${formatProjectName(context.insights.activeProjects[0])}`
      )
    );
  }

  if (context.queueStatus.pendingCount > 0) {
    actions.push(openCrmAction("Review the AI agent queue in CRM"));
  }

  if (actions.length === 0) {
    actions.push(
      openCrmAction("Open CRM and audit new leads"),
      textAction("Prioritize leads with websites and complete company data.")
    );
  }

  return actions.slice(0, 5);
}

export function generateDeterministicCopilotAnswer(
  question: string,
  context: CopilotContext
): CopilotResponse {
  const normalizedQuestion = question.trim().toLowerCase();

  if (includesAny(normalizedQuestion, ["best lead", "top lead", "strongest lead"])) {
    const leads = context.insights.bestLeads;

    if (leads.length === 0) {
      return {
        answer:
          "There are no scored leads yet. Run audits on new CRM leads to identify your best opportunities.",
        suggestedActions: [
          openCrmAction("Open CRM and audit new leads"),
          textAction("Prioritize leads with websites and complete company data."),
        ],
      };
    }

    return {
      answer: `Your best leads right now are ${leads.map(formatLeadLine).join("; ")}.`,
      suggestedActions: leads.slice(0, 3).map((lead) =>
        lead.nextBestAction?.trim()
          ? viewLeadAction(lead, lead.nextBestAction)
          : viewLeadAction(lead)
      ),
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "contact first",
      "reach out first",
      "follow up first",
      "who should i contact",
    ])
  ) {
    const leads = context.insights.contactFirstLeads;

    if (leads.length === 0) {
      return {
        answer:
          "No urgent outreach targets stand out. Focus on reviewed leads that have not been contacted yet.",
        suggestedActions: [
          openCrmAction("Open CRM and review untouched leads"),
          textAction("Generate outreach for one high-score lead."),
        ],
      };
    }

    return {
      answer: `Contact these leads first: ${leads.map(formatLeadLine).join("; ")}.`,
      suggestedActions: leads.slice(0, 3).map((lead) =>
        generateOutreachAction(
          lead,
          `Send outreach to ${formatLeadName(lead)}${lead.status ? ` (${lead.status})` : ""}`
        )
      ),
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "active project",
      "projects are active",
      "delivery",
    ])
  ) {
    const projects = context.insights.activeProjects;

    if (projects.length === 0) {
      return {
        answer: "There are no active delivery projects right now.",
        suggestedActions: [
          openCrmAction("Review CRM for leads ready to close"),
          textAction("Move a won lead into delivery."),
        ],
      };
    }

    return {
      answer: `You have ${projects.length} active project${projects.length === 1 ? "" : "s"}: ${projects
        .map(
          (project) =>
            `${formatProjectName(project)} · ${project.status ?? "In progress"} · ${project.progress ?? 0}%`
        )
        .join("; ")}.`,
      suggestedActions: [
        openDeliveryAction("Open Delivery dashboard"),
        ...projects.slice(0, 2).map((project) =>
          openDeliveryAction(`Update ${formatProjectName(project)}`)
        ),
      ].slice(0, 3),
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "proposal",
      "open proposal",
      "proposals are open",
    ])
  ) {
    const proposals = context.insights.openProposals;

    if (proposals.length === 0) {
      return {
        answer: "There are no open proposals in the pipeline right now.",
        suggestedActions: [
          openCrmAction("Open CRM and review warm leads"),
          textAction("Generate outreach for reviewed leads before proposing."),
        ],
      };
    }

    return {
      answer: `Open proposals: ${proposals.map(formatLeadLine).join("; ")}.`,
      suggestedActions: proposals.slice(0, 3).map((lead) =>
        viewLeadAction(
          lead,
          `Follow up with ${formatLeadName(lead)} on the pending proposal`
        )
      ),
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "what should i do today",
      "do today",
      "today focus",
      "priorities today",
    ])
  ) {
    const actions = buildTodayActions(context);

    return {
      answer: `Today, focus on ${actions[0].label.replace(/\.$/, "")}. Pipeline snapshot: ${context.stats.totalLeads} leads, ${context.stats.proposalSent} proposals out, ${context.insights.activeProjects.length} active projects, and ${context.queueStatus.pendingCount} queued AI runs.`,
      suggestedActions: actions,
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "weak audit",
      "low audit",
      "bad audit",
      "poor audit",
    ])
  ) {
    const leads = context.insights.weakAuditLeads;

    if (leads.length === 0) {
      return {
        answer:
          "No leads currently have weak audit scores below 60, or audits have not been run yet.",
        suggestedActions: [
          openCrmAction("Open CRM and audit new leads"),
          textAction("Re-run audits for older leads with stale scores."),
        ],
      };
    }

    return {
      answer: `Leads with weak audit scores: ${leads.map(formatLeadLine).join("; ")}.`,
      suggestedActions: leads.slice(0, 3).flatMap((lead) => [
        openAuditAction(
          lead,
          `Re-audit ${formatLeadName(lead)}`
        ),
        generateOutreachAction(
          lead,
          `Tailor outreach for ${formatLeadName(lead)}`
        ),
      ]).slice(0, 5),
    };
  }

  if (
    includesAny(normalizedQuestion, [
      "closest to closing",
      "close soon",
      "likely to close",
      "near closing",
    ])
  ) {
    const leads = context.insights.closestToClosing;

    if (leads.length === 0) {
      return {
        answer:
          "No late-stage leads are standing out yet. Focus on moving contacted leads into meetings and proposals.",
        suggestedActions: [
          openCrmAction("Open CRM and review warm leads"),
          textAction("Send proposals to reviewed leads with strong audit scores."),
        ],
      };
    }

    return {
      answer: `Leads closest to closing: ${leads.map(formatLeadLine).join("; ")}.`,
      suggestedActions: leads.slice(0, 3).map((lead) =>
        lead.nextBestAction?.trim()
          ? viewLeadAction(lead, lead.nextBestAction)
          : viewLeadAction(
              lead,
              `Schedule the next sales step for ${formatLeadName(lead)}`
            )
      ),
    };
  }

  return {
    answer: `Invictus OS snapshot: ${context.stats.totalLeads} leads, ${context.stats.contactedLeads} contacted, ${context.stats.proposalSent} proposals sent, ${context.insights.activeProjects.length} active projects, average audit score ${Math.round(context.stats.averageAuditScore)}, and pipeline value $${context.stats.pipelineValue.toLocaleString()}.`,
    suggestedActions: buildTodayActions(context),
  };
}

async function generateGptCopilotAnswer(
  question: string,
  context: CopilotContext
): Promise<CopilotResponse | null> {
  const parsed = await createJsonCompletion<GptCopilotResponse>({
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are Invictus OS Copilot, a read-only internal advisor for a web agency operating system. Answer only from the provided business context JSON. Never invent leads, projects, statuses, or metrics that are not in the data. You cannot update CRM records, send emails, mark leads won, delete records, or create projects directly. Provide practical, concise guidance in plain English. Return strict JSON only with keys answer and suggestedActions. answer must be 2-5 sentences. suggestedActions must be an array of 2-5 objects. Each object must include label and type. Supported type values only: open_crm, open_audit, open_delivery, run_ai_queue, generate_outreach, view_lead. Include leadId and company only when they match a lead in the provided context. Use open_crm, open_delivery, view_lead, and open_audit for navigation. Use run_ai_queue and generate_outreach only when a specific leadId is available. Do not suggest unsupported operations.",
      },
      {
        role: "user",
        content: `Question: ${question.trim()}\n\nBusiness context:\n${JSON.stringify(context, null, 2)}`,
      },
    ],
  });

  if (!parsed) {
    return null;
  }

  const answer = normalizeString(parsed.answer);
  const suggestedActions = normalizeCopilotActions(
    parsed.suggestedActions,
    context
  );

  if (!answer) {
    return null;
  }

  return {
    answer,
    suggestedActions:
      suggestedActions.length > 0
        ? suggestedActions
        : generateDeterministicCopilotAnswer(question, context).suggestedActions,
  };
}

export async function askCopilot(
  question: string,
  context: CopilotContext
): Promise<CopilotResponse> {
  const fallback = generateDeterministicCopilotAnswer(question, context);
  const gptAnswer = await generateGptCopilotAnswer(question, context);

  return gptAnswer ?? fallback;
}
