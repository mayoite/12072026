import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/persistence/memberPlanRepository";

describe("project/persistence/memberPlanRepository.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["createMemberPlanRepository"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
