/**
 * Cloud Plan Hydration - Lane 3 requirement
 * Implements deterministic hydration by choosing newest valid state
 * Handles explicit conflict detection based on contentHash and remoteRevision
 */

import type { OfflinePlan } from "@/features/planner/cloud-store/offlineStorage";

/** Pure conflict payload for UI and resolve flows (contentHash-first). */
export type PlanConflictDetails = {
  localHash: string;
  remoteHash: string;
  localUpdatedAt: string;
  remoteUpdatedAt: string;
};

export interface HydrationResult {
  plan: OfflinePlan | null;
  source: "local" | "cloud" | "conflict";
  conflictDetails?: PlanConflictDetails;
  /** Both sides retained when source is conflict so the host can apply keep-local / keep-cloud. */
  localPlan?: OfflinePlan;
  cloudPlan?: OfflinePlan;
}

export type ConflictResolutionChoice = "local" | "cloud";

export type ConflictResolutionResult = {
  choice: ConflictResolutionChoice;
  plan: OfflinePlan;
  /** True when the live workspace should load the winner document (keep-cloud). */
  shouldReplaceWorkspaceDocument: boolean;
};

/**
 * Content-hash equality for conflict detection.
 * Empty strings are unequal to non-empty; two empty hashes still compare equal.
 */
export function contentHashesEqual(a: string, b: string): boolean {
  return a === b;
}

/**
 * True when local and cloud documents have divergent contentHash.
 * Timestamp alone never creates a conflict.
 */
export function plansHaveDivergentContent(
  localPlan: Pick<OfflinePlan, "contentHash">,
  cloudPlan: Pick<OfflinePlan, "contentHash">,
): boolean {
  return !contentHashesEqual(localPlan.contentHash, cloudPlan.contentHash);
}

/**
 * Build the standard conflict details envelope from both OfflinePlan sides.
 */
export function buildPlanConflictDetails(
  localPlan: Pick<OfflinePlan, "contentHash" | "updatedAt">,
  cloudPlan: Pick<OfflinePlan, "contentHash" | "updatedAt">,
): PlanConflictDetails {
  return {
    localHash: localPlan.contentHash,
    remoteHash: cloudPlan.contentHash,
    localUpdatedAt: localPlan.updatedAt,
    remoteUpdatedAt: cloudPlan.updatedAt,
  };
}

/**
 * Map pure conflict details into the presentational dialog prop shape.
 */
export function conflictDetailsForDialog(details: PlanConflictDetails): {
  localUpdatedAt: string;
  remoteUpdatedAt: string;
  localHash: string;
  remoteHash: string;
} {
  return {
    localUpdatedAt: details.localUpdatedAt,
    remoteUpdatedAt: details.remoteUpdatedAt,
    localHash: details.localHash,
    remoteHash: details.remoteHash,
  };
}

/**
 * Hydrate cloud plan on load
 * Lane 3 Hydration Precedence Ranking:
 * 1. Valid schema only
 * 2. Same contentHash → newest updatedAt
 * 3. Different contentHash → explicit conflict (never silent overwrite)
 */
export function hydrateCloudPlanIntoIndexedDb(
  localPlan: OfflinePlan | null,
  cloudPlan: OfflinePlan | null,
): HydrationResult {
  if (!localPlan && !cloudPlan) {
    return { plan: null, source: "local" };
  }

  if (!localPlan) {
    return {
      plan: cloudPlan,
      source: "cloud",
    };
  }

  if (!cloudPlan) {
    return {
      plan: localPlan,
      source: "local",
    };
  }

  const localTime = new Date(localPlan.updatedAt).getTime();
  const cloudTime = new Date(cloudPlan.updatedAt).getTime();
  const sameContentHash = contentHashesEqual(
    localPlan.contentHash,
    cloudPlan.contentHash,
  );

  if (sameContentHash) {
    const cloudIsNewer = cloudTime > localTime;
    return {
      plan: cloudIsNewer ? cloudPlan : localPlan,
      source: cloudIsNewer ? "cloud" : "local",
    };
  }

  // Divergent content always requires an explicit keep-local / keep-cloud choice.
  return {
    plan: null,
    source: "conflict",
    conflictDetails: buildPlanConflictDetails(localPlan, cloudPlan),
    localPlan,
    cloudPlan,
  };
}

/**
 * Detect if local and cloud plans are in content conflict.
 * contentHash is authoritative; matching hashes are never a conflict.
 */
export function detectPlanConflict(
  localPlan: Pick<OfflinePlan, "contentHash">,
  cloudPlan: Pick<OfflinePlan, "contentHash">,
): boolean {
  return plansHaveDivergentContent(localPlan, cloudPlan);
}

/**
 * Apply an explicit customer conflict choice.
 * Never auto-picks a winner from timestamps alone.
 *
 * - keep-local: local document wins; sync returns to idle for a later push.
 * - keep-cloud: cloud document wins; marked synced as the accepted remote state.
 */
export function resolveConflict(
  localPlan: OfflinePlan,
  cloudPlan: OfflinePlan,
  choice: ConflictResolutionChoice,
): OfflinePlan {
  if (choice === "local") {
    return {
      ...localPlan,
      source: "local",
      syncState: "idle",
      syncErrorCode: null,
    };
  }

  return {
    ...cloudPlan,
    source: "cloud",
    syncState: "synced",
    syncErrorCode: null,
    localSaveState: "saved_local",
  };
}

/**
 * Full keep-local / keep-cloud resolution with host-facing apply flags.
 * Pure: does not touch storage or the canvas.
 */
export function applyConflictResolution(
  localPlan: OfflinePlan,
  cloudPlan: OfflinePlan,
  choice: ConflictResolutionChoice,
): ConflictResolutionResult {
  const plan = resolveConflict(localPlan, cloudPlan, choice);
  return {
    choice,
    plan,
    shouldReplaceWorkspaceDocument: choice === "cloud",
  };
}
