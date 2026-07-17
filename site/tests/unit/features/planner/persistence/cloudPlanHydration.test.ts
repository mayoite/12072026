import { describe, expect, it } from "vitest";
import {
  hydrateCloudPlanIntoIndexedDb,
  detectPlanConflict,
  resolveConflict,
  applyConflictResolution,
  contentHashesEqual,
  plansHaveDivergentContent,
  buildPlanConflictDetails,
  conflictDetailsForDialog,
} from "@/features/planner/persistence/cloudPlanHydration";
import type { OfflinePlan } from "@/features/planner/cloud-store/offlineStorage";

function plan(
  partial: Pick<OfflinePlan, "contentHash" | "updatedAt"> &
    Partial<Pick<OfflinePlan, "remoteRevision" | "syncState" | "source" | "id">>,
): OfflinePlan {
  return {
    id: partial.id ?? "plan-1",
    document: {} as OfflinePlan["document"],
    localId: null,
    createdAt: partial.updatedAt,
    updatedAt: partial.updatedAt,
    lastSyncedAt: null,
    schemaVersion: "1.0.0",
    source: partial.source ?? "local",
    contentHash: partial.contentHash,
    remoteRevision: partial.remoteRevision ?? null,
    localSaveState: "saved_local",
    syncState: partial.syncState ?? "synced",
    syncErrorCode: null,
  };
}

describe("contentHash conflict pure helpers", () => {
  it("contentHashesEqual is strict string equality", () => {
    expect(contentHashesEqual("aaa", "aaa")).toBe(true);
    expect(contentHashesEqual("aaa", "bbb")).toBe(false);
    expect(contentHashesEqual("", "")).toBe(true);
    expect(contentHashesEqual("", "x")).toBe(false);
  });

  it("plansHaveDivergentContent ignores timestamps", () => {
    const local = plan({
      contentHash: "same",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "same",
      updatedAt: "2026-06-01T00:00:00.000Z",
    });
    expect(plansHaveDivergentContent(local, cloud)).toBe(false);
    expect(
      plansHaveDivergentContent(
        { contentHash: "a" },
        { contentHash: "b" },
      ),
    ).toBe(true);
  });

  it("buildPlanConflictDetails captures both hashes and updatedAt", () => {
    const details = buildPlanConflictDetails(
      plan({ contentHash: "loc", updatedAt: "2026-01-02T00:00:00.000Z" }),
      plan({ contentHash: "cld", updatedAt: "2026-01-03T00:00:00.000Z" }),
    );
    expect(details).toEqual({
      localHash: "loc",
      remoteHash: "cld",
      localUpdatedAt: "2026-01-02T00:00:00.000Z",
      remoteUpdatedAt: "2026-01-03T00:00:00.000Z",
    });
    expect(conflictDetailsForDialog(details)).toEqual(details);
  });
});

describe("cloudPlanHydration", () => {
  it("returns null plan when both sides missing", () => {
    const result = hydrateCloudPlanIntoIndexedDb(null, null);
    expect(result.source).toBe("local");
    expect(result.plan).toBeNull();
  });

  it("takes cloud when local is missing", () => {
    const cloud = plan({
      contentHash: "c",
      updatedAt: "2026-01-01T00:00:00.000Z",
      source: "cloud",
    });
    const result = hydrateCloudPlanIntoIndexedDb(null, cloud);
    expect(result.source).toBe("cloud");
    expect(result.plan).toBe(cloud);
  });

  it("takes local when cloud is missing", () => {
    const local = plan({
      contentHash: "l",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const result = hydrateCloudPlanIntoIndexedDb(local, null);
    expect(result.source).toBe("local");
    expect(result.plan).toBe(local);
  });

  it("returns conflict when content hashes diverge (never silent overwrite)", () => {
    const local = plan({
      contentHash: "aaa",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "bbb",
      updatedAt: "2026-01-03T00:00:00.000Z",
      source: "cloud",
    });
    const result = hydrateCloudPlanIntoIndexedDb(local, cloud);
    expect(result.source).toBe("conflict");
    expect(result.plan).toBeNull();
    expect(result.conflictDetails?.localHash).toBe("aaa");
    expect(result.conflictDetails?.remoteHash).toBe("bbb");
    expect(result.conflictDetails?.localUpdatedAt).toBe(local.updatedAt);
    expect(result.conflictDetails?.remoteUpdatedAt).toBe(cloud.updatedAt);
    expect(result.localPlan).toBe(local);
    expect(result.cloudPlan).toBe(cloud);
  });

  it("still conflicts when local timestamp is newer but hash differs", () => {
    const result = hydrateCloudPlanIntoIndexedDb(
      plan({ contentHash: "local-only", updatedAt: "2026-12-01T00:00:00.000Z" }),
      plan({ contentHash: "cloud-only", updatedAt: "2026-01-01T00:00:00.000Z" }),
    );
    expect(result.source).toBe("conflict");
    expect(result.plan).toBeNull();
  });

  it("picks newer when content hashes match", () => {
    const cloud = plan({
      contentHash: "same",
      updatedAt: "2026-01-03T00:00:00.000Z",
      source: "cloud",
    });
    const result = hydrateCloudPlanIntoIndexedDb(
      plan({ contentHash: "same", updatedAt: "2026-01-02T00:00:00.000Z" }),
      cloud,
    );
    expect(result.source).toBe("cloud");
    expect(result.plan).toBe(cloud);
  });

  it("picks local when hashes match and local is newer or equal", () => {
    const local = plan({
      contentHash: "same",
      updatedAt: "2026-01-04T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "same",
      updatedAt: "2026-01-03T00:00:00.000Z",
      source: "cloud",
    });
    const newerLocal = hydrateCloudPlanIntoIndexedDb(local, cloud);
    expect(newerLocal.source).toBe("local");
    expect(newerLocal.plan).toBe(local);

    const equalTime = hydrateCloudPlanIntoIndexedDb(
      plan({ contentHash: "same", updatedAt: "2026-01-03T00:00:00.000Z" }),
      cloud,
    );
    expect(equalTime.source).toBe("local");
  });

  it("detectPlanConflict is contentHash-only", () => {
    const local = plan({
      contentHash: "local",
      updatedAt: "2026-01-02T00:00:00.000Z",
      remoteRevision: "r1",
    });
    const cloud = plan({
      contentHash: "cloud",
      updatedAt: "2026-01-04T00:00:00.000Z",
      remoteRevision: "r1",
    });
    expect(detectPlanConflict(local, cloud)).toBe(true);
    expect(
      detectPlanConflict(
        plan({ contentHash: "x", updatedAt: "2026-01-01T00:00:00.000Z" }),
        plan({ contentHash: "x", updatedAt: "2026-01-09T00:00:00.000Z" }),
      ),
    ).toBe(false);
  });

  it("resolveConflict keep-local returns local plan and clears sync error", () => {
    const local = plan({
      contentHash: "local",
      updatedAt: "2026-01-02T00:00:00.000Z",
      syncState: "conflict",
    });
    const cloud = plan({
      contentHash: "cloud",
      updatedAt: "2026-01-04T00:00:00.000Z",
      source: "cloud",
    });
    const won = resolveConflict(local, cloud, "local");
    expect(won.contentHash).toBe("local");
    expect(won.source).toBe("local");
    expect(won.syncState).toBe("idle");
    expect(won.syncErrorCode).toBeNull();
  });

  it("resolveConflict keep-cloud returns cloud plan as synced", () => {
    const local = plan({
      contentHash: "local",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "cloud",
      updatedAt: "2026-01-04T00:00:00.000Z",
      source: "cloud",
      syncState: "conflict",
    });
    const won = resolveConflict(local, cloud, "cloud");
    expect(won.contentHash).toBe("cloud");
    expect(won.source).toBe("cloud");
    expect(won.syncState).toBe("synced");
    expect(won.localSaveState).toBe("saved_local");
  });

  it("applyConflictResolution flags workspace replace only for keep-cloud", () => {
    const local = plan({
      contentHash: "local",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    const cloud = plan({
      contentHash: "cloud",
      updatedAt: "2026-01-04T00:00:00.000Z",
      source: "cloud",
    });
    const keepLocal = applyConflictResolution(local, cloud, "local");
    expect(keepLocal.choice).toBe("local");
    expect(keepLocal.plan.contentHash).toBe("local");
    expect(keepLocal.shouldReplaceWorkspaceDocument).toBe(false);

    const keepCloud = applyConflictResolution(local, cloud, "cloud");
    expect(keepCloud.choice).toBe("cloud");
    expect(keepCloud.plan.contentHash).toBe("cloud");
    expect(keepCloud.shouldReplaceWorkspaceDocument).toBe(true);
  });
});
