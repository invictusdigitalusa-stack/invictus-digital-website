import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/responses";
import { resolveRequestSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const session = await resolveRequestSession(request);

  return apiSuccess({ session });
}
