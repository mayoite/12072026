import { describe, expect, it } from "vitest";

import {
  formatCanvasMeasureLabel,
  measureLabelPosition,
  snapMeasureEndPoint,
} from "@/features/planner/canvas-fabric/measureAnnotation";

describe("measureAnnotation", () => {
  it("formats distances in mm using the shared formatter", () => {
    expect(formatCanvasMeasureLabel(72.6)).toBe("726 mm");
  });

  it("formats meter-plus distances as whole millimetres (no compound m + mm)", () => {
    expect(formatCanvasMeasureLabel(132.3)).toBe("1,323 mm");
  });

  it("honours the imperial unit system", () => {
    // 132.3 canvas units * 10 = 1323 mm ~= 52 in = 4' 4"
    expect(formatCanvasMeasureLabel(132.3, "ft-in")).toBe("4' 4\"");
  });

  it("snaps to horizontal when shift is held and horizontal delta dominates", () => {
    expect(snapMeasureEndPoint(10, 20, 140, 48, true)).toEqual({ x: 140, y: 20 });
  });

  it("snaps to vertical when shift is held and vertical delta dominates", () => {
    expect(snapMeasureEndPoint(10, 20, 18, 180, true)).toEqual({ x: 10, y: 180 });
  });

  it("offsets the label from the line midpoint", () => {
    const position = measureLabelPosition(0, 0, 100, 0, 10);
    expect(position.x).toBeCloseTo(50, 5);
    expect(position.y).toBeCloseTo(10, 5);
  });
});
