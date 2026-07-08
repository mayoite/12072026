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
    expect(resolveBooleanVariant("union", 5)).toBe("union");
    expect(resolveBooleanVariant("difference", 1)).toBe("difference");
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
    expect(() => normalizeDescriptorForPipeline({ viewBox: { x: 0, y: 0, width: 1, height: 1 } })).toThrow(
      /slug/i,
    );
  });
});
