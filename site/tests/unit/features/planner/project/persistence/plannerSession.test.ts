import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/persistence/plannerSession";

describe("project/persistence/plannerSession.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["PLANNER_SESSION_VERSION","buildPlannerSessionEnvelope","parsePlannerSessionSnapshot"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
