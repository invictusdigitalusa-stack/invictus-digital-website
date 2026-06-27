import { createSupabaseClient } from "./client";
import { proposalInvestments } from "./constants";
import { findLeadId, mapBusinessProfileToLeadUpdate } from "./matching";
import type {
  AuditSaveInput,
  AuditSaveResult,
  LeadOutreachRow,
  LeadRow,
  OutreachSaveInput,
  ProposalSaveInput,
  SaveLeadResult,
  UpdateLeadStatusInput,
} from "./types";

const LEAD_LIST_SELECT =
  "id, company, website, industry, status, priority, overall_score, last_audit_at, last_outreach_at, proposal_package, business_summary, priority_focus, recommended_package, conversion_potential, revenue_potential, closing_probability, urgency, competition, estimated_lifetime_value, next_best_action, reasoning";

const LEAD_OUTREACH_SELECT = `${LEAD_LIST_SELECT}, top_improvement, company_tone, target_audience, main_services, unique_selling_points, competitive_advantages, brand_positioning, trust_signals, biggest_weaknesses, biggest_opportunities, recommended_offer, estimated_business_size, seo_maturity, conversion_maturity, ai_visibility_maturity, ai_executive_summary, ai_strengths, ai_weaknesses, ai_prioritized_actions, ai_conversion_recommendations, ai_local_seo_recommendations`;

export async function fetchLeads(): Promise<LeadRow[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_LIST_SELECT)
    .order("company", { ascending: true });

  if (error) {
    console.error("Failed to fetch leads:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchLeadOutreachContext(
  companyName: string,
  websiteUrl: string
): Promise<LeadOutreachRow | null> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return null;
  }

  try {
    const leadId = await findLeadId(supabase, companyName, websiteUrl);

    if (!leadId) {
      return null;
    }

    const { data, error } = await supabase
      .from("leads")
      .select(LEAD_OUTREACH_SELECT)
      .eq("id", leadId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch lead outreach context:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch lead outreach context:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function saveAuditToLead({
  companyName,
  websiteUrl,
  insights,
  businessProfile,
  ...audit
}: AuditSaveInput): Promise<AuditSaveResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const leadId = await findLeadId(supabase, companyName, websiteUrl);

    if (!leadId) {
      return { success: false, error: "No matching lead found in CRM." };
    }

    const { error } = await supabase
      .from("leads")
      .update({
        overall_score: audit.overall_score,
        design_score: audit.design_score,
        mobile_score: audit.mobile_score,
        speed_score: audit.speed_score,
        seo_score: audit.seo_score,
        google_business_score: audit.google_business_score,
        cta_score: audit.cta_score,
        trust_score: audit.trust_score,
        ai_visibility_score: audit.ai_visibility_score,
        top_improvement: audit.top_improvement,
        audit_summary: audit.audit_summary,
        audit_title: audit.audit_title,
        audit_meta_description: audit.audit_meta_description,
        audit_h1: audit.audit_h1,
        audit_h2_count: audit.audit_h2_count,
        audit_images_without_alt: audit.audit_images_without_alt,
        audit_has_cta: audit.audit_has_cta,
        audit_has_phone: audit.audit_has_phone,
        audit_has_email: audit.audit_has_email,
        audit_has_google_maps: audit.audit_has_google_maps,
        audit_has_faq: audit.audit_has_faq,
        audit_has_testimonials: audit.audit_has_testimonials,
        audit_has_ssl: audit.audit_has_ssl,
        audit_has_viewport: audit.audit_has_viewport,
        audit_has_schema: audit.audit_has_schema,
        audit_has_open_graph: audit.audit_has_open_graph,
        audit_has_favicon: audit.audit_has_favicon,
        ...(insights
          ? {
              ai_executive_summary: insights.executiveSummary,
              ai_strengths: insights.strengths,
              ai_weaknesses: insights.weaknesses,
              ai_seo_recommendations: insights.seoRecommendations,
              ai_conversion_recommendations: insights.conversionRecommendations,
              ai_local_seo_recommendations: insights.localSeoRecommendations,
              ai_visibility_recommendations: insights.aiVisibilityRecommendations,
              ai_prioritized_actions: insights.prioritizedActions,
            }
          : {}),
        ...(businessProfile
          ? mapBusinessProfileToLeadUpdate(businessProfile)
          : {}),
        status: "Reviewed",
        last_audit_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save audit.",
    };
  }
}

export async function saveOutreachToLead({
  companyName,
  websiteUrl,
}: OutreachSaveInput): Promise<SaveLeadResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const leadId = await findLeadId(supabase, companyName, websiteUrl);

    if (!leadId) {
      return { success: false, error: "No matching lead found in CRM." };
    }

    const { error } = await supabase
      .from("leads")
      .update({
        status: "Contacted",
        last_outreach_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save outreach.",
    };
  }
}

export async function saveProposalToLead({
  companyName,
  websiteUrl,
  proposalPackage,
  proposalTimeline,
  proposalPaymentTerms,
}: ProposalSaveInput): Promise<SaveLeadResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const leadId = await findLeadId(supabase, companyName, websiteUrl);

    if (!leadId) {
      return { success: false, error: "No matching lead found in CRM." };
    }

    const investment = proposalInvestments[proposalPackage] ?? null;

    const { error } = await supabase
      .from("leads")
      .update({
        status: "Proposal Sent",
        proposal_package: proposalPackage,
        proposal_timeline: proposalTimeline,
        proposal_payment_terms: proposalPaymentTerms,
        proposal_investment: investment,
        proposal_sent_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save proposal.",
    };
  }
}

export async function updateLeadStatus({
  leadId,
  companyName = "",
  websiteUrl = "",
  status,
}: UpdateLeadStatusInput): Promise<SaveLeadResult> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    let resolvedLeadId = leadId?.trim() || null;

    if (!resolvedLeadId) {
      resolvedLeadId = await findLeadId(supabase, companyName, websiteUrl);
    }

    if (!resolvedLeadId) {
      return { success: false, error: "No matching lead found in CRM." };
    }

    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", resolvedLeadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update lead status.",
    };
  }
}
