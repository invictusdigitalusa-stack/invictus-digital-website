import "server-only";

import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { createOpenAIClient } from "./client";

type JsonCompletionOptions = {
  messages: ChatCompletionMessageParam[];
  model?: string;
  temperature?: number;
};

export async function createJsonCompletion<T>(
  options: JsonCompletionOptions
): Promise<T | null> {
  const client = createOpenAIClient();

  if (!client) {
    return null;
  }

  try {
    const completion = await client.chat.completions.create({
      model: options.model ?? "gpt-4o-mini",
      temperature: options.temperature ?? 0.3,
      response_format: { type: "json_object" },
      messages: options.messages,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return null;
    }

    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}
