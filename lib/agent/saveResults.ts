import "server-only";

import type { AuditAnalysisResult } from "../audit";
import type { AuditInsights } from "../aiAudit";
import type { BusinessProfile } from "../businessProfileTypes";
import type { LeadIntelligence } from "../leadIntelligence";
import { createSupabaseClient, saveAuditToLead } from "../supabase";

export function mapLeadIntelligenceToLeadUpdate(intelligence: LeadIntelligence) {
  return {
    conversion_potential: intelligence.conversionPotential,
    revenue_potential: intelligence.revenuePotential,
    closing_probability: intelligence.closingProbability,
    urgency: intelligence.urgency,
    competition: intelligence.competition,
    recommended_package: intelligence.idealPackage,
    estimated_lifetime_value: intelligence.estimatedLifetimeValue,
    next_best_action: intelligence.nextBestAction,
    reasoning: intelligence.reasoning,
  };
}

async function saveLeadIntelligenceById(
  leadId: string,
  leadIntelligence: LeadIntelligence
) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("leads")
    .update(mapLeadIntelligenceToLeadUpdate(leadIntelligence))
    .eq("id", leadId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function savePipelineToCrm(
  leadId: string,
  companyName: string,
  websiteUrl: string,
  audit: AuditAnalysisResult,
  insights?: AuditInsights,
  businessProfile?: BusinessProfile,
  leadIntelligence?: LeadIntelligence
) {
  const saveResult = await saveAuditToLead({
    companyName,
    websiteUrl,
    ...audit,
    insights,
    businessProfile,
  });

  if (!saveResult.success) {
    return saveResult;
  }

  if (leadIntelligence) {
    const intelligenceResult = await saveLeadIntelligenceById(
      leadId,
      leadIntelligence
    );

    if (!intelligenceResult.success) {
      return intelligenceResult;
    }
  }

  return { success: true };
}
