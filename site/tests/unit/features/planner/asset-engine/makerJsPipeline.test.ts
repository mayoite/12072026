import { describe, expect, it } from "vitest";

import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import {
  buildLinearDeskMakerModel,
  buildLDeskMakerModel,
} from "@/features/planner/asset-engine/svg/makerJsRecipes";
import {
  compileMakerRecipeToPath,
  compileMakerRecipeToPaths,
} from "@/features/planner/asset-engine/svg/makerJsToPath";
import { normalizeDescriptorForPipeline } from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";

describe("makerJsRecipes", () => {
  it("builds linear desk with top + body rects", () => {
    const { viewBox } = buildLinearDeskMakerModel({
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
      topThicknessMm: 80,
    });
    expect(viewBox).toEqual({ x: 0, y: 0, width: 1200, height: 600 });
  });

  it("builds L-desk viewBox spanning main + return leg", () => {
    const { viewBox } = buildLDeskMakerModel({
      recipe: "l-desk",
      widthMm: 1200,
      depthMm: 600,
      returnWidthMm: 600,
    });
    expect(viewBox.width).toBe(1200);
    expect(viewBox.height).toBe(1200);
  });

  it("exports non-empty SVG path data", () => {
    const { dPath } = compileMakerRecipeToPath({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 600,
    });
    expect(dPath).toMatch(/^M /);
    expect(dPath).toContain("Z");
  });

  it("exports one path per maker sub-model for linear desk", () => {
    const { parts } = compileMakerRecipeToPaths({
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
    });
    expect(parts.length).toBeGreaterThanOrEqual(3);
    expect(parts.map((part) => part.id)).toEqual(
      expect.arrayContaining(["desk-top", "desk-body", "desk-knee-space"]),
    );
  });
});

describe("maker + pipelineCore publish", () => {
  it("normalizes maker block on descriptor", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "desk-linear-900",
      viewBox: { x: 0, y: 0, width: 900, height: 600 },
      maker: {
        recipe: "linear-desk",
        widthMm: 900,
        depthMm: 600,
      },
    });
    expect(normalized.makerRecipe).toEqual({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 600,
    });
  });

  it("compileSvgForPublish uses maker path through pipelineCore S3", async () => {
    const result = await compileSvgForPublish({
      slug: "desk-linear-1200",
      name: "Linear desk 1200",
      viewBox: { x: 0, y: 0, width: 1200, height: 600 },
      maker: {
        recipe: "linear-desk",
        widthMm: 1200,
        depthMm: 600,
      },
      themeTokens: {
        "fill-primary": "var(--color-surface-raised)",
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stages).toContain("svg-s2-maker-compile");
    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain('viewBox="0 0 1200 600"');
    expect(result.svg).toContain('class="desk-linear-1200"');
    expect(result.svg).toContain('id="desk-top"');
    expect(result.svg).toContain('id="desk-body"');
    expect(result.svg).toContain('id="desk-knee-space"');
  });
});
