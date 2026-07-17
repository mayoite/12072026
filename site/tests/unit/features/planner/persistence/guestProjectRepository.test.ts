import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/persistence/guestProjectRepository";

describe("persistence/guestProjectRepository.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["createPlannerGuestProjectRepository"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
