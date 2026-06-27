import { getProposalLeadStatus } from "@/lib/proposalContext";
import { apiError, apiSuccess, getErrorMessage } from "@/lib/api/responses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company") ?? "";
    const website = searchParams.get("website") ?? "";
    const status = await getProposalLeadStatus(company, website);

    return apiSuccess(status);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to load proposal lead."));
  }
}
