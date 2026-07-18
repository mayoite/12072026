import { describe, expect, it } from "vitest";
import {
  listSvgStages,
  listMeshGlbStages,
  stageById,
  PUBLISH_COMPILE_AUTHORITY,
  shouldPlaceModularWithGeneratedGlb,
  simpleRectPathD,
  extrudeSvgGeneratedSlug,
  parseLinearDeskFields,
  renderLinearDeskSvg,
} from "@/features/planner/asset-engine";

describe("asset-engine/index barrel", () => {
  it("re-exports stage registry", () => {
    expect(listSvgStages().length).toBeGreaterThan(0);
    expect(listMeshGlbStages().length).toBeGreaterThan(0);
    expect(stageById("svg-s1-normalize")).toBeDefined();
  });

  it("re-exports publish authority and place gate", () => {
    expect(PUBLISH_COMPILE_AUTHORITY).toBe("pipelineCore+normalize");
    expect(
      shouldPlaceModularWithGeneratedGlb({ id: "cabinet-v0" }),
    ).toBe(true);
  });

  it("re-exports extrude helpers", () => {
    expect(simpleRectPathD(100, 50)).toMatch(/M /);
    expect(
      extrudeSvgGeneratedSlug({
        profile: { kind: "rect", widthMm: 100, heightMm: 50 },
        thicknessMm: 18,
        materialColor: "#ffffff",
        id: "desk",
      }),
    ).toMatch(/desk/);
  });

  it("re-exports Plan+A parametric linear desk", () => {
    const fields = parseLinearDeskFields({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
    });
    const svg = renderLinearDeskSvg(fields);
    expect(svg).toContain('data-product-type="linear-desk"');
    expect(svg).toContain('viewBox="0 0 1600 800"');
  });
});
