import { describe, expect, it } from "vitest";
import {
  drawLinearDesk,
  renderLinearDeskSvg,
} from "@/features/planner/asset-engine/svg/parametric";
import { parseLinearDeskFields } from "@/features/planner/asset-engine/svg/parametric/linearDeskFields";

function fields(partial: {
  widthMm?: number;
  depthMm?: number;
  topThicknessMm?: number;
  pedestalCount?: 0 | 2;
  pedestalInsetMm?: number;
  pedestalTopGapMm?: number;
  pedestalBackInsetMm?: number;
  pedestalWidthMm?: number;
  modesty?: boolean;
  slug?: string;
  name?: string;
}) {
  return parseLinearDeskFields({
    type: "linear-desk",
    widthMm: partial.widthMm ?? 1600,
    depthMm: partial.depthMm ?? 800,
    topThicknessMm: partial.topThicknessMm,
    pedestalCount: partial.pedestalCount ?? 2,
    pedestalInsetMm: partial.pedestalInsetMm,
    pedestalTopGapMm: partial.pedestalTopGapMm,
    pedestalBackInsetMm: partial.pedestalBackInsetMm,
    pedestalWidthMm: partial.pedestalWidthMm,
    modesty: partial.modesty ?? false,
    slug: partial.slug,
    name: partial.name,
  });
}

describe("drawLinearDesk (Maker pen)", () => {
  it("drawLinearDesk emits multipath ids from Maker (desk-top + pedestals)", () => {
    const draw = drawLinearDesk(
      fields({ widthMm: 1600, depthMm: 800, pedestalCount: 2 }),
    );
    const ids = draw.parts.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining(["desk-top", "pedestal-l", "pedestal-r"]),
    );
    expect(draw.viewBox).toEqual({ x: 0, y: 0, width: 1600, height: 800 });
  });

  it("width change regenerates different path data", () => {
    const a = renderLinearDeskSvg(
      parseLinearDeskFields({ type: "linear-desk", widthMm: 1400, depthMm: 800 }),
    );
    const b = renderLinearDeskSvg(
      parseLinearDeskFields({ type: "linear-desk", widthMm: 1800, depthMm: 800 }),
    );
    expect(a).not.toBe(b);
    expect(a).toMatch(/viewBox="0 0 1400/);
    expect(b).toMatch(/viewBox="0 0 1800/);
  });

  it("renderLinearDeskSvg has no currentColor / var(", () => {
    const svg = renderLinearDeskSvg(
      parseLinearDeskFields({ type: "linear-desk", widthMm: 1600, depthMm: 800 }),
    );
    expect(svg).not.toMatch(/currentColor|var\s*\(/i);
  });

  it("omits pedestals when pedestalCount is 0", () => {
    const draw = drawLinearDesk(
      fields({ widthMm: 900, depthMm: 500, pedestalCount: 0 }),
    );
    const ids = draw.parts.map((p) => p.id);
    expect(ids).toEqual(["desk-top"]);
    expect(ids).not.toContain("pedestal-l");
    expect(ids).not.toContain("pedestal-r");
  });

  it("includes modesty between pedestals when requested and gap allows", () => {
    const draw = drawLinearDesk(
      fields({ widthMm: 1800, depthMm: 800, modesty: true }),
    );
    expect(draw.parts.map((p) => p.id)).toContain("modesty");
  });

  it("maps pedestalInsetMm into Maker geometry", () => {
    const tight = drawLinearDesk(
      fields({
        widthMm: 1600,
        pedestalInsetMm: 80,
        pedestalWidthMm: 200,
      }),
    );
    const wide = drawLinearDesk(
      fields({
        widthMm: 1600,
        pedestalInsetMm: 240,
        pedestalWidthMm: 200,
      }),
    );
    const leftTight = tight.parts.find((p) => p.id === "pedestal-l")?.dPath;
    const leftWide = wide.parts.find((p) => p.id === "pedestal-l")?.dPath;
    expect(leftTight).toBeDefined();
    expect(leftWide).toBeDefined();
    expect(leftTight).not.toBe(leftWide);
  });

  it("maps pedestalTopGapMm / pedestalBackInsetMm into different pedestal paths", () => {
    const a = drawLinearDesk(
      fields({
        pedestalTopGapMm: 20,
        pedestalBackInsetMm: 40,
      }),
    );
    const b = drawLinearDesk(
      fields({
        pedestalTopGapMm: 100,
        pedestalBackInsetMm: 160,
      }),
    );
    const pedA = a.parts.find((p) => p.id === "pedestal-l")?.dPath;
    const pedB = b.parts.find((p) => p.id === "pedestal-l")?.dPath;
    expect(pedA).toBeDefined();
    expect(pedB).toBeDefined();
    expect(pedA).not.toBe(pedB);
  });

  it("uses image-safe hex paints (no currentColor)", () => {
    const draw = drawLinearDesk(fields({ modesty: true, widthMm: 1800 }));
    for (const part of draw.parts) {
      if (part.fill !== "none") {
        expect(part.fill).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      }
      expect(part.stroke).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      expect(part.stroke.toLowerCase()).not.toBe("currentcolor");
    }
  });

  it("assembles multipath SVG with product type and Maker part ids", () => {
    const svg = renderLinearDeskSvg(
      fields({
        widthMm: 1600,
        depthMm: 800,
        slug: "sample-desk-param",
        name: "Sample",
      }),
    );
    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain('viewBox="0 0 1600 800"');
    expect(svg).toContain('data-product-type="linear-desk"');
    expect(svg).toContain('id="desk-top"');
    expect(svg).toContain('id="pedestal-l"');
    expect(svg).toContain('id="pedestal-r"');
    expect(svg).toContain("<title>Sample</title>");
    expect(svg).not.toMatch(/currentColor/i);
    const pathCount = (svg.match(/<path /g) ?? []).length;
    expect(pathCount).toBeGreaterThanOrEqual(3);
  });
});
