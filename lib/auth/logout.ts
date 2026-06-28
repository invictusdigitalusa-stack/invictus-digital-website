"use client";

type LogoutOptions = {
  redirect?: boolean;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

/**
 * Clears the auth session cookies and optionally redirects to login.
 */
export async function logout(options?: LogoutOptions) {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      options?.onError?.(data?.error ?? "Unable to sign out.");
      return;
    }

    options?.onSuccess?.();

    if (options?.redirect !== false) {
      window.location.href = "/login";
    }
  } catch {
    options?.onError?.("Unable to sign out.");
  }
}
