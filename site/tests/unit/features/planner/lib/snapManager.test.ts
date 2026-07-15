import { describe, expect, it } from "vitest";
import * as Module from "@/features/planner/lib/snapManager";

describe("snapManager", () => {
  it("should import successfully", () => {
    expect(Module).toBeDefined();
    expect(Object.keys(Module).length).toBeGreaterThan(0);
  });
});