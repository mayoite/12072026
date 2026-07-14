import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/furnitureBlock2D";

describe("project/catalog/furnitureBlock2D.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["workstationBlock2DFromItem","plannerLikeBuddyCatalogItem","furnitureBlock2DFromItem","furnitureBlockUsesCenteredPath"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
