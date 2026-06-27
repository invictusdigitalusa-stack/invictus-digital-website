"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

const faqs = [
  {
    question: "How long does local SEO take for a landscaping company?",
    answer:
      "Most clients begin seeing movement within 60–90 days, with stronger ranking gains building over 4–6 months. Timeline depends on competition, current website quality, and Google Business optimization.",
    category: "SEO",
  },
  {
    question: "What is AI visibility and why does it matter?",
    answer:
      "AI visibility means structuring your website, content, and business signals so AI-powered search tools can understand and recommend your company. As more customers use AI to find services, this becomes a major growth channel.",
    category: "AI",
  },
  {
    question: "How long does a new website and growth system take to launch?",
    answer:
      "A typical Invictus Digital project launches in 3–6 weeks depending on scope, content readiness, and local SEO requirements. We move quickly without sacrificing quality or conversion strategy.",
    category: "Timeline",
  },
  {
    question: "How much does an Invictus Digital project cost?",
    answer:
      "Pricing depends on website scope, SEO depth, and ongoing optimization needs. We offer tailored packages for landscaping companies and start every engagement with a free website audit.",
    category: "Pricing",
  },
  {
    question: "Do you optimize Google Business Profiles?",
    answer:
      "Yes. Google Business optimization is a core part of our system. We improve categories, descriptions, photos, reviews, and local signals to increase calls and map visibility.",
    category: "SEO",
  },
  {
    question: "Can you help if we already have a website?",
    answer:
      "Absolutely. We often rebuild or refine existing sites, then layer local SEO, AI-ready content, and Google Business optimization on top to improve lead generation without starting from zero.",
    category: "Timeline",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-white/[0.08] bg-[#050505] py-28 text-white md:py-32"
    >
      <Container>
        <SectionHeader
          label="FAQ"
          title="Questions, answered."
          description="Everything you need to know about SEO, AI visibility, timelines, and pricing before booking your free audit."
        />

        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <Card key={faq.question} className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 p-6 text-left transition hover:bg-white/[0.03] md:p-8"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
                      {faq.category}
                    </span>
                    <span className="text-lg font-semibold text-white md:text-xl">
                      {faq.question}
                    </span>
                  </span>
                  <span
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-45 bg-white/[0.04]" : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-7 text-zinc-400 md:px-8 md:pb-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
