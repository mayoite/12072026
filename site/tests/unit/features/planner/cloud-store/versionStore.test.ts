import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_VERSIONS,
  appendSnapshot,
  deleteSnapshotsFor,
  getLatestSnapshot,
  getSnapshot,
  getSnapshotCount,
  hasVersionHistory,
  listSnapshots,
  pruneSnapshots,
  restoreSnapshot,
  updateSnapshotLabel,
} from "@/features/planner/cloud-store/versionStore";
import type { PlannerDocument } from "@/features/planner/model/plannerDocument";

vi.mock("@/features/planner/lib/newEntityId", () => {
  let n = 0;
  return { newEntityId: () => `snap-${++n}` };
});

function doc(label: string): PlannerDocument {
  return {
    version: 1,
    walls: [],
    rooms: [],
    furniture: [],
    doors: [],
    windows: [],
    meta: { name: label },
  } as unknown as PlannerDocument;
}

describe("versionStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exposes MAX_VERSIONS and empty history for new project", () => {
    expect(MAX_VERSIONS).toBe(10);
    expect(hasVersionHistory("proj-1")).toBe(false);
    expect(listSnapshots("proj-1")).toEqual([]);
    expect(getSnapshotCount("proj-1")).toBe(0);
  });

  it("appends, lists, gets, and labels snapshots", () => {
    const created = appendSnapshot("proj-1", doc("v1"), "save", "first");
    expect(created.id).toMatch(/^snap-/);
    expect(created.projectId).toBe("proj-1");
    expect(created.reason).toBe("save");
    expect(created.label).toBe("first");

    expect(hasVersionHistory("proj-1")).toBe(true);
    expect(getSnapshotCount("proj-1")).toBe(1);
    expect(listSnapshots("proj-1")).toHaveLength(1);
    expect(getSnapshot("proj-1", created.id)?.id).toBe(created.id);
    expect(getLatestSnapshot("proj-1")?.id).toBe(created.id);

    const labeled = updateSnapshotLabel("proj-1", created.id, "renamed");
    expect(labeled).toBe(true);
    expect(getSnapshot("proj-1", created.id)?.label).toBe("renamed");
  });

  it("restore returns document from snapshot", () => {
    const created = appendSnapshot("proj-1", doc("alpha"), "save");
    const restored = restoreSnapshot("proj-1", created.id);
    expect(restored).not.toBeNull();
  });

  it("prune is a no-op under MAX_VERSIONS; delete clears storage", () => {
    appendSnapshot("proj-1", doc("a"), "save");
    appendSnapshot("proj-1", doc("b"), "save");
    pruneSnapshots("proj-1");
    expect(getSnapshotCount("proj-1")).toBe(2);
    deleteSnapshotsFor("proj-1");
    expect(hasVersionHistory("proj-1")).toBe(false);
    expect(getSnapshotCount("proj-1")).toBe(0);
  });
});
