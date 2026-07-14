import { describe, expect, it } from "vitest";
import {
  compileMakerRecipeToPath,
  compileMakerRecipeToPaths,
} from "@/features/planner/asset-engine/svg/makerJsToPath";

describe("makerJsToPath", () => {
  it("exports non-empty SVG path data for linear desk", () => {
    const { dPath, viewBox } = compileMakerRecipeToPath({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 600,
    });
    expect(dPath.length).toBeGreaterThan(5);
    expect(viewBox.width).toBe(900);
  });

  it("exports multipath parts", () => {
    const { parts } = compileMakerRecipeToPaths({
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
    });
    expect(parts.length).toBeGreaterThanOrEqual(3);
    expect(parts.map((p) => p.id)).toEqual(
      expect.arrayContaining(["desk-top", "desk-body", "desk-knee-space"]),
    );
  });

  it("compiles L-desk path", () => {
    const { dPath } = compileMakerRecipeToPath({
      recipe: "l-desk",
      widthMm: 1200,
      depthMm: 600,
      returnWidthMm: 500,
    });
    expect(dPath.length).toBeGreaterThan(5);
  });
});
