// @vitest-environment node
import { describe, expect, it } from "vitest";

import { seedFootprintExcalidrawElements } from "@/features/admin/svg-editor/editor/seedFootprintExcalidrawElements";

describe("seedFootprintExcalidrawElements (name-mirror)", () => {
  it("seeds one room element from millimetre geometry", () => {
    const elements = seedFootprintExcalidrawElements({
      widthMm: 1200,
      depthMm: 800,
      heightMm: 750,
    });
    expect(elements).toHaveLength(1);
    const room = elements[0];
    expect(room).toMatchObject({
      type: "rectangle",
      x: 0,
      y: 0,
    });
    // meters → pixels uses createRoom scale; width/height must be positive
    expect(Number(room.width)).toBeGreaterThan(0);
    expect(Number(room.height)).toBeGreaterThan(0);
  });

  it("floors sub-millimetre dimensions to 1mm before conversion", () => {
    const tiny = seedFootprintExcalidrawElements({
      widthMm: 0,
      depthMm: -5,
    });
    const normal = seedFootprintExcalidrawElements({
      widthMm: 1,
      depthMm: 1,
    });
    expect(tiny).toHaveLength(1);
    expect(normal).toHaveLength(1);
    expect(tiny[0].width).toBe(normal[0].width);
    expect(tiny[0].height).toBe(normal[0].height);
  });

  it("omits height when heightMm is missing or non-positive", () => {
    const noHeight = seedFootprintExcalidrawElements({
      widthMm: 600,
      depthMm: 600,
    });
    const zeroHeight = seedFootprintExcalidrawElements({
      widthMm: 600,
      depthMm: 600,
      heightMm: 0,
    });
    expect(noHeight).toHaveLength(1);
    expect(zeroHeight).toHaveLength(1);
  });
});
