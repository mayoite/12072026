import { describe, expect, it } from "vitest";
import {
  projectToScreen,
  screenToProject,
  zoomTransformAt,
  snapDrawingPoint,
  buildSegmentSnapTargets,
} from "@/features/planner/lib/geometry/snapping";

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

  it("supports a 90 degree orthogonal lock", () => {
    const snapped = snapDrawingPoint({
      raw: { x: 900, y: 300 },
      endpoints: [],
      start: { x: 0, y: 0 },
      zoom: 1,
      suppress: false,
      gridMm: 100,
      angleIncrementDegrees: 90,
    });
    expect(snapped.kind).toBe("angle");
    expect(snapped.point.y).toBeCloseTo(0, 6);
    expect(snapped.point.x).toBeGreaterThan(0);
  });

  it("builds endpoint, midpoint, intersection, perpendicular, and nearest targets", () => {
    const targets = buildSegmentSnapTargets(
      [
        { id: "horizontal", start: { x: 0, y: 0 }, end: { x: 1000, y: 0 } },
        { id: "vertical", start: { x: 500, y: -500 }, end: { x: 500, y: 500 } },
      ],
      { x: 510, y: 40 },
      { x: 250, y: 300 },
    );
    const kinds = new Set(targets.map((target) => target.kind));
    expect(kinds).toEqual(
      new Set(["endpoint", "midpoint", "intersection", "perpendicular", "nearest"]),
    );
    expect(targets.some((target) => target.point.x === 500 && target.point.y === 0)).toBe(true);
  });
});
