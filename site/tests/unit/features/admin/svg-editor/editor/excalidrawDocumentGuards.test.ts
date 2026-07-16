import { describe, expect, it } from "vitest";
import {
  countActiveExcalidrawElements,
  isBlankExcalidrawSvg,
} from "@/features/admin/svg-editor/editor/excalidrawDocumentGuards";
import { seedFootprintExcalidrawElements } from "@/features/admin/svg-editor/editor/seedFootprintExcalidrawElements";

describe("excalidrawDocumentGuards", () => {
  it("treats empty and non-svg as blank", () => {
    expect(isBlankExcalidrawSvg("")).toBe(true);
    expect(isBlankExcalidrawSvg("not svg")).toBe(true);
  });

  it("treats Excalidraw welcome 20x20 white export as blank", () => {
    const blank =
      '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="0" y="0" width="20" height="20" fill="#ffffff"></rect></svg>';
    expect(isBlankExcalidrawSvg(blank)).toBe(true);
  });

  it("accepts svg with real geometry", () => {
    const real =
      '<svg viewBox="0 0 600 600"><rect x="10" y="10" width="200" height="100" fill="currentColor"/><rect x="40" y="40" width="80" height="40"/></svg>';
    expect(isBlankExcalidrawSvg(real)).toBe(false);
  });

  it("counts only active drawable elements", () => {
    expect(countActiveExcalidrawElements(undefined)).toBe(0);
    expect(
      countActiveExcalidrawElements([
        { type: "rectangle", isDeleted: false },
        { type: "rectangle", isDeleted: true },
        { type: "selection", isDeleted: false },
      ]),
    ).toBe(1);
  });
});

describe("seedFootprintExcalidrawElements", () => {
  it("seeds one room rectangle from mm geometry", () => {
    const elements = seedFootprintExcalidrawElements({
      widthMm: 600,
      depthMm: 600,
      heightMm: 480,
    });
    expect(elements).toHaveLength(1);
    expect(elements[0]?.type).toBe("rectangle");
    expect(elements[0]?.width).toBe(60);
    expect(elements[0]?.height).toBe(60);
  });
});
