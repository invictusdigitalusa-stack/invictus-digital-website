import { signInWithCredentials } from "@/lib/auth/login";
import { setAuthCookies } from "@/lib/auth/cookies";
import { apiBadRequest, apiError, apiSuccess } from "@/lib/api/responses";
import { isSupabaseAuthEnabled } from "@/lib/auth/config";

export async function POST(request: Request) {
  if (!isSupabaseAuthEnabled()) {
    return apiError("Authentication is not enabled.", 503);
  }

  let body: { email?: string; password?: string };

  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return apiBadRequest("Invalid request body.");
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return apiBadRequest("Email and password are required.");
  }

  const result = await signInWithCredentials(email, password);

  if (!result.success) {
    return apiError(result.error, 401);
  }

  const response = apiSuccess({
    session: result.session,
  });

  setAuthCookies(response, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
  });

  return response;
}
