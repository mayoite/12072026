import { describe, expect, it } from "vitest";
import { PlannerPersistenceError } from "@/features/planner/project/persistence/persistenceErrors";

describe("persistenceErrors", () => {
  it("carries kind and message", () => {
    const err = new PlannerPersistenceError("network", "offline");
    expect(err).toBeInstanceOf(Error);
    expect(err.kind).toBe("network");
    expect(err.message).toBe("offline");
    expect(err.name).toMatch(/Persistence/i);
  });
});
