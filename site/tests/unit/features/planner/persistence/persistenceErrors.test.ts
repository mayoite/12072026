import { describe, expect, it } from "vitest";

import { PlannerPersistenceError } from "@/features/planner/persistence/persistenceErrors";


// ---------------------------------------------------------------------------
// PlannerPersistenceError â€” class properties
// ---------------------------------------------------------------------------

describe("PlannerPersistenceError", () => {
  it("sets name to 'PlannerPersistenceError'", () => {
    const err = new PlannerPersistenceError("network", "oops");
    expect(err.name).toBe("PlannerPersistenceError");
  });

  it("preserves message", () => {
    const err = new PlannerPersistenceError("corrupt", "data is broken");
    expect(err.message).toBe("data is broken");
  });

  it("sets kind correctly", () => {
    const err = new PlannerPersistenceError("forbidden", "no access");
    expect(err.kind).toBe("forbidden");
  });

  it("preserves cause when provided", () => {
    const cause = new Error("root cause");
    const err = new PlannerPersistenceError("network", "wrap", cause);
    expect(err.cause).toBe(cause);
  });

  it("cause is undefined when not provided", () => {
    const err = new PlannerPersistenceError("not-found", "missing");
    expect(err.cause).toBeUndefined();
  });

  it("is an instance of Error", () => {
    const err = new PlannerPersistenceError("conflict", "conflict");
    expect(err).toBeInstanceOf(Error);
  });
});

// Note: mapToPersistenceError + is* type guards were removed as dead/unused per
// persistenceErrors.ts (PLAN-FAIL-0408 cleanup). Only class remains and is tested.
