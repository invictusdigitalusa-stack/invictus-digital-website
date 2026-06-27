import "server-only";

import type { AuditAnalysisResult } from "../audit";
import type { AuditInsights } from "../aiAudit";
import type { BusinessProfile } from "../businessProfileTypes";
import type { LeadIntelligence } from "../leadIntelligence";
import { buildOutreachContextFromInput } from "../outreachContext";
import { createSupabaseClient } from "../supabase";
import type { PipelineLead } from "./types";

export async function fetchLeadById(leadId: string): Promise<PipelineLead> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id, company, website, industry")
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Lead not found.");
  }

  return data;
}

export function buildOutreachContext(
  audit: AuditAnalysisResult,
  insights: AuditInsights | undefined,
  businessProfile: BusinessProfile | undefined,
  leadIntelligence: LeadIntelligence | undefined,
  companyName: string,
  industry: string
) {
  if (insights && businessProfile && leadIntelligence) {
    return { audit, insights, businessProfile, leadIntelligence };
  }

  const fallback = buildOutreachContextFromInput(
    {
      companyName,
      industry,
      topImprovement: audit.top_improvement,
      tone: "Professional",
      idealPackage: leadIntelligence?.idealPackage ?? businessProfile?.recommendedPackage,
    },
    audit.audit_summary
  );

  return {
    audit,
    insights: insights ?? fallback.insights,
    businessProfile: businessProfile ?? fallback.businessProfile,
    leadIntelligence: leadIntelligence ?? fallback.leadIntelligence,
  };
}
