export function normalizeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

export function normalizeOptionalString(value: string | undefined) {
  return value?.trim() ?? "";
}

export function normalizeStringList(
  value: unknown,
  maxItems?: number
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return typeof maxItems === "number"
    ? normalized.slice(0, maxItems)
    : normalized;
}
