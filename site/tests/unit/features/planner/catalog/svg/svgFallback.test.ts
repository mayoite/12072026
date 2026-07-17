import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/svgFallback";

describe("catalog/svg/svgFallback.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["generateFallbackSvg"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
