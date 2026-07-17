import { describe, expect, it } from "vitest";
import {
  snapToGrid,
  layoutGridPositions,
  polygonArea,
  segmentIntersection,
  buildWallGraph,
  rectangularRoomMetrics,
  applyOrthogonalLock,
  linearLengthMm,
} from "@/features/planner/lib/geometry";

describe("lib/geometry/index barrel", () => {
  it("re-exports snap + grid", () => {
    expect(snapToGrid({ x: 12, y: 18 }, 10)).toEqual({ x: 10, y: 20 });
    expect(layoutGridPositions(1, 100, 100)).toHaveLength(1);
  });

  it("re-exports polygon + intersection helpers", () => {
    const area = polygonArea([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);
    expect(Math.abs(area)).toBeCloseTo(100, 5);
    expect(
      segmentIntersection(
        { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } },
        { start: { x: 0, y: 10 }, end: { x: 10, y: 0 } },
      ),
    ).toBeDefined();
  });

  it("re-exports wall graph builder", () => {
    const graph = buildWallGraph([
      {
        start: { x: 0, y: 0 },
        end: { x: 1000, y: 0 },
      },
    ]);
    expect(graph.edges.size).toBeGreaterThanOrEqual(1);
  });

  it("re-exports room outline, orthogonal, and dimension helpers", () => {
    expect(rectangularRoomMetrics({ x: 0, y: 0 }, { x: 10, y: 20 }).widthMm).toBe(10);
    expect(applyOrthogonalLock({ x: 0, y: 0 }, { x: 5, y: 1 })).toEqual({ x: 5, y: 0 });
    expect(linearLengthMm({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
