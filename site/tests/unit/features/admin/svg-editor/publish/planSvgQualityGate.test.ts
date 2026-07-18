// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  assertPlanSvgQuality,
  computeStructureSignal,
} from "@/features/admin/svg-editor/publish/planSvgQualityGate";

const SAFE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0h100v100H0z" fill="#8a8680" id="body"/></svg>';

const MULTI_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<path d="M0 0h50v50H0z" fill="#8a8680" id="seat"/>' +
  '<path d="M0 50h50v50H0z" fill="#96928c" id="back"/>' +
  "</svg>";

const DIFFERENCE_EVENODD =
  '<svg xmlns="http://www.w3.org/2000/svg" data-block-variant="difference" viewBox="0 0 100 100">' +
  '<path d="M0 0h100v100H0z M20 20h20v20H20z" fill="#8a8680" fill-rule="evenodd"/>' +
  "</svg>";

describe("assertPlanSvgQuality (hard gates)", () => {
  it("fails empty svg", () => {
    const r = assertPlanSvgQuality("   ", { slug: "demo-block" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toMatch(/empty svg for demo-block/);
  });

  it("fails fill=currentColor", () => {
    const r = assertPlanSvgQuality(
      '<svg><path fill="currentColor" d="M0 0h1v1H0z"/></svg>',
      { slug: "paint-bad" },
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toMatch(/image-unsafe paint on paint-bad/);
  });

  it("fails fill=var(", () => {
    const r = assertPlanSvgQuality(
      `<svg><path fill="var(--block-fill)" d="M0 0h1v1H0z"/></svg>`,
      { slug: "var-bad" },
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toMatch(/image-unsafe paint/);
  });

  it("passes image-safe hex fill", () => {
    const r = assertPlanSvgQuality(SAFE_SVG, {
      slug: "safe",
      partIds: ["body"],
    });
    expect(r.ok).toBe(true);
  });

  it("does not throw on hard fail (Result dialect)", () => {
    expect(() =>
      assertPlanSvgQuality("", { slug: "x" }),
    ).not.toThrow();
  });
});

describe("assertPlanSvgQuality (soft structure)", () => {
  it("warns under-structure when no multipath signals", () => {
    const single =
      '<svg><path d="M0 0h10v10H0z" fill="#8a8680"/></svg>';
    const r = assertPlanSvgQuality(single, { slug: "thin" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings?.some((w) => /under-structured/i.test(w))).toBe(true);
  });

  it("does not auto-pass solely because difference+evenodd", () => {
    const r = assertPlanSvgQuality(DIFFERENCE_EVENODD, {
      slug: "cutout",
      variant: "difference",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings?.some((w) => /difference\+evenodd is not structure/i.test(w))).toBe(
      true,
    );
  });

  it("accepts multipath ids without under-structure warning", () => {
    const r = assertPlanSvgQuality(MULTI_SVG, {
      slug: "chaise",
      partIds: ["seat", "back"],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings ?? []).toHaveLength(0);
  });

  it("uses path ids in svg as structure when partIds omitted", () => {
    const r = assertPlanSvgQuality(MULTI_SVG, { slug: "chaise" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings ?? []).toHaveLength(0);
  });

  it("does not treat bare path-count as structure", () => {
    const twoPathsNoIds =
      '<svg><path d="M0 0h1v1H0z" fill="#8a8680"/><path d="M1 1h1v1H1z" fill="#96928a"/></svg>';
    const r = assertPlanSvgQuality(twoPathsNoIds, { slug: "anon" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings?.some((w) => /under-structured/i.test(w))).toBe(true);
  });

  it("uses makerPartCount as structure signal", () => {
    const bare = '<svg><path d="M0 0h1v1H0z" fill="#8a8680"/></svg>';
    const r = assertPlanSvgQuality(bare, {
      slug: "desk",
      makerPartCount: 4,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings ?? []).toHaveLength(0);
  });
});

describe("computeStructureSignal", () => {
  it("takes max of partIds, makerPartCount, and path ids", () => {
    expect(
      computeStructureSignal(SAFE_SVG, {
        slug: "x",
        partIds: ["a", "b", "c"],
        makerPartCount: 1,
      }),
    ).toBe(3);
    expect(
      computeStructureSignal(MULTI_SVG, {
        slug: "x",
        makerPartCount: 0,
      }),
    ).toBe(2);
  });
});
