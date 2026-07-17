import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/parametricBuilder";

describe("catalog/parametricBuilder.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["resolveFurniture2DFootprint","ParametricBuilder"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
