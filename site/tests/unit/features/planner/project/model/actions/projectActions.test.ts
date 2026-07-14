import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/model/actions/projectActions";

describe("project/model/actions/projectActions.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["activeFloorOrThrow","applyPlannerProjectAction","applyPlannerProjectTransaction","movePlannerEntity"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
