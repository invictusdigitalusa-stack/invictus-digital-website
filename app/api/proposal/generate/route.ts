import { generateProposal } from "@/lib/proposalAI";
import { buildProposalGenerationContext } from "@/lib/proposalContext";
import {
  apiBadRequest,
  apiConflict,
  apiError,
  apiSuccess,
  getErrorMessage,
} from "@/lib/api/responses";
import {
  isProposalPackageName,
  PROPOSAL_MISSING_AI_ERROR,
  type ProposalGenerateRequest,
} from "@/lib/proposalTypes";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProposalGenerateRequest;
    const companyName = body.companyName?.trim() ?? "";

    if (!companyName) {
      return apiBadRequest("Company name is required.");
    }

    if (!isProposalPackageName(body.package)) {
      return apiBadRequest("A valid package is required.");
    }

    const input: ProposalGenerateRequest = {
      companyName,
      website: body.website?.trim(),
      industry: body.industry?.trim(),
      package: body.package,
      timeline: body.timeline?.trim() || "4–6 weeks",
      paymentTerms: body.paymentTerms?.trim() || "50% deposit · 50% at launch",
      projectNotes: body.projectNotes?.trim(),
    };

    const context = await buildProposalGenerationContext(input);

    if (!context.hasProposalAiData) {
      return apiConflict("Run AI for this lead before generating a proposal.", {
        code: PROPOSAL_MISSING_AI_ERROR,
        leadId: context.leadId,
      });
    }

    const proposal = await generateProposal(input);

    return apiSuccess(proposal);
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to generate proposal."));
  }
}
