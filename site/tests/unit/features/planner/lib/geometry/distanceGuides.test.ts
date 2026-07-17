import { describe, expect, it } from "vitest";
import {
  aabbFromCenteredFurniture,
  closestPointOnSegment,
  computeDistanceGuides,
  furnitureEdgeGapGuide,
  wallDistanceGuide,
} from "@/features/planner/lib/geometry/distanceGuides";

describe("distanceGuides", () => {
  it("builds AABB from centered furniture", () => {
    const box = aabbFromCenteredFurniture({
      id: "a",
      cxMm: 1000,
      cyMm: 500,
      widthMm: 200,
      depthMm: 100,
    });
    expect(box).toEqual({ minX: 900, minY: 450, maxX: 1100, maxY: 550 });
  });

  it("projects closest point onto a segment", () => {
    const p = closestPointOnSegment(
      { x: 5, y: 10 },
      { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } },
    );
    expect(p.x).toBeCloseTo(5, 5);
    expect(p.y).toBeCloseTo(0, 5);
  });

  it("measures horizontal gap between furniture", () => {
    const a = { minX: 0, minY: 0, maxX: 100, maxY: 50 };
    const b = { minX: 300, minY: 0, maxX: 400, maxY: 50 };
    const guide = furnitureEdgeGapGuide(a, b, "b");
    expect(guide).not.toBeNull();
    expect(guide!.axis).toBe("x");
    expect(guide!.distanceMm).toBeCloseTo(200, 5);
    expect(guide!.from.x).toBe(100);
    expect(guide!.to.x).toBe(300);
  });

  it("measures wall clearance from furniture AABB", () => {
    const subject = { minX: 100, minY: 100, maxX: 200, maxY: 200 };
    const guide = wallDistanceGuide(subject, {
      id: "w1",
      start: { x: 0, y: 0 },
      end: { x: 500, y: 0 },
      thicknessMm: 0,
    });
    expect(guide).not.toBeNull();
    expect(guide!.kind).toBe("wall");
    expect(guide!.distanceMm).toBeCloseTo(100, 5);
  });

  it("subtracts half wall thickness from clear gap", () => {
    const subject = { minX: 100, minY: 100, maxX: 200, maxY: 200 };
    const guide = wallDistanceGuide(subject, {
      id: "w1",
      start: { x: 0, y: 0 },
      end: { x: 500, y: 0 },
      thicknessMm: 40,
    });
    expect(guide).not.toBeNull();
    expect(guide!.distanceMm).toBeCloseTo(80, 5);
  });

  it("returns nearest wall and furniture guides capped by maxGuides", () => {
    const guides = computeDistanceGuides(
      { id: "desk", cxMm: 500, cyMm: 500, widthMm: 100, depthMm: 100 },
      [
        { id: "north", start: { x: 0, y: 0 }, end: { x: 1000, y: 0 } },
        { id: "west", start: { x: 0, y: 0 }, end: { x: 0, y: 1000 } },
      ],
      [
        { id: "peer", cxMm: 800, cyMm: 500, widthMm: 100, depthMm: 100 },
        { id: "far", cxMm: 5000, cyMm: 5000, widthMm: 100, depthMm: 100 },
      ],
      { maxDistanceMm: 2000, maxGuides: 3 },
    );
    expect(guides.length).toBeGreaterThan(0);
    expect(guides.length).toBeLessThanOrEqual(3);
    expect(guides.every((g) => g.distanceMm <= 2000)).toBe(true);
    // Sorted nearest-first.
    for (let i = 1; i < guides.length; i += 1) {
      expect(guides[i]!.distanceMm).toBeGreaterThanOrEqual(guides[i - 1]!.distanceMm);
    }
    expect(guides.some((g) => g.targetId === "peer")).toBe(true);
    expect(guides.every((g) => g.targetId !== "desk")).toBe(true);
  });
});
