import { askCopilot } from "@/lib/copilot";
import { loadCopilotContext } from "@/lib/copilotContext";
import { apiBadRequest, apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

type CopilotRequestBody = {
  question?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CopilotRequestBody;
    const question = body.question?.trim() ?? "";

    if (!question) {
      return apiBadRequest("Question is required.");
    }

    const context = await loadCopilotContext();
    const result = await askCopilot(question, context);

    return apiSuccess(result);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to generate copilot answer."));
  }
}
