import { describe, expect, it } from "vitest";
import {
  snapToGrid,
  layoutGridPositions,
  polygonArea,
  segmentIntersection,
  buildWallGraph,
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
    ).toBeTruthy();
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
});
