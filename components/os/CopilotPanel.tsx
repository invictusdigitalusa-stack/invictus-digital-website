"use client";

import { useState } from "react";
import type { CopilotAction, CopilotResponse } from "@/lib/copilotActions";
import { isClickableCopilotAction } from "@/lib/copilotActions";
import { Card } from "@/components/ui/Card";
import { useCopilotActionHandlers } from "./useCopilotActionHandlers";

const exampleQuestions = [
  "What are my best leads?",
  "Which leads should I contact first?",
  "What should I do today?",
];

export function CopilotPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [suggestedActions, setSuggestedActions] = useState<CopilotAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAction } = useCopilotActionHandlers();

  async function handleAsk(nextQuestion?: string) {
    const trimmed = (nextQuestion ?? question).trim();

    if (!trimmed || isLoading) {
      return;
    }

    setQuestion(trimmed);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = (await response.json()) as CopilotResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Copilot request failed.");
      }

      setAnswer(data.answer);
      setSuggestedActions(data.suggestedActions ?? []);
    } catch (requestError) {
      setAnswer("");
      setSuggestedActions([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Copilot could not answer right now."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside className="w-full shrink-0 border-t border-white/[0.08] bg-[#050505] xl:w-[420px] xl:border-t-0 xl:border-l 2xl:w-[480px]">
      <div className="flex flex-col xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)]">
        <div className="border-b border-white/[0.08] px-6 py-6 xl:px-8 xl:py-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
            AI Copilot
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">Ask Invictus OS</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
            Read-only guidance from your CRM, delivery, queue, and activity data.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-7 xl:px-8 xl:py-8">
          <div className="space-y-5">
            <label className="block">
              <span className="sr-only">Ask a question</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleAsk();
                  }
                }}
                rows={4}
                placeholder="Ask about leads, projects, proposals, or priorities..."
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleAsk()}
              disabled={isLoading || question.trim().length === 0}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#22C55E] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Thinking..." : "Ask Copilot"}
            </button>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
              Examples
            </p>
            <div className="flex flex-wrap gap-2.5">
              {exampleQuestions.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => void handleAsk(example)}
                  disabled={isLoading}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-left text-xs leading-5 text-zinc-400 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-200 disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {isLoading ? (
              <Card className="p-6">
                <p className="text-sm leading-7 text-zinc-400">
                  Analyzing your business data...
                </p>
              </Card>
            ) : null}

            {error ? (
              <Card className="border-red-500/20 bg-red-500/[0.04] p-6">
                <p className="text-sm font-medium text-red-300">Copilot error</p>
                <p className="mt-3 text-sm leading-7 text-red-200/80">{error}</p>
              </Card>
            ) : null}

            {answer ? (
              <Card className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
                  Answer
                </p>
                <p className="mt-5 text-sm leading-8 text-zinc-300">{answer}</p>
              </Card>
            ) : null}

            {suggestedActions.length > 0 ? (
              <Card className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#22C55E]">
                  Suggested Actions
                </p>
                <ul className="mt-5 space-y-4">
                  {suggestedActions.map((action, index) => (
                    <li key={`${action.type}-${action.label}-${index}`}>
                      {isClickableCopilotAction(action) ? (
                        <button
                          type="button"
                          onClick={() => void handleAction(action)}
                          className="flex w-full items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-sm leading-7 text-zinc-300 transition hover:border-[#22C55E]/30 hover:bg-[#22C55E]/10 hover:text-white"
                        >
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]"
                            aria-hidden="true"
                          />
                          <span>{action.label}</span>
                        </button>
                      ) : (
                        <div className="flex gap-3 text-sm leading-7 text-zinc-300">
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]"
                            aria-hidden="true"
                          />
                          {action.label}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
