import { isEntityUuid } from "@/features/planner/lib/newEntityId";

/**
 * Shared URL plan-id gate for guest + member canvas routes.
 * - Arrays / empty / whitespace-only / non-UUID => reject
 * - Valid RFC UUID => accept, canonical lowercase (case-stable storage keys)
 */
export type PlanIdGateResult =
  | { readonly ok: true; readonly planId: string | undefined }
  | { readonly ok: false };

export function parsePlanIdSearchParam(
  rawId: string | string[] | undefined,
): PlanIdGateResult {
  if (Array.isArray(rawId)) {
    return { ok: false };
  }
  if (rawId === undefined) {
    return { ok: true, planId: undefined };
  }
  const trimmed = rawId.trim();
  if (!trimmed || !isEntityUuid(trimmed)) {
    return { ok: false };
  }
  return { ok: true, planId: trimmed.toLowerCase() };
}
