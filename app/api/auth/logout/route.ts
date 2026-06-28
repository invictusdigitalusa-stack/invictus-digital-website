import { clearAuthCookies } from "@/lib/auth/cookies";
import { apiSuccess } from "@/lib/api/responses";

export async function POST() {
  const response = apiSuccess({ success: true });
  clearAuthCookies(response);
  return response;
}
