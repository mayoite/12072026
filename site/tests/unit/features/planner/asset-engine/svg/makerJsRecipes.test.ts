import { describe, expect, it } from "vitest";
import {
  buildLinearDeskMakerModel,
  buildLDeskMakerModel,
  buildMakerModel,
} from "@/features/planner/asset-engine/svg/makerJsRecipes";

describe("makerJsRecipes", () => {
  it("builds linear desk viewBox with sample pedestals", () => {
    const { viewBox, model } = buildLinearDeskMakerModel({
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
      topThicknessMm: 80,
    });
    expect(viewBox).toEqual({ x: 0, y: 0, width: 1200, height: 600 });
    expect(model.models).toBeDefined();
    expect(Object.keys(model.models ?? {})).toEqual(
      expect.arrayContaining(["desk-top", "pedestal-l", "pedestal-r"]),
    );
    expect(Object.keys(model.models ?? {})).not.toContain("desk-knee-space");
  });

  it("honours pedestalInsetMm / topGap / backInset and modesty", () => {
    const withModesty = buildLinearDeskMakerModel({
      recipe: "linear-desk",
      widthMm: 1800,
      depthMm: 800,
      topThicknessMm: 120,
      pedestalWidthMm: 200,
      pedestalInsetMm: 100,
      pedestalTopGapMm: 40,
      pedestalBackInsetMm: 80,
      pedestals: true,
      modesty: true,
    });
    const ids = Object.keys(withModesty.model.models ?? {});
    expect(ids).toEqual(
      expect.arrayContaining(["desk-top", "pedestal-l", "pedestal-r", "modesty"]),
    );

    const noPed = buildLinearDeskMakerModel({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 500,
      pedestals: false,
    });
    expect(Object.keys(noPed.model.models ?? {})).toEqual(["desk-top"]);
  });

  it("builds L-desk spanning main + return", () => {
    const { viewBox } = buildLDeskMakerModel({
      recipe: "l-desk",
      widthMm: 1200,
      depthMm: 600,
      returnWidthMm: 600,
    });
    expect(viewBox.width).toBe(1200);
    expect(viewBox.height).toBe(1200);
  });

  it("dispatches via buildMakerModel", () => {
    const linear = buildMakerModel({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 500,
    });
    expect(linear.viewBox.width).toBe(900);
    expect(() =>
      buildMakerModel({
        recipe: "linear-desk",
        widthMm: 0,
        depthMm: 600,
      }),
    ).toThrow(/positive/i);
  });
});
