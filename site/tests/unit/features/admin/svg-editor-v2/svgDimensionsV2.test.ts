import { describe, expect, it } from "vitest";

import {
  convertDisplayToMm,
  convertMmToDisplay,
  formatDimensionValue,
} from "@/features/admin/svg-editor-v2/dimensions/svgDimensionUnits";
import {
  planDimensionChange,
  scaleSvgDocument,
} from "@/features/admin/svg-editor-v2/dimensions/scaleSvgDocument";

describe("SVG editor V2 dimensions", () => {
  it.each([
    ["mm", 1200, 1200],
    ["cm", 1200, 120],
    ["m", 1200, 1.2],
    ["in", 25.4, 1],
    ["ft", 304.8, 1],
  ] as const)("round trips decimal %s without mixed units", (unit, mm, display) => {
    expect(convertMmToDisplay(mm, unit)).toBeCloseTo(display);
    expect(convertDisplayToMm(display, unit)).toBeCloseTo(mm);
    expect(formatDimensionValue(mm, unit)).not.toMatch(/'/);
  });

  it("requires an explicit decision before width or depth changes alter artwork", () => {
    expect(planDimensionChange({
      current: { width: 1000, depth: 500, height: 740 },
      next: { width: 1200, depth: 500, height: 740 },
      decision: "cancel",
    }).action).toBe("cancel");
    expect(planDimensionChange({
      current: { width: 1000, depth: 500, height: 740 },
      next: { width: 1200, depth: 500, height: 800 },
      decision: "metadata-only",
    })).toMatchObject({ action: "metadata-only", scale: null });
  });

  it("preserves proportions and centers by default, with explicit unlocked stretching", () => {
    const svg = '<svg viewBox="0 0 100 50"><rect id="a" x="10" y="10" width="20" height="10"/></svg>';
    const proportional = scaleSvgDocument(svg, {
      current: { width: 1000, depth: 500, height: 740 },
      next: { width: 2000, depth: 1000, height: 740 },
      preserveProportions: true,
      unlockIndependentScale: false,
    });
    const stretched = scaleSvgDocument(svg, {
      current: { width: 1000, depth: 500, height: 740 },
      next: { width: 2000, depth: 500, height: 740 },
      preserveProportions: false,
      unlockIndependentScale: true,
    });

    expect(proportional.svg).toContain('transform="translate(-50 -25) scale(2 2) translate(50 25)"');
    expect(stretched.svg).toContain('scale(2 1)');
    expect(scaleSvgDocument(svg, {
      current: { width: 1000, depth: 500, height: 740 },
      next: { width: 1000, depth: 500, height: 900 },
      preserveProportions: true,
      unlockIndependentScale: false,
    }).svg).toBe(svg);
  });
});
