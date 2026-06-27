import { analyzeWebsite } from "@/lib/audit";
import { apiBadRequest, apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      company?: string;
      website?: string;
      industry?: string;
    };

    const website = body.website?.trim();

    if (!website) {
      return apiBadRequest("Website URL is required.");
    }

    const audit = await analyzeWebsite(website);

    return apiSuccess(audit);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to analyze website."));
  }
}
