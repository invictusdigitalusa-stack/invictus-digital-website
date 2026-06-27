import { searchGlobal } from "@/lib/globalSearch";
import { apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const results = await searchGlobal(query);

    return apiSuccess(results);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to search internal data."));
  }
}
