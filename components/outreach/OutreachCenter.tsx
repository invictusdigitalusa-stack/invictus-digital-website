"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  composeOutreachEmail,
  generateFallbackOutreach,
} from "@/lib/outreachFallback";
import type { OutreachTone } from "@/lib/outreachTypes";
import { saveOutreachToLead } from "@/lib/supabase";

const industries = [
  "Landscaping",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Painting",
  "Concrete",
] as const;

const tones: OutreachTone[] = ["Professional", "Friendly", "Direct"];

type Industry = (typeof industries)[number];

type OutreachForm = {
  companyName: string;
  contactEmail: string;
  website: string;
  industry: Industry;
  primaryProblem: string;
  topImprovement: string;
  tone: OutreachTone;
};

type OutreachStats = {
  emailsGenerated: number;
  emailsSent: number;
  replies: number;
  meetings: number;
};

type GmailSendResponse = {
  success?: boolean;
  messageId?: string | null;
  threadId?: string | null;
  error?: string | null;
};

const inputClassName =
  "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]";

const PROPOSAL_PACKAGE = "Growth";
const PROPOSAL_TIMELINE = "4–6 weeks";
const PROPOSAL_PAYMENT = "50% deposit · 50% at launch";

function buildProposalUrl(form: OutreachForm) {
  const params = new URLSearchParams();

  if (form.companyName.trim()) {
    params.set("company", form.companyName.trim());
  }

  if (form.website.trim()) {
    params.set("website", form.website.trim());
  }

  params.set("industry", form.industry);
  params.set("package", PROPOSAL_PACKAGE);
  params.set("timeline", PROPOSAL_TIMELINE);
  params.set("payment", PROPOSAL_PAYMENT);

  return `/proposal?${params.toString()}`;
}

function parseIndustry(value?: string): Industry {
  if (value && industries.includes(value as Industry)) {
    return value as Industry;
  }

  return "Landscaping";
}

type OutreachCenterProps = {
  initialCompany?: string;
  initialWebsite?: string;
  initialIndustry?: string;
  initialPrimaryProblem?: string;
  initialTopImprovement?: string;
};

export function OutreachCenter({
  initialCompany = "",
  initialWebsite = "",
  initialIndustry,
  initialPrimaryProblem = "",
  initialTopImprovement = "",
}: OutreachCenterProps = {}) {
  const router = useRouter();
  const [form, setForm] = useState<OutreachForm>({
    companyName: initialCompany,
    contactEmail: "",
    website: initialWebsite,
    industry: parseIndustry(initialIndustry),
    primaryProblem: initialPrimaryProblem,
    topImprovement: initialTopImprovement,
    tone: "Professional",
  });
  const [email, setEmail] = useState({ subject: "", body: "" });
  const [generated, setGenerated] = useState(false);
  const [ready, setReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [stats, setStats] = useState<OutreachStats>({
    emailsGenerated: 0,
    emailsSent: 0,
    replies: 0,
    meetings: 0,
  });

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!form.companyName.trim()) {
      return;
    }

    setIsGenerating(true);
    setGenerateMessage(null);
    setSendMessage(null);
    setReady(false);

    try {
      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          website: form.website.trim(),
          industry: form.industry,
          primaryProblem: form.primaryProblem.trim(),
          topImprovement: form.topImprovement.trim(),
          tone: form.tone,
        }),
      });

      const data = (await response.json()) as {
        subject?: string;
        opening?: string;
        body?: string;
        cta?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate outreach email.");
      }

      if (!data.subject || !data.opening || !data.body || !data.cta) {
        throw new Error("Incomplete outreach email returned.");
      }

      const composed = composeOutreachEmail(
        {
          subject: data.subject,
          opening: data.opening,
          body: data.body,
          cta: data.cta,
        },
        form.tone
      );

      setEmail(composed);
      setGenerated(true);
      setStats((prev) => ({
        ...prev,
        emailsGenerated: prev.emailsGenerated + 1,
      }));
    } catch (error) {
      const fallback = composeOutreachEmail(
        generateFallbackOutreach({
          companyName: form.companyName.trim(),
          industry: form.industry,
          topImprovement: form.topImprovement.trim(),
          tone: form.tone,
        }),
        form.tone
      );

      setEmail(fallback);
      setGenerated(true);
      setGenerateMessage(
        error instanceof Error
          ? `${error.message} Using fallback draft.`
          : "Using fallback draft."
      );
      setStats((prev) => ({
        ...prev,
        emailsGenerated: prev.emailsGenerated + 1,
      }));
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch {
      setCopyFeedback("Copy failed");
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  }

  async function handleMarkReady() {
    if (!generated) {
      return;
    }

    setReady(true);

    await saveOutreachToLead({
      companyName: form.companyName,
      websiteUrl: form.website,
    });

    router.push(buildProposalUrl(form));
  }

  async function handleSendEmail() {
    if (!generated) {
      setSendMessage("Generate an email before sending.");
      return;
    }

    if (!form.contactEmail.trim()) {
      setSendMessage("Add a recipient email before sending.");
      return;
    }

    setIsSending(true);
    setSendMessage(null);

    try {
      const response = await fetch("/api/integrations/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: form.contactEmail.trim(),
          subject: previewSubject,
          body: previewBody,
        }),
      });

      const data = (await response.json()) as GmailSendResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Failed to send email.");
      }

      setStats((prev) => ({
        ...prev,
        emailsSent: prev.emailsSent + 1,
      }));

      setSendMessage(
        data.messageId
          ? `Email sent. Gmail message ID: ${data.messageId}`
          : "Email sent."
      );

      await saveOutreachToLead({
        companyName: form.companyName,
        websiteUrl: form.website,
      });
    } catch (error) {
      setSendMessage(
        error instanceof Error ? error.message : "Failed to send email."
      );
    } finally {
      setIsSending(false);
    }
  }

  const previewSubject =
    email.subject || `Quick idea for ${form.companyName.trim() || "{{Company}}"}`;

  const previewBody =
    email.body ||
    `Hi ${form.companyName.trim() || "{{Company}"},
    
I came across your website while looking at companies in your space.

I noticed a few opportunities that could help improve conversions and local visibility.

The biggest improvement I saw was:

${form.topImprovement.trim() || "{{Top Improvement}}"}

I put together a quick concept showing what this could look like.

If you're interested, I can send it over.

Best,
Douglas
Invictus Digital`;

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Sales System
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Outreach Center
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Generate, review, and send personalized outreach through Gmail.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[340px_1fr_260px]">
        <Card className="h-fit p-6 md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Lead Input
          </p>

          <form onSubmit={handleGenerate} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="company-name"
                className="mb-2 block text-sm text-zinc-300"
              >
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                value={form.companyName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, companyName: e.target.value }))
                }
                className={inputClassName}
                placeholder="Summit Roofing Co."
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm text-zinc-300"
              >
                Recipient Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                }
                className={inputClassName}
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="mb-2 block text-sm text-zinc-300"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={form.website}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, website: e.target.value }))
                }
                className={inputClassName}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="mb-2 block text-sm text-zinc-300"
              >
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
                  <option
                    key={industry}
                    value={industry}
                    className="bg-[#0a0a0a]"
                  >
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="primary-problem"
                className="mb-2 block text-sm text-zinc-300"
              >
                Primary Problem
              </label>
              <textarea
                id="primary-problem"
                rows={3}
                value={form.primaryProblem}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    primaryProblem: e.target.value,
                  }))
                }
                className={`${inputClassName} resize-none`}
                placeholder="Weak mobile experience and no clear service pages."
              />
            </div>

            <div>
              <label
                htmlFor="top-improvement"
                className="mb-2 block text-sm text-zinc-300"
              >
                Top Improvement
              </label>
              <textarea
                id="top-improvement"
                rows={3}
                value={form.topImprovement}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    topImprovement: e.target.value,
                  }))
                }
                className={`${inputClassName} resize-none`}
                placeholder="Expand local service pages with stronger CTAs."
              />
            </div>

            <div>
              <label htmlFor="tone" className="mb-2 block text-sm text-zinc-300">
                Tone
              </label>
              <select
                id="tone"
                value={form.tone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tone: e.target.value as OutreachTone,
                  }))
                }
                className={`${inputClassName} cursor-pointer`}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone} className="bg-[#0a0a0a]">
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#22C55E] px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate Cold Email"}
            </button>
          </form>

          {generateMessage ? (
            <p className="mt-4 text-sm text-amber-300">{generateMessage}</p>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)]">
            <div className="border-b border-white/[0.08] bg-white/[0.02] px-6 py-4 md:px-8">
              <p className="text-sm font-semibold text-white">Email Editor</p>
              <p className="mt-1 text-xs text-zinc-500">
                {generated ? "Generated draft" : "Preview template"}
              </p>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Subject
                </p>
                <p className="mt-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white">
                  {previewSubject}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Email
                </p>
                <pre className="mt-2 whitespace-pre-wrap rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 font-sans text-sm leading-7 text-zinc-300">
                  {previewBody}
                </pre>
              </div>

              {ready ? (
                <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
                  Marked ready for outreach.
                </div>
              ) : null}

              {sendMessage ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                  {sendMessage}
                </div>
              ) : null}
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => copyToClipboard(previewBody, "Email copied")}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
            >
              Copy Email
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(previewSubject, "Subject copied")}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
            >
              Copy Subject
            </button>

            <button
              type="button"
              onClick={handleMarkReady}
              disabled={!generated}
              className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-5 py-4 text-sm font-semibold text-[#22C55E] transition hover:border-[#22C55E]/30 hover:bg-[#22C55E]/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mark Ready
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={!generated || isSending}
              className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E] px-5 py-4 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSending ? "Sending..." : "Send Email"}
            </button>
          </div>

          {copyFeedback ? (
            <p className="text-center text-sm text-[#22C55E]">{copyFeedback}</p>
          ) : null}
        </div>

        <aside>
          <Card className="sticky top-24 p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
              Today&apos;s Outreach
            </p>

            <dl className="mt-6 space-y-5">
              {[
                { label: "Emails Generated", value: stats.emailsGenerated },
                { label: "Emails Sent", value: stats.emailsSent },
                { label: "Replies", value: stats.replies },
                { label: "Meetings", value: stats.meetings },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4"
                >
                  <dt className="text-xs text-zinc-500">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </aside>
      </div>
    </Container>
  );
}