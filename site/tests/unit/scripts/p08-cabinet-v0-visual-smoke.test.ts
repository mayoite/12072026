// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  DOOR_THICKNESS_MM,
  buildParts,
  options,
  project,
  renderSvg,
} from "../../../scripts/p08-cabinet-v0-visual-smoke.mjs";

describe("p08-cabinet-v0-visual-smoke (name-mirror)", () => {
  it("locks W7 toe/door constants and SKU options", () => {
    expect(TOE_HEIGHT_MM).toBe(100);
    expect(TOE_INSET_MM).toBe(50);
    expect(DOOR_THICKNESS_MM).toBe(18);
    expect(options).toMatchObject({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
    });
  });

  it("builds toe, carcass, door-slab with height integrity", () => {
    const parts = buildParts();
    expect(parts.map((p: { name: string }) => p.name)).toEqual([
      "toe",
      "carcass",
      "door-slab",
    ]);
    const toe = parts[0];
    const carcass = parts[1];
    const spanM = toe.sizeM.y + carcass.sizeM.y;
    expect(spanM).toBeCloseTo(options.heightMm * 0.001, 6);
    expect(toe.sizeM.z).toBeCloseTo((options.depthMm - TOE_INSET_MM) * 0.001, 6);
  });

  it("projects side and three-quarter views and renders SVG labels", () => {
    const side = project(0, 0.3, 0.2, "side", 720, 540, 380);
    const tq = project(0.1, 0.3, 0.2, "three-quarter", 720, 540, 320);
    expect(side.sx).toBeGreaterThan(0);
    expect(tq.sy).toBeLessThan(540);
    const svg = renderSvg(buildParts(), "three-quarter");
    expect(svg).toContain("<svg");
    expect(svg).toContain("toe");
    expect(svg).toContain("carcass");
    expect(svg).toContain("door-slab");
    expect(svg).toContain("TOE_HEIGHT_MM=100");
  });
});
