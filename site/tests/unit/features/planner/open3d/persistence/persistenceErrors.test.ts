import { describe, expect, it } from "vitest";

import { Open3dPersistenceError } from "@/features/planner/open3d/persistence/persistenceErrors";


// ---------------------------------------------------------------------------
// Open3dPersistenceError â€” class properties
// ---------------------------------------------------------------------------

describe("Open3dPersistenceError", () => {
  it("sets name to 'Open3dPersistenceError'", () => {
    const err = new Open3dPersistenceError("network", "oops");
    expect(err.name).toBe("Open3dPersistenceError");
  });

  it("preserves message", () => {
    const err = new Open3dPersistenceError("corrupt", "data is broken");
    expect(err.message).toBe("data is broken");
  });

  it("sets kind correctly", () => {
    const err = new Open3dPersistenceError("forbidden", "no access");
    expect(err.kind).toBe("forbidden");
  });

  it("preserves cause when provided", () => {
    const cause = new Error("root cause");
    const err = new Open3dPersistenceError("network", "wrap", cause);
    expect(err.cause).toBe(cause);
  });

  it("cause is undefined when not provided", () => {
    const err = new Open3dPersistenceError("not-found", "missing");
    expect(err.cause).toBeUndefined();
  });

  it("is an instance of Error", () => {
    const err = new Open3dPersistenceError("conflict", "conflict");
    expect(err).toBeInstanceOf(Error);
  });
});

// Note: mapToPersistenceError + is* type guards were removed as dead/unused per
// persistenceErrors.ts (PLAN-FAIL-0408 cleanup). Only class remains and is tested.
