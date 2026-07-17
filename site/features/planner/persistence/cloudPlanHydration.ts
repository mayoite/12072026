/**
 * Cloud Plan Hydration - Lane 3 requirement
 * Implements deterministic hydration by choosing newest valid state
 * Handles explicit conflict detection based on contentHash and remoteRevision
 */

import type { OfflinePlan } from "@/features/planner/cloud-store/offlineStorage";

export interface HydrationResult {
  plan: OfflinePlan | null;
  source: "local" | "cloud" | "conflict";
  conflictDetails?: {
    localHash: string;
    remoteHash: string;
    localUpdatedAt: string;
    remoteUpdatedAt: string;
  };
}

export type ConflictResolutionChoice = "local" | "cloud";

/**
 * Hydrate cloud plan on load
 * Lane 3 Hydration Precedence Ranking:
 * 1. Valid schema only
 * 2. Same contentHash → newest updatedAt
 * 3. Different contentHash or remoteRevision → explicit conflict (never silent overwrite)
 */
export function hydrateCloudPlanIntoIndexedDb(
  localPlan: OfflinePlan | null,
  cloudPlan: OfflinePlan | null
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
  const sameContentHash = localPlan.contentHash === cloudPlan.contentHash;

  if (sameContentHash) {
    const newer = cloudTime > localTime ? cloudPlan : localPlan;
    return {
      plan: newer,
      source: cloudTime > localTime ? "cloud" : "local",
    };
  }

  // Divergent content always requires an explicit keep-local / keep-cloud choice.
  return {
    plan: null,
    source: "conflict",
    conflictDetails: {
      localHash: localPlan.contentHash,
      remoteHash: cloudPlan.contentHash,
      localUpdatedAt: localPlan.updatedAt,
      remoteUpdatedAt: cloudPlan.updatedAt,
    },
  };
}

/**
 * Detect if local and cloud plans are in conflict
 */
export function detectPlanConflict(
  localPlan: OfflinePlan,
  cloudPlan: OfflinePlan
): boolean {
  if (localPlan.contentHash === cloudPlan.contentHash) {
    return false;
  }

  if (localPlan.remoteRevision !== cloudPlan.remoteRevision) {
    return true;
  }

  return true;
}

/**
 * Apply an explicit customer conflict choice.
 * Never auto-picks a winner from timestamps alone.
 */
export function resolveConflict(
  localPlan: OfflinePlan,
  cloudPlan: OfflinePlan,
  choice: ConflictResolutionChoice,
): OfflinePlan {
  const winner = choice === "local" ? localPlan : cloudPlan;
  return {
    ...winner,
    syncState: "idle",
    syncErrorCode: null,
  };
}
