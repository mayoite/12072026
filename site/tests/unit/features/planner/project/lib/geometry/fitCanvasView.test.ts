import { describe, expect, it } from "vitest";
import {
  CANVAS_DEFAULT_SCALE,
  nativeCanvasScaleLimits,
  fitCanvasTransformToFloor,
} from "@/features/planner/project/lib/geometry/fitCanvasView";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

describe("fitCanvasView", () => {
  it("exposes positive default scale and min/max limits", () => {
    expect(CANVAS_DEFAULT_SCALE).toBeGreaterThan(0);
    const limits = nativeCanvasScaleLimits();
    expect(limits.min).toBeGreaterThan(0);
    expect(limits.max).toBeGreaterThan(limits.min);
  });

  it("fits rectangular floor into viewport", () => {
    const project = createRectangularRoomProject({ widthMm: 6000, depthMm: 4000 });
    const floor = project.floors[0]!;
    const t = fitCanvasTransformToFloor(floor, 800, 600);
    expect(t.scale).toBeGreaterThan(0);
    expect(Number.isFinite(t.origin.x)).toBe(true);
    expect(Number.isFinite(t.origin.y)).toBe(true);
  });
});
