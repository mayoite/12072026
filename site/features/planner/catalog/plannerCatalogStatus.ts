/**
 * Pure catalog lifecycle status for the planner workspace hook + status bar.
 * Keeps remote React Query flags out of UI label mapping.
 */

export type PlannerWorkspaceCatalogStatus =
  | "loading"
  | "ready"
  | "fallback"
  | "stale"
  | "offline"
  | "error";

export type PlannerCatalogQuerySource = "remote" | "fallback";

export type DerivePlannerWorkspaceCatalogStatusInput = {
  readonly offline: boolean;
  readonly isError: boolean;
  readonly isPending: boolean;
  readonly isFetching: boolean;
  /** True once React Query has a settled payload (including honest empty). */
  readonly hasData: boolean;
  readonly source?: PlannerCatalogQuerySource;
};

/**
 * Map React Query flags → workspace catalog status.
 *
 * Critical: never stay on "loading" after data exists. Background refetch is "stale".
 * Honest empty remote is "fallback", not loading.
 */
export function derivePlannerWorkspaceCatalogStatus(
  input: DerivePlannerWorkspaceCatalogStatusInput,
): PlannerWorkspaceCatalogStatus {
  if (input.offline) return "offline";
  // First paint / in-flight with no payload yet.
  if (input.isPending && !input.hasData) return "loading";
  if (input.isError && !input.hasData) return "error";
  // Have data: background refresh must not look like initial load.
  if (input.isFetching && input.hasData) return "stale";
  if (input.source === "fallback") return "fallback";
  // Refetch failed but prior data may still be present — surface error only if no data.
  if (input.isError) return "error";
  return "ready";
}

/**
 * Status-bar copy for catalog lifecycle.
 * Returns null when the pill should be hidden (ready / quiet stale refresh).
 */
export function plannerCatalogStatusBarLabel(
  status: PlannerWorkspaceCatalogStatus,
): string | null {
  switch (status) {
    case "loading":
      return "Loading catalog…";
    case "fallback":
      return "Offline catalog";
    case "error":
      return "Catalog unavailable";
    case "offline":
      return "Offline";
    // Inventory panel already shows "Refreshing…"; do not mislabel as Loading.
    case "stale":
    case "ready":
      return null;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
