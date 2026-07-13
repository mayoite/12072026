/**
 * Phase 4 residual — product retire / restore without deleting history.
 * Pure placement policy on top of CatalogLifecycleState.
 */

import type { CatalogLifecycleState } from "./catalogLifecycle.shared";

export type PlacementPolicy = {
  readonly allowed: boolean;
  readonly reason: string;
};

/** Retired products must not appear for new customer placement. */
export function placementPolicyForLifecycle(
  lifecycle: CatalogLifecycleState,
): PlacementPolicy {
  if (lifecycle === "retired") {
    return {
      allowed: false,
      reason: "Product is retired — not available for new placement.",
    };
  }
  if (lifecycle === "draft") {
    return {
      allowed: false,
      reason: "Product is draft — not released for customer placement.",
    };
  }
  return {
    allowed: true,
    reason: "Product is live — placement allowed.",
  };
}

/** Existing designs keep retired identity (history preserved). */
export function preservesRetiredIdentityInExistingDesigns(): true {
  return true;
}

export type RetirementAction = "retire" | "restore";

export function nextLifecycleAfterAction(
  current: CatalogLifecycleState,
  action: RetirementAction,
): { readonly ok: true; readonly next: CatalogLifecycleState } | {
  readonly ok: false;
  readonly error: string;
} {
  if (action === "retire") {
    if (current === "retired") {
      return { ok: false, error: "Product is already retired." };
    }
    return { ok: true, next: "retired" };
  }
  // restore
  if (current !== "retired") {
    return { ok: false, error: "Only retired products can be restored to live." };
  }
  return { ok: true, next: "live" };
}

export function retirementConfirmMessage(
  slug: string,
  action: RetirementAction,
): string {
  if (action === "retire") {
    return [
      `Retire “${slug}”?`,
      "",
      "Impact: the product disappears from new placement and buyer-visible inventory.",
      "History and prior designs keep the product identity. Restore is available later.",
    ].join("\n");
  }
  return [
    `Restore “${slug}” to live?`,
    "",
    "Impact: the product becomes available for new placement again.",
    "Prior retirement history remains in the lifecycle manifest.",
  ].join("\n");
}
