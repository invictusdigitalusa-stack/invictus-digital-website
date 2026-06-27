import { NextResponse } from "next/server";

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status = 500,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function apiBadRequest(message: string, extra?: Record<string, unknown>) {
  return apiError(message, 400, extra);
}

export function apiNotFound(message: string) {
  return apiError(message, 404);
}

export function apiConflict(message: string, extra?: Record<string, unknown>) {
  return apiError(message, 409, extra);
}

export async function handleApiRoute<T>(
  handler: () => Promise<T>,
  fallbackMessage: string
) {
  try {
    return apiSuccess(await handler());
  } catch (error) {
    return apiError(getErrorMessage(error, fallbackMessage));
  }
}
