"use client";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  industries,
  nextSteps,
  packageDetails,
  packages,
  type Industry,
  type PackageName,
  type ProposalStatus,
} from "./data";
import { useProposalGenerator } from "./useProposalGenerator";

const inputClassName =
  "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]";

const statusOrder: ProposalStatus[] = ["Draft", "Sent", "Viewed", "Signed"];

type ProposalGeneratorProps = {
  initialCompany?: string;
  initialWebsite?: string;
  initialIndustry?: string;
  initialPackage?: string;
  initialTimeline?: string;
  initialPaymentTerms?: string;
};

export function ProposalGenerator({
  initialCompany = "",
  initialWebsite = "",
  initialIndustry,
  initialPackage,
  initialTimeline = "4–6 weeks",
  initialPaymentTerms = "50% deposit · 50% at launch",
}: ProposalGeneratorProps = {}) {
  const {
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
  } = useProposalGenerator({
    initialCompany,
    initialWebsite,
    initialIndustry,
    initialPackage,
    initialTimeline,
    initialPaymentTerms,
  });

  const details = packageDetails[form.package];

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Tool
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Proposal Generator
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Generate premium proposals in minutes.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[320px_1fr_240px]">
        <div className="space-y-6">
          <form id="proposal-form" onSubmit={handleGenerate} className="space-y-6">
          <Card className="p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Client Information
            </p>
            <div className="mt-6 space-y-4">
              {[
                { id: "company", label: "Company Name", key: "companyName" as const, type: "text" },
                { id: "contact", label: "Contact Person", key: "contactPerson" as const, type: "text" },
                { id: "email", label: "Email", key: "email" as const, type: "email" },
                { id: "website", label: "Website", key: "website" as const, type: "url" },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-2 block text-sm text-zinc-300">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className={inputClassName}
                    required={field.key === "companyName"}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="industry" className="mb-2 block text-sm text-zinc-300">
                  Industry
                </label>
                <select
                  id="industry"
                  value={form.industry}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      industry: e.target.value as Industry,
                    }))
                  }
                  className={`${inputClassName} cursor-pointer`}
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry} className="bg-[#0a0a0a]">
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Project
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="package" className="mb-2 block text-sm text-zinc-300">
                  Package
                </label>
                <select
                  id="package"
                  value={form.package}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      package: e.target.value as PackageName,
                    }))
                  }
                  className={`${inputClassName} cursor-pointer`}
                >
                  {packages.map((pkg) => (
                    <option key={pkg} value={pkg} className="bg-[#0a0a0a]">
                      {pkg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="timeline" className="mb-2 block text-sm text-zinc-300">
                  Timeline
                </label>
                <input
                  id="timeline"
                  type="text"
                  value={form.timeline}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, timeline: e.target.value }))
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="payment" className="mb-2 block text-sm text-zinc-300">
                  Payment Terms
                </label>
                <input
                  id="payment"
                  type="text"
                  value={form.paymentTerms}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, paymentTerms: e.target.value }))
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="notes" className="mb-2 block text-sm text-zinc-300">
                  Project Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.projectNotes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, projectNotes: e.target.value }))
                  }
                  className={`${inputClassName} resize-none`}
                  placeholder="Custom scope notes, priorities, or client requests."
                />
              </div>
            </div>
          </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)]">
            <div className="border-b border-white/[0.08] bg-white/[0.02] px-6 py-4 md:px-8">
              <p className="text-sm font-semibold text-white">Proposal Preview</p>
              <p className="mt-1 text-xs text-zinc-500">
                {generated ? "Live preview" : "Fill in details and generate"}
              </p>
            </div>

            <div className="space-y-8 p-6 md:p-8">
              {missingAiPrompt ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                  <p className="text-sm leading-7 text-amber-100">
                    Run AI for this lead before generating a proposal.
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleRunAi()}
                    disabled={isRunningAi || !missingAiPrompt.leadId}
                    className="mt-4 inline-flex rounded-full bg-[#22C55E] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRunningAi ? "Queueing..." : "Run AI"}
                  </button>
                </div>
              ) : null}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
                  Invictus Digital
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {generatedProposal?.proposalTitle ?? "Growth System Proposal"}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Prepared for {clientDisplay}
                </p>
              </div>

              <PreviewSection label="Client">
                <p className="text-sm text-zinc-300">{clientDisplay}</p>
                <p className="mt-1 text-sm text-zinc-500">{contactDisplay}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {form.email || "email@company.com"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {form.website || "website.com"} · {form.industry}
                </p>
              </PreviewSection>

              {generatedProposal ? (
                <>
                  <PreviewSection label="Executive Summary">
                    <p className="text-sm leading-7 text-zinc-300">
                      {generatedProposal.executiveSummary}
                    </p>
                  </PreviewSection>

                  <PreviewSection label="Why This Matters">
                    <p className="text-sm leading-7 text-zinc-300">
                      {generatedProposal.whyThisMatters}
                    </p>
                  </PreviewSection>

                  <PreviewSection label="Why We Chose This Package">
                    <p className="text-sm leading-7 text-zinc-300">
                      {generatedProposal.whyWeChoseThisPackage}
                    </p>
                  </PreviewSection>
                </>
              ) : null}

              <PreviewSection label="Package">
                <p className="text-lg font-semibold text-white">{form.package}</p>
              </PreviewSection>

              {generatedProposal ? (
                <PreviewSection label="Recommended Solution">
                  <p className="text-sm leading-7 text-zinc-300">
                    {generatedProposal.recommendedSolution}
                  </p>
                </PreviewSection>
              ) : null}

              <PreviewSection label="Scope">
                {generatedProposal ? (
                  <p className="text-sm leading-7 text-zinc-300">
                    {generatedProposal.scopeSummary}
                  </p>
                ) : null}
                <ul className={`space-y-2 ${generatedProposal ? "mt-4" : ""}`}>
                  {details.scope.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-zinc-400">
                      <span className="text-[#22C55E]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </PreviewSection>

              {generatedProposal ? (
                <PreviewSection label="Expected Outcomes">
                  <ul className="space-y-2">
                    {generatedProposal.expectedOutcomes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-zinc-400">
                        <span className="text-[#22C55E]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </PreviewSection>
              ) : null}

              {generatedProposal ? (
                <PreviewSection label="First 30 Days">
                  <ol className="space-y-3">
                    {generatedProposal.firstThirtyDays.map((milestone, index) => (
                      <li
                        key={milestone}
                        className="flex gap-3 text-sm leading-7 text-zinc-300"
                      >
                        <span className="font-medium text-zinc-500">{index + 1}.</span>
                        {milestone}
                      </li>
                    ))}
                  </ol>
                </PreviewSection>
              ) : null}

              <PreviewSection label="Timeline">
                <p className="text-sm text-zinc-300">
                  {generatedProposal?.timelineSummary ?? form.timeline}
                </p>
                {!generatedProposal ? (
                  <p className="mt-2 text-sm text-zinc-500">{form.paymentTerms}</p>
                ) : null}
              </PreviewSection>

              <PreviewSection label="Investment">
                <p className="text-3xl font-semibold text-[#22C55E]">
                  {details.investment}
                </p>
                {generatedProposal ? (
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {generatedProposal.investmentJustification}
                  </p>
                ) : null}
              </PreviewSection>

              <PreviewSection label="Deliverables">
                <ul className="space-y-2">
                  {details.deliverables.map((item) => (
                    <li key={item} className="text-sm text-zinc-400">
                      • {item}
                    </li>
                  ))}
                </ul>
              </PreviewSection>

              {form.projectNotes.trim() ? (
                <PreviewSection label="Notes">
                  <p className="text-sm leading-7 text-zinc-400">
                    {form.projectNotes}
                  </p>
                </PreviewSection>
              ) : null}

              <PreviewSection label="Next Steps">
                <ol className="space-y-2">
                  {(generatedProposal?.nextSteps ?? nextSteps).map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-zinc-400">
                      <span className="font-medium text-zinc-500">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </PreviewSection>

              {generatedProposal ? (
                <PreviewSection label="Proposal Closing">
                  <p className="text-sm leading-7 text-zinc-300">
                    {generatedProposal.closingStatement}
                  </p>
                </PreviewSection>
              ) : null}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Signature
                </p>
                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  <div>
                    <div className="border-b border-white/[0.12] pb-8" />
                    <p className="mt-2 text-xs text-zinc-500">Client Signature</p>
                    <p className="mt-1 text-sm text-zinc-400">{contactDisplay}</p>
                  </div>
                  <div>
                    <div className="border-b border-white/[0.12] pb-8" />
                    <p className="mt-2 text-xs text-zinc-500">Invictus Digital</p>
                    <p className="mt-1 text-sm text-zinc-400">Douglas · Founder</p>
                  </div>
                </div>
                <p className="mt-6 text-xs text-zinc-600">Date: _______________</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="submit"
              form="proposal-form"
              disabled={isGenerating}
              className="rounded-2xl bg-[#22C55E] px-5 py-4 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Proposal"}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!generated}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!generated || isSending}
              className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-5 py-4 text-sm font-semibold text-[#22C55E] transition hover:bg-[#22C55E]/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSending ? "Sending..." : "Send Proposal"}
            </button>
          </div>

          {sendMessage ? (
            <p
              className={`text-center text-sm ${
                sendMessage.type === "success" ? "text-[#22C55E]" : "text-red-400"
              }`}
            >
              {sendMessage.text}
            </p>
          ) : actionMessage ? (
            <p className="text-center text-sm text-[#22C55E]">{actionMessage}</p>
          ) : null}
        </div>

        <aside>
          <Card className="sticky top-24 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Proposal Status
            </p>

            <ul className="mt-6 space-y-3">
              {statusOrder.map((item) => {
                const isActive = status === item;
                const isPast =
                  statusOrder.indexOf(item) <= statusOrder.indexOf(status);

                return (
                  <li
                    key={item}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      isActive
                        ? "border-[#22C55E]/30 bg-[#22C55E]/10"
                        : isPast
                          ? "border-white/[0.08] bg-white/[0.04]"
                          : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isActive ? "text-[#22C55E]" : "text-zinc-400"}`}
                    >
                      {item}
                    </span>
                    {isPast ? (
                      <span className="text-[#22C55E]" aria-hidden="true">
                        ✓
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-xs leading-6 text-zinc-600">
              Status updates when you generate or send the proposal.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}

function PreviewSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
