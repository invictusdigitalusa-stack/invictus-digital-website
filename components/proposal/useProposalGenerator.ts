"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/os/useToast";
import type { GeneratedProposal, ProposalLeadStatus } from "@/lib/proposalTypes";
import { saveProposalToLead } from "@/lib/supabase";
import {
  industries,
  packages,
  type Industry,
  type PackageName,
  type ProposalStatus,
} from "./data";

export type ProposalForm = {
  companyName: string;
  contactPerson: string;
  email: string;
  website: string;
  industry: Industry;
  package: PackageName;
  timeline: string;
  paymentTerms: string;
  projectNotes: string;
};

function parseIndustry(value?: string): Industry {
  if (value && industries.includes(value as Industry)) {
    return value as Industry;
  }
  return "Landscaping";
}

function parsePackage(value?: string): PackageName {
  if (value && packages.includes(value as PackageName)) {
    return value as PackageName;
  }
  return "Growth";
}

type UseProposalGeneratorOptions = {
  initialCompany?: string;
  initialWebsite?: string;
  initialIndustry?: string;
  initialPackage?: string;
  initialTimeline?: string;
  initialPaymentTerms?: string;
};

export function useProposalGenerator({
  initialCompany = "",
  initialWebsite = "",
  initialIndustry,
  initialPackage,
  initialTimeline = "4–6 weeks",
  initialPaymentTerms = "50% deposit · 50% at launch",
}: UseProposalGeneratorOptions = {}) {
  const [form, setForm] = useState<ProposalForm>({
    companyName: initialCompany,
    contactPerson: "",
    email: "",
    website: initialWebsite,
    industry: parseIndustry(initialIndustry),
    package: parsePackage(initialPackage),
    timeline: initialTimeline,
    paymentTerms: initialPaymentTerms,
    projectNotes: "",
  });
  const [generated, setGenerated] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunningAi, setIsRunningAi] = useState(false);
  const [missingAiPrompt, setMissingAiPrompt] = useState<{ leadId: string } | null>(
    null
  );
  const [status, setStatus] = useState<ProposalStatus>("Draft");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [sendMessage, setSendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const clientDisplay = form.companyName.trim() || "Client Company";
  const contactDisplay = form.contactPerson.trim() || "Contact Name";

  useEffect(() => {
    setMissingAiPrompt(null);
  }, [form.companyName, form.website]);

  async function handleRunAi() {
    if (!missingAiPrompt?.leadId || isRunningAi) {
      return;
    }

    setIsRunningAi(true);

    try {
      const response = await fetch("/api/agent/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId: missingAiPrompt.leadId }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to queue AI pipeline.");
      }

      showToast({
        title: "AI pipeline queued",
        description: "Run Generate Proposal again after the pipeline completes.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Run AI failed",
        description:
          error instanceof Error ? error.message : "Failed to queue AI pipeline.",
        type: "error",
      });
    } finally {
      setIsRunningAi(false);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName.trim() || isGenerating) return;

    setIsGenerating(true);
    setSendMessage(null);
    setActionMessage(null);
    setMissingAiPrompt(null);

    try {
      const leadResponse = await fetch(
        `/api/proposal/lead?company=${encodeURIComponent(form.companyName.trim())}&website=${encodeURIComponent(form.website.trim())}`
      );

      const leadStatus = (await leadResponse.json()) as ProposalLeadStatus & {
        error?: string;
      };

      if (!leadResponse.ok) {
        throw new Error(leadStatus.error ?? "Failed to load lead from CRM.");
      }

      if (!leadStatus.found) {
        setGenerated(false);
        setGeneratedProposal(null);
        setSendMessage({
          type: "error",
          text: "Lead not found in CRM. Add the lead before generating a proposal.",
        });
        return;
      }

      if (leadStatus.industry && industries.includes(leadStatus.industry as Industry)) {
        setForm((prev) => ({
          ...prev,
          industry: leadStatus.industry as Industry,
        }));
      }

      if (leadStatus.recommendedPackage) {
        setForm((prev) => ({
          ...prev,
          package: leadStatus.recommendedPackage as PackageName,
        }));
      }

      if (!leadStatus.hasAiData) {
        setGenerated(false);
        setGeneratedProposal(null);
        setMissingAiPrompt({ leadId: leadStatus.leadId ?? "" });
        return;
      }

      const response = await fetch("/api/proposal/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: form.companyName,
          website: form.website,
          industry: leadStatus.industry ?? form.industry,
          package: leadStatus.recommendedPackage ?? form.package,
          timeline: form.timeline,
          paymentTerms: form.paymentTerms,
          projectNotes: form.projectNotes,
        }),
      });

      const data = (await response.json()) as GeneratedProposal & {
        error?: string;
        code?: string;
        leadId?: string;
      };

      if (response.status === 409 && data.code === "MISSING_AI_DATA") {
        setGenerated(false);
        setGeneratedProposal(null);
        setMissingAiPrompt({ leadId: data.leadId ?? leadStatus.leadId ?? "" });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate proposal.");
      }

      setGeneratedProposal(data);
      setGenerated(true);
      setStatus("Draft");
      setActionMessage("Proposal generated.");
      setTimeout(() => setActionMessage(null), 2500);
    } catch (error) {
      setGenerated(false);
      setGeneratedProposal(null);
      setSendMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to generate proposal.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function handleExport() {
    if (!generated) return;
    setActionMessage("Export PDF — UI preview only.");
    setTimeout(() => setActionMessage(null), 2500);
  }

  async function handleSend() {
    if (!generated || isSending) return;

    setIsSending(true);
    setSendMessage(null);

    const response = await saveProposalToLead({
      companyName: form.companyName,
      websiteUrl: form.website,
      proposalPackage: form.package,
      proposalTimeline: form.timeline,
      proposalPaymentTerms: form.paymentTerms,
    });

    setIsSending(false);

    if (response.success) {
      setStatus("Sent");
      setSendMessage({ type: "success", text: "Proposal saved to CRM." });
      return;
    }

    setSendMessage({
      type: "error",
      text: response.error ?? "Failed to save proposal.",
    });
  }

  return {
    form,
    setForm,
    generated,
    generatedProposal,
    isGenerating,
    missingAiPrompt,
    isRunningAi,
    status,
    actionMessage,
    sendMessage,
    isSending,
    clientDisplay,
    contactDisplay,
    handleGenerate,
    handleRunAi,
    handleSend,
    handleExport,
  };
}
