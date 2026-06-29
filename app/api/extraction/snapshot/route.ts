import { NextRequest } from "next/server";
import { createWebsiteSnapshot } from "@/lib/extraction";
import { apiError, apiSuccess } from "@/lib/api/responses";

type SnapshotRequest = {
  url?: string;
};

export async function POST(request: NextRequest) {
  let body: SnapshotRequest;

  try {
    body = (await request.json()) as SnapshotRequest;
  } catch {
    return apiError("Invalid JSON payload.", 400);
  }

  const url = body.url?.trim();

  if (!url) {
    return apiError("Missing url.", 400);
  }

  const result = await createWebsiteSnapshot(url);

  if (result.error || !result.snapshot) {
    return apiError(result.error ?? "Snapshot generation failed.", 400);
  }

  return apiSuccess(result.snapshot);
}