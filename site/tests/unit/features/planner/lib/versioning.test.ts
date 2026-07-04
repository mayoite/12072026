import { describe, expect, it } from "vitest";
import { appendSnapshot, listSnapshots, getSnapshot, restoreSnapshot, pruneSnapshots, deleteSnapshotsFor, getSnapshotCount, hasVersionHistory, getLatestSnapshot, updateSnapshotLabel, MAX_VERSIONS } from "@/features/planner/lib/versioning";

describe("versioning", () => {
  it("exposes MAX_VERSIONS", () => {
    expect(typeof MAX_VERSIONS).toBe("number");
    expect(MAX_VERSIONS).toBeGreaterThan(0);
  });
  it("should have function appendSnapshot defined", () => {
    expect(appendSnapshot).toBeTypeOf("function");
  });
  it("should have function listSnapshots defined", () => {
    expect(listSnapshots).toBeTypeOf("function");
  });
  it("should have function getSnapshot defined", () => {
    expect(getSnapshot).toBeTypeOf("function");
  });
  it("should have function restoreSnapshot defined", () => {
    expect(restoreSnapshot).toBeTypeOf("function");
  });
  it("should have function pruneSnapshots defined", () => {
    expect(pruneSnapshots).toBeTypeOf("function");
  });
  it("should have function deleteSnapshotsFor defined", () => {
    expect(deleteSnapshotsFor).toBeTypeOf("function");
  });
  it("should have function getSnapshotCount defined", () => {
    expect(getSnapshotCount).toBeTypeOf("function");
  });
  it("should have function hasVersionHistory defined", () => {
    expect(hasVersionHistory).toBeTypeOf("function");
  });
  it("should have function getLatestSnapshot defined", () => {
    expect(getLatestSnapshot).toBeTypeOf("function");
  });
  it("should have function updateSnapshotLabel defined", () => {
    expect(updateSnapshotLabel).toBeTypeOf("function");
  });
});