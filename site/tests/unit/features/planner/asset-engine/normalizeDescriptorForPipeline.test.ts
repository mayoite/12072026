import { describe, expect, it } from "vitest";
import {
  normalizeDescriptorForPipeline,
  resolveBooleanVariant,
} from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";

describe("normalizeDescriptorForPipeline (SVG S1)", () => {
  it("maps blocks[].depth to height and fixed multi-block to difference", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "side-table-001",
      variant: "fixed",
      viewBox: { x: 0, y: 0, width: 600, height: 600 },
      blocks: [
        { id: "tabletop", x: 0, y: 0, width: 600, depth: 600 },
        { id: "cut", x: 25, y: 25, width: 50, depth: 50 },
      ],
    });

    expect(normalized.variant).toBe("difference");
    expect(normalized.blocks).toHaveLength(2);
    expect(normalized.blocks[0]).toMatchObject({
      width: 600,
      height: 600,
    });
    expect(normalized.blocks[1]).toMatchObject({ height: 50 });
  });

  it("keeps explicit boolean variant", () => {
    const five = Array.from({ length: 5 }, (_, i) => ({
      x: i,
      y: 0,
      width: 10,
      height: 10,
    }));
    const pair = [
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 1, y: 1, width: 2, height: 2 },
    ];
    expect(resolveBooleanVariant("union", five)).toBe("union");
    expect(resolveBooleanVariant("difference", [{ x: 0, y: 0, width: 1, height: 1 }])).toBe(
      "difference",
    );
    expect(resolveBooleanVariant("intersection", pair)).toBe("intersection");
    expect(resolveBooleanVariant("xor", pair)).toBe("xor");
  });

  it("fixed multi-block chaise-like parts → union (not cutout difference)", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "chaise-lounge-001",
      variant: "fixed",
      viewBox: { x: 0, y: 0, width: 800, height: 1600 },
      blocks: [
        { id: "seat-block", x: 0, y: 400, width: 800, depth: 1200 },
        { id: "backrest-block", x: 0, y: 0, width: 800, depth: 420 },
      ],
    });
    expect(normalized.variant).toBe("union");
  });

  it("single block fixed → union", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "box-001",
      variant: "fixed",
      viewBox: { x: 0, y: 0, width: 100, height: 80 },
      blocks: [{ x: 0, y: 0, width: 100, depth: 80 }],
    });
    expect(normalized.variant).toBe("union");
  });

  it("synthesizes block from geometry when blocks empty", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "geom-only",
      viewBox: { x: 0, y: 0, width: 200, height: 100 },
      geometry: { widthMm: 200, depthMm: 100, heightMm: 50 },
    });
    expect(normalized.blocks).toHaveLength(1);
    expect(normalized.blocks[0]).toMatchObject({ width: 200, height: 100 });
  });

  it("throws without slug", () => {
    expect(() =>
      normalizeDescriptorForPipeline({
        viewBox: { x: 0, y: 0, width: 1, height: 1 },
      }),
    ).toThrow(/slug/i);
  });

  it("throws on non-object root", () => {
    expect(() => normalizeDescriptorForPipeline(null)).toThrow(/object/i);
    expect(() => normalizeDescriptorForPipeline("slug-only")).toThrow(
      /object/i,
    );
    expect(() => normalizeDescriptorForPipeline(42)).toThrow(/object/i);
    expect(() => normalizeDescriptorForPipeline([])).toThrow(/object/i);
  });

  it("throws on whitespace-only slug", () => {
    expect(() =>
      normalizeDescriptorForPipeline({
        slug: "   ",
        viewBox: { x: 0, y: 0, width: 10, height: 10 },
      }),
    ).toThrow(/slug/i);
  });

  it("trims slug and passes name / description / themeTokens", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "  trim-me  ",
      name: "Trim Me",
      description: "desc",
      variant: "union",
      viewBox: { x: 0, y: 0, width: 40, height: 30 },
      blocks: [{ x: 0, y: 0, width: 40, height: 30 }],
      themeTokens: { fill: "var(--accent)", stroke: undefined },
    });
    expect(normalized.slug).toBe("trim-me");
    expect(normalized.name).toBe("Trim Me");
    expect(normalized.description).toBe("desc");
    expect(normalized.themeTokens).toEqual({
      fill: "var(--accent)",
      stroke: undefined,
    });
  });

  it("prefers height over depth when both present on a block", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "height-wins",
      variant: "union",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      blocks: [{ x: 1, y: 2, width: 10, height: 20, depth: 99 }],
    });
    expect(normalized.blocks[0]).toMatchObject({
      x: 1,
      y: 2,
      width: 10,
      height: 20,
    });
  });

  it("accepts numeric strings for block coordinates", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "string-nums",
      variant: "union",
      viewBox: { x: "0", y: "0", width: "50", height: "40" },
      blocks: [{ x: "5", y: "6", width: "10", height: "12", id: "b1" }],
    });
    expect(normalized.viewBox).toEqual({ x: 0, y: 0, width: 50, height: 40 });
    expect(normalized.blocks[0]).toEqual({
      x: 5,
      y: 6,
      width: 10,
      height: 12,
      id: "b1",
    });
  });

  it("filters invalid blocks (non-object, missing dims, zero/negative size)", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "filter-blocks",
      variant: "fixed",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      blocks: [
        null,
        "nope",
        { x: 0, y: 0, width: 10 }, // missing height/depth
        { x: 0, y: 0, width: 0, height: 10 },
        { x: 0, y: 0, width: 10, height: -5 },
        { x: 0, y: 0, width: 40, depth: 30, id: "ok" },
      ],
    });
    expect(normalized.blocks).toHaveLength(1);
    expect(normalized.blocks[0]).toMatchObject({
      id: "ok",
      width: 40,
      height: 30,
    });
    expect(normalized.variant).toBe("union");
  });

  it("synthesizes from dimensions when geometry and blocks absent", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "dims-only",
      dimensions: { widthMm: 320, depthMm: 180 },
    });
    expect(normalized.viewBox.width).toBe(320);
    expect(normalized.viewBox.height).toBe(180);
    expect(normalized.blocks).toHaveLength(1);
    expect(normalized.blocks[0]).toMatchObject({ width: 320, height: 180 });
  });

  it("defaults viewBox to 100×100 when no viewBox/geometry/dimensions", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "defaults",
      blocks: [],
    });
    expect(normalized.viewBox).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    expect(normalized.blocks[0]).toMatchObject({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  });

  it("maps product labels fixed/configurable/parametric via block count", () => {
    const multi = normalizeDescriptorForPipeline({
      slug: "multi-fixed",
      variant: "configurable",
      viewBox: { x: 0, y: 0, width: 10, height: 10 },
      blocks: [
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 1, y: 1, width: 2, height: 2 },
      ],
    });
    expect(multi.variant).toBe("difference");

    const single = normalizeDescriptorForPipeline({
      slug: "single-param",
      variant: "parametric",
      viewBox: { x: 0, y: 0, width: 10, height: 10 },
      blocks: [{ x: 0, y: 0, width: 10, height: 10 }],
    });
    expect(single.variant).toBe("union");
  });

  it("preserves explicit pipeline boolean variants on the descriptor", () => {
    for (const variant of ["union", "intersection", "difference", "xor"] as const) {
      const normalized = normalizeDescriptorForPipeline({
        slug: `v-${variant}`,
        variant,
        viewBox: { x: 0, y: 0, width: 8, height: 8 },
        blocks: [
          { x: 0, y: 0, width: 8, height: 8 },
          { x: 1, y: 1, width: 2, height: 2 },
        ],
      });
      expect(normalized.variant).toBe(variant);
    }
  });

  it("clamps non-positive viewBox extents to at least 1", () => {
    const normalized = normalizeDescriptorForPipeline({
      slug: "clamp-vb",
      viewBox: { x: 0, y: 0, width: 0, height: -3 },
      blocks: [{ x: 0, y: 0, width: 5, height: 5 }],
    });
    expect(normalized.viewBox.width).toBe(1);
    expect(normalized.viewBox.height).toBe(1);
  });
});
