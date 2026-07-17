import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/store/history";

describe("store/history.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["dispatchPlannerTransaction","createPlannerHistory","dispatchPlannerAction","undoPlannerAction","redoPlannerAction","updatePlannerProject","beginPlannerDrag","commitPlannerDrag"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
