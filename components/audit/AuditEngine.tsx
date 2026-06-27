"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  buildImprovementSuggestions,
  type AuditAnalysisResult,
} from "@/lib/audit";
import type { AuditInsights } from "@/lib/aiAudit";
import type { BusinessProfile } from "@/lib/businessProfileTypes";
import { saveAuditToLead } from "@/lib/supabase";
import { AuditActions, buildOutreachUrl } from "./AuditActions";
import { AuditForm, parseIndustry, type AuditFormValues } from "./AuditForm";
import { AuditInsightsPanel } from "./AuditInsights";
import { scoreCategories } from "./data";
import { ScoreDashboard } from "./ScoreDashboard";
import { TopImprovements } from "./TopImprovements";

type AuditResult = AuditFormValues &
  AuditAnalysisResult & {
    auditDate: string;
  };

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/[0.06] py-4 last:border-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

type AuditEngineProps = {
  initialCompany?: string;
  initialWebsite?: string;
  initialIndustry?: string;
};

export function AuditEngine({
  initialCompany = "",
  initialWebsite = "",
  initialIndustry,
}: AuditEngineProps = {}) {
  const router = useRouter();
  const [form, setForm] = useState<AuditFormValues>({
    companyName: initialCompany,
    websiteUrl: initialWebsite,
    industry: parseIndustry(initialIndustry),
  });
  const [result, setResult] = useState<AuditResult | null>(null);
  const [insights, setInsights] = useState<AuditInsights | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(
    null
  );
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [analyzeMessage, setAnalyzeMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();

    if (!form.companyName.trim() || !form.websiteUrl.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeMessage(null);
    setSaveMessage(null);
    setInsights(null);
    setBusinessProfile(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: form.companyName.trim(),
          website: form.websiteUrl.trim(),
          industry: form.industry,
        }),
      });

      const data = (await response.json()) as AuditAnalysisResult & {
        error?: string;
      };

      if (!response.ok) {
        setAnalyzeMessage(data.error ?? "Failed to analyze website.");
        return;
      }

      const auditInsightsResponse = await fetch("/api/audit/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const auditInsights = (await auditInsightsResponse.json()) as AuditInsights & {
        error?: string;
      };

      if (!auditInsightsResponse.ok) {
        setAnalyzeMessage(
          auditInsights.error ?? "Failed to generate audit insights."
        );
        return;
      }

      const businessProfileResponse = await fetch("/api/business-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audit: data, insights: auditInsights }),
      });

      const profile = (await businessProfileResponse.json()) as BusinessProfile & {
        error?: string;
      };

      if (!businessProfileResponse.ok) {
        setAnalyzeMessage(
          profile.error ?? "Failed to generate business profile."
        );
        return;
      }

      setInsights(auditInsights);
      setBusinessProfile(profile);
      setResult({
        ...form,
        companyName: form.companyName.trim(),
        websiteUrl: form.websiteUrl.trim(),
        auditDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        ...data,
      });
    } catch {
      setAnalyzeMessage("Failed to analyze website.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleGenerateColdEmail() {
    if (!result) return;
    router.push(buildOutreachUrl(result));
  }

  async function handleSaveToCRM() {
    if (!result) return;

    setIsSaving(true);
    setSaveMessage(null);

    const response = await saveAuditToLead({
      companyName: result.companyName,
      websiteUrl: result.websiteUrl,
      overall_score: result.overall_score,
      design_score: result.design_score,
      mobile_score: result.mobile_score,
      speed_score: result.speed_score,
      seo_score: result.seo_score,
      google_business_score: result.google_business_score,
      cta_score: result.cta_score,
      trust_score: result.trust_score,
      ai_visibility_score: result.ai_visibility_score,
      top_improvement: result.top_improvement,
      audit_summary: result.audit_summary,
      audit_title: result.audit_title,
      audit_meta_description: result.audit_meta_description,
      audit_h1: result.audit_h1,
      audit_h2_count: result.audit_h2_count,
      audit_images_without_alt: result.audit_images_without_alt,
      audit_has_cta: result.audit_has_cta,
      audit_has_phone: result.audit_has_phone,
      audit_has_email: result.audit_has_email,
      audit_has_google_maps: result.audit_has_google_maps,
      audit_has_faq: result.audit_has_faq,
      audit_has_testimonials: result.audit_has_testimonials,
      audit_has_ssl: result.audit_has_ssl,
      audit_has_viewport: result.audit_has_viewport,
      audit_has_schema: result.audit_has_schema,
      audit_has_open_graph: result.audit_has_open_graph,
      audit_has_favicon: result.audit_has_favicon,
      insights: insights ?? undefined,
      businessProfile: businessProfile ?? undefined,
    });

    setIsSaving(false);

    if (response.success) {
      setSaveMessage({ type: "success", text: "Audit saved to CRM." });
      return;
    }

    setSaveMessage({
      type: "error",
      text: response.error ?? "Failed to save audit.",
    });
  }

  const improvements = result ? buildImprovementSuggestions(result) : [];
  const scoreBreakdown = result
    ? scoreCategories.map((item) => ({
        label: item.label,
        score: result[item.key],
        max: item.max,
      }))
    : [];

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Tool
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Invictus Audit Engine
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Analyze local business websites in minutes.
        </p>
      </div>

      <AuditForm
        form={form}
        onFormChange={setForm}
        isAnalyzing={isAnalyzing}
        analyzeMessage={analyzeMessage}
        onSubmit={handleAnalyze}
      />

      {result ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] xl:gap-10">
          <div className="space-y-8">
            <ScoreDashboard
              overallScore={result.overall_score}
              scoreBreakdown={scoreBreakdown}
            />

            <TopImprovements improvements={improvements} />

            {insights ? <AuditInsightsPanel insights={insights} /> : null}

            <AuditActions
              isSaving={isSaving}
              saveMessage={saveMessage}
              onGenerateColdEmail={handleGenerateColdEmail}
              onSaveToCRM={handleSaveToCRM}
            />
          </div>

          <aside>
            <Card className="sticky top-24 overflow-hidden p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
                Audit Summary
              </p>
              <h2 className="mt-4 text-xl font-semibold text-white">
                {result.companyName}
              </h2>

              <div className="mt-6">
                <SummaryRow label="Company" value={result.companyName} />
                <SummaryRow label="Website" value={result.websiteUrl} />
                <SummaryRow label="Industry" value={result.industry} />
                <SummaryRow label="Audit Date" value={result.auditDate} />
                <SummaryRow label="Status" value="Ready for Outreach" />
              </div>

              <div className="mt-6 rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[#22C55E]">
                  Outreach Ready
                </p>
                <p className="mt-2 text-sm leading-7 text-emerald-100/80">
                  {result.audit_summary}
                </p>
              </div>
            </Card>
          </aside>
        </div>
      ) : null}
    </Container>
  );
}
