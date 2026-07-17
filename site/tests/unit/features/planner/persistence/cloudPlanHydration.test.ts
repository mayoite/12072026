import { describe, expect, it } from "vitest";
import {
  hydrateCloudPlanIntoIndexedDb,
  detectPlanConflict,
  resolveConflict,
} from "@/features/planner/persistence/cloudPlanHydration";
import type { OfflinePlan } from "@/features/planner/cloud-store/offlineStorage";

function plan(
  partial: Pick<OfflinePlan, "contentHash" | "updatedAt"> &
    Partial<Pick<OfflinePlan, "remoteRevision">>,
): OfflinePlan {
  return {
    id: "plan-1",
    document: {} as OfflinePlan["document"],
    localId: null,
    createdAt: partial.updatedAt,
    updatedAt: partial.updatedAt,
    lastSyncedAt: null,
    schemaVersion: "1.0.0",
    source: "local",
    contentHash: partial.contentHash,
    remoteRevision: partial.remoteRevision ?? null,
    localSaveState: "saved_local",
    syncState: "synced",
    syncErrorCode: null,
  };
}

describe("cloudPlanHydration", () => {
  it("returns conflict when content hashes diverge", () => {
    const result = hydrateCloudPlanIntoIndexedDb(
      plan({ contentHash: "aaa", updatedAt: "2026-01-02T00:00:00.000Z" }),
      plan({ contentHash: "bbb", updatedAt: "2026-01-03T00:00:00.000Z" }),
    );
    expect(result.source).toBe("conflict");
    expect(result.plan).toBeNull();
    expect(result.conflictDetails?.localHash).toBe("aaa");
    expect(result.conflictDetails?.remoteHash).toBe("bbb");
  });

  it("picks newer when content hashes match", () => {
    const cloud = plan({
      contentHash: "same",
      updatedAt: "2026-01-03T00:00:00.000Z",
    });
    const result = hydrateCloudPlanIntoIndexedDb(
      plan({ contentHash: "same", updatedAt: "2026-01-02T00:00:00.000Z" }),
      cloud,
    );
    expect(result.source).toBe("cloud");
    expect(result.plan).toBe(cloud);
  });

  it("resolveConflict requires an explicit choice", () => {
    const local = plan({
      contentHash: "local",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "cloud",
      updatedAt: "2026-01-04T00:00:00.000Z",
    });
    expect(resolveConflict(local, cloud, "local").contentHash).toBe("local");
    expect(resolveConflict(local, cloud, "cloud").contentHash).toBe("cloud");
    expect(detectPlanConflict(local, cloud)).toBe(true);
  });
});
