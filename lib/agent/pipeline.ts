import "server-only";

import { generateAuditInsights } from "../aiAudit";
import { analyzeWebsite } from "../audit";
import { generateBusinessProfile } from "../businessProfile";
import { generateLeadIntelligence } from "../leadIntelligence";
import { generateOutreachEmail } from "../outreachAI";
import {
  finalizePipelineActivity,
  logPipelineActivity,
  recordError,
} from "./logging";
import { savePipelineToCrm } from "./saveResults";
import { buildOutreachContext, fetchLeadById } from "./steps";
import type { LeadPipelineResult } from "./types";

export type { LeadPipelineResult, LeadPipelineStep } from "./types";

export async function runLeadPipeline(
  leadId: string
): Promise<LeadPipelineResult> {
  const completedSteps: LeadPipelineResult["completedSteps"] = [];
  const errors: string[] = [];
  let audit: LeadPipelineResult["audit"];
  let insights: LeadPipelineResult["insights"];
  let businessProfile: LeadPipelineResult["businessProfile"];
  let leadIntelligence: LeadPipelineResult["leadIntelligence"];
  let outreach: LeadPipelineResult["outreach"];

  let lead;

  try {
    lead = await fetchLeadById(leadId);
    completedSteps.push("loadLead");
    await logPipelineActivity(leadId, "lead_loaded", "success");
  } catch (error) {
    recordError(errors, "loadLead", error);
    await logPipelineActivity(
      leadId,
      "pipeline_failed",
      "error",
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      completedSteps,
      errors,
      audit,
      insights,
      businessProfile,
      leadIntelligence,
      outreach,
    };
  }

  const companyName = lead.company?.trim() ?? "";
  const websiteUrl = lead.website?.trim() ?? "";
  const industry = lead.industry?.trim() || "Landscaping";

  if (!websiteUrl) {
    const message = "Lead does not have a website URL.";
    errors.push(`audit: ${message}`);
    await logPipelineActivity(leadId, "pipeline_failed", "error", message);
    return {
      success: false,
      completedSteps,
      errors,
      audit,
      insights,
      businessProfile,
      leadIntelligence,
      outreach,
    };
  }

  await logPipelineActivity(
    leadId,
    "website_audit_started",
    "running",
    websiteUrl
  );

  try {
    audit = await analyzeWebsite(websiteUrl);
    completedSteps.push("audit");
    await logPipelineActivity(
      leadId,
      "website_audit_completed",
      "success",
      `Overall score ${audit.overall_score}/100`
    );
  } catch (error) {
    recordError(errors, "audit", error);
    await logPipelineActivity(
      leadId,
      "pipeline_failed",
      "error",
      error instanceof Error ? error.message : String(error)
    );
    return {
      success: false,
      completedSteps,
      errors,
      audit,
      insights,
      businessProfile,
      leadIntelligence,
      outreach,
    };
  }

  try {
    insights = await generateAuditInsights(audit);
    completedSteps.push("insights");
    await logPipelineActivity(leadId, "audit_insights_generated", "success");
  } catch (error) {
    recordError(errors, "insights", error);
    await logPipelineActivity(
      leadId,
      "audit_insights_generated",
      "error",
      error instanceof Error ? error.message : String(error)
    );
  }

  if (audit && insights) {
    try {
      businessProfile = await generateBusinessProfile(audit, insights);
      completedSteps.push("businessProfile");
      await logPipelineActivity(leadId, "business_profile_generated", "success");
    } catch (error) {
      recordError(errors, "businessProfile", error);
      await logPipelineActivity(
        leadId,
        "business_profile_generated",
        "error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (audit && insights && businessProfile) {
    try {
      leadIntelligence = await generateLeadIntelligence(
        audit,
        insights,
        businessProfile
      );
      completedSteps.push("leadIntelligence");
      await logPipelineActivity(
        leadId,
        "lead_intelligence_generated",
        "success"
      );
    } catch (error) {
      recordError(errors, "leadIntelligence", error);
      await logPipelineActivity(
        leadId,
        "lead_intelligence_generated",
        "error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (audit) {
    try {
      const saveResult = await savePipelineToCrm(
        leadId,
        companyName,
        websiteUrl,
        audit,
        insights,
        businessProfile,
        leadIntelligence
      );

      if (saveResult.success) {
        completedSteps.push("saveToCrm");
        await logPipelineActivity(leadId, "crm_updated", "success");
      } else {
        const message = saveResult.error ?? "Failed to save to CRM.";
        errors.push(`saveToCrm: ${message}`);
        await logPipelineActivity(leadId, "crm_updated", "error", message);
      }
    } catch (error) {
      recordError(errors, "saveToCrm", error);
      await logPipelineActivity(
        leadId,
        "crm_updated",
        "error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (audit) {
    try {
      const outreachContext = buildOutreachContext(
        audit,
        insights,
        businessProfile,
        leadIntelligence,
        companyName || "your company",
        industry
      );

      outreach = await generateOutreachEmail(
        outreachContext.audit,
        outreachContext.insights,
        outreachContext.businessProfile,
        outreachContext.leadIntelligence,
        {
          companyName: companyName || "your company",
          industry,
          topImprovement: audit.top_improvement,
          tone: "Professional",
        }
      );
      completedSteps.push("outreach");
      await logPipelineActivity(leadId, "outreach_generated", "success");
    } catch (error) {
      recordError(errors, "outreach", error);
      await logPipelineActivity(
        leadId,
        "outreach_generated",
        "error",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  await finalizePipelineActivity(leadId, errors, completedSteps);

  return {
    success: errors.length === 0,
    completedSteps,
    errors,
    audit,
    insights,
    businessProfile,
    leadIntelligence,
    outreach,
  };
}
