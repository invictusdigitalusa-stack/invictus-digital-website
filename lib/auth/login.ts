import { createSupabaseAuthClient } from "./session";
import { resolveUserWorkspaceSession } from "./workspace";
import type { Session } from "./types";

export type SignInResult =
  | {
      success: true;
      session: Session;
      accessToken: string;
      refreshToken: string | null;
      expiresIn: number | null;
    }
  | {
      success: false;
      error: string;
    };

export async function signInWithCredentials(
  email: string,
  password: string
): Promise<SignInResult> {
  const client = createSupabaseAuthClient();

  if (!client) {
    return { success: false, error: "Authentication is not configured." };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Invalid email or password.",
    };
  }

  const userMetadata = data.user.user_metadata ?? {};

  const user = {
    id: data.user.id,
    email: data.user.email ?? email.trim(),
    displayName:
      typeof userMetadata.full_name === "string"
        ? userMetadata.full_name
        : typeof userMetadata.name === "string"
          ? userMetadata.name
          : null,
    avatarUrl:
      typeof userMetadata.avatar_url === "string"
        ? userMetadata.avatar_url
        : null,
  };

  const session = await resolveUserWorkspaceSession({
    user,
    accessToken: data.session.access_token,
    expiresAt: data.session.expires_at
      ? new Date(data.session.expires_at * 1000).toISOString()
      : null,
  });

  return {
    success: true,
    session,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token ?? null,
    expiresIn: data.session.expires_in ?? null,
  };
}
