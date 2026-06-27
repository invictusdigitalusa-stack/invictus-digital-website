import { enqueueLead, getQueueStatus, runQueue } from "@/lib/agentQueue";
import {
  apiBadRequest,
  apiError,
  apiSuccess,
  getErrorMessage,
} from "@/lib/api/responses";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { leadId?: string };
    const leadId = body.leadId?.trim();

    if (!leadId) {
      return apiBadRequest("Lead ID is required.");
    }

    const statusBeforeEnqueue = await getQueueStatus();
    const enqueueResult = await enqueueLead(leadId);

    if (!enqueueResult.success) {
      return apiError(enqueueResult.error ?? "Failed to enqueue lead.");
    }

    if (!statusBeforeEnqueue.isRunning) {
      void runQueue().catch((error) => {
        console.error(
          "Failed to process AI agent queue:",
          error instanceof Error ? error.message : error
        );
      });
    }

    const status = await getQueueStatus();

    return apiSuccess({
      success: true,
      enqueueResult,
      status,
    });
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to enqueue AI pipeline."));
  }
}
