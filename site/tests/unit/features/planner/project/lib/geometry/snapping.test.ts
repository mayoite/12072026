import { describe, expect, it } from "vitest";
import {
  projectToScreen,
  screenToProject,
  zoomTransformAt,
  snapDrawingPoint,
} from "@/features/planner/project/lib/geometry/snapping";

const identity = { origin: { x: 0, y: 0 }, scale: 1 };

describe("snapping", () => {
  it("round-trips project ↔ screen at identity transform", () => {
    const screen = projectToScreen({ x: 100, y: 200 }, identity);
    expect(screen).toEqual({ x: 100, y: 200 });
    const back = screenToProject(screen, identity);
    expect(back).toEqual({ x: 100, y: 200 });
  });

  it("zooms about a focal point and snaps to grid/endpoint", () => {
    const zoomed = zoomTransformAt(identity, { x: 100, y: 100 }, 2);
    expect(zoomed.scale).toBe(2);
    expect(
      snapDrawingPoint({
        raw: { x: 106, y: 104 },
        endpoints: [],
        start: null,
        zoom: 1,
        suppress: false,
      }).kind,
    ).toBe("grid");
    expect(
      snapDrawingPoint({
        raw: { x: 106, y: 104 },
        endpoints: [{ x: 105, y: 105 }],
        start: null,
        zoom: 1,
        suppress: false,
      }).kind,
    ).toBe("endpoint");
  });
});
