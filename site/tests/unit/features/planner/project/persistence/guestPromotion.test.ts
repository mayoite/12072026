import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/persistence/guestPromotion";

describe("project/persistence/guestPromotion.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["promoteGuestSession"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
