import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/svg/svgServerSanitizer";

describe("project/catalog/svg/svgServerSanitizer.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["sanitizeAndOptimizeSvg"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
