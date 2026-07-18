import { describe, expect, it } from "vitest";
import { parseLinearDeskFields } from "@/features/planner/asset-engine/svg/parametric/linearDeskFields";
import {
  drawLinearDeskFromTemplate,
  linearDeskPartsToSvg,
  renderLinearDeskSvg,
} from "@/features/planner/asset-engine/svg/parametric/drawLinearDeskFromTemplate";

function fields(partial: {
  widthMm?: number;
  depthMm?: number;
  pedestalCount?: 0 | 2;
  modesty?: boolean;
  slug?: string;
  name?: string;
}) {
  return parseLinearDeskFields({
    type: "linear-desk",
    widthMm: partial.widthMm ?? 1600,
    depthMm: partial.depthMm ?? 800,
    pedestalCount: partial.pedestalCount ?? 2,
    modesty: partial.modesty ?? false,
    slug: partial.slug,
    name: partial.name,
  });
}

describe("drawLinearDeskFromTemplate", () => {
  it("draws frame + top + dual pedestals with viewBox = W×D", () => {
    const draw = drawLinearDeskFromTemplate(fields({ widthMm: 1600, depthMm: 800 }));
    expect(draw.viewBox).toEqual({ x: 0, y: 0, width: 1600, height: 800 });
    const ids = draw.parts.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining(["frame", "desk-top", "pedestal-l", "pedestal-r"]),
    );
    expect(ids).not.toContain("modesty");
    expect(draw.parts.length).toBeGreaterThanOrEqual(3);
  });

  it("changes path geometry when width changes 1400 → 1800", () => {
    const a = drawLinearDeskFromTemplate(fields({ widthMm: 1400 }));
    const b = drawLinearDeskFromTemplate(fields({ widthMm: 1800 }));
    expect(a.viewBox.width).toBe(1400);
    expect(b.viewBox.width).toBe(1800);
    const topA = a.parts.find((p) => p.id === "desk-top")?.dPath;
    const topB = b.parts.find((p) => p.id === "desk-top")?.dPath;
    expect(topA).toBeDefined();
    expect(topB).toBeDefined();
    expect(topA).not.toBe(topB);
    // inset top width for 1800 mm (frameInset 36) → L 1764
    expect(topB).toContain("1764");
    expect(topA).not.toContain("1764");
  });

  it("omits pedestals when pedestalCount is 0", () => {
    const draw = drawLinearDeskFromTemplate(
      fields({ widthMm: 900, depthMm: 500, pedestalCount: 0 }),
    );
    const ids = draw.parts.map((p) => p.id);
    expect(ids).toEqual(["frame", "desk-top"]);
    expect(ids).not.toContain("pedestal-l");
    expect(ids).not.toContain("pedestal-r");
  });

  it("includes modesty between pedestals when requested and gap allows", () => {
    const draw = drawLinearDeskFromTemplate(
      fields({ widthMm: 1800, depthMm: 800, modesty: true }),
    );
    expect(draw.parts.map((p) => p.id)).toContain("modesty");
  });

  it("uses image-safe hex paints (no currentColor)", () => {
    const draw = drawLinearDeskFromTemplate(fields({}));
    for (const part of draw.parts) {
      if (part.fill !== "none") {
        expect(part.fill).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      }
      expect(part.stroke).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      expect(part.stroke.toLowerCase()).not.toBe("currentcolor");
    }
  });
});

describe("linearDeskPartsToSvg / renderLinearDeskSvg", () => {
  it("assembles SVG with viewBox, multipath, and product type", () => {
    const svg = renderLinearDeskSvg(
      fields({ widthMm: 1600, depthMm: 800, slug: "sample-desk-param", name: "Sample" }),
    );
    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain('viewBox="0 0 1600 800"');
    expect(svg).toContain('data-product-type="linear-desk"');
    expect(svg).toContain('id="frame"');
    expect(svg).toContain('id="desk-top"');
    expect(svg).toContain('id="pedestal-l"');
    expect(svg).toContain('id="pedestal-r"');
    expect(svg).not.toMatch(/currentColor/i);
    expect(svg).toContain("<title>Sample</title>");
  });

  it("escapes title XML special characters", () => {
    const draw = drawLinearDeskFromTemplate(
      fields({ name: 'A & B <desk>"x"', slug: "ab-desk" }),
    );
    const svg = linearDeskPartsToSvg(draw, { title: 'A & B <desk>"x"' });
    expect(svg).toContain("&amp;");
    expect(svg).toContain("&lt;");
    expect(svg).toContain("&quot;");
    expect(svg).not.toContain("<desk>");
  });

  it("counts ≥3 paths for dual pedestals", () => {
    const draw = drawLinearDeskFromTemplate(fields({ pedestalCount: 2 }));
    expect(draw.parts.length).toBeGreaterThanOrEqual(3);
    const svg = linearDeskPartsToSvg(draw);
    const pathCount = (svg.match(/<path /g) ?? []).length;
    expect(pathCount).toBeGreaterThanOrEqual(3);
  });
});
