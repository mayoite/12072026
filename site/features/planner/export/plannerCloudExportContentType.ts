/** Allowlisted export MIME types (reject text/html and other XSS vectors). */
export const PLANNER_CLOUD_EXPORT_CONTENT_TYPES = [
  "application/json",
  "text/plain",
  "text/csv",
  "application/csv",
] as const;

export type PlannerCloudExportContentType =
  (typeof PLANNER_CLOUD_EXPORT_CONTENT_TYPES)[number];

const ALLOWED_EXPORT_CONTENT_TYPES = new Set<string>(
  PLANNER_CLOUD_EXPORT_CONTENT_TYPES,
);

export function normalizePlannerExportContentType(
  raw: string | undefined | null,
): PlannerCloudExportContentType | null {
  if (raw === undefined || raw === null || !raw.trim()) {
    return "application/json";
  }
  // Strip parameters (e.g. charset) and normalize.
  const base = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!ALLOWED_EXPORT_CONTENT_TYPES.has(base)) {
    return null;
  }
  return base as PlannerCloudExportContentType;
}
