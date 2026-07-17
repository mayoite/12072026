import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/svgFixtureGallery";

describe("catalog/svg/svgFixtureGallery.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["buildSvgFixtureGallery"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
