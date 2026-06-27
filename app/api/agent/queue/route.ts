import { getQueueStatus } from "@/lib/agentQueue";
import { apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function GET() {
  try {
    const status = await getQueueStatus();
    return apiSuccess(status);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to fetch queue status."));
  }
}
