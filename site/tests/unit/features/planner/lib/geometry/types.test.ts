import { describe, expect, it } from "vitest";
import type {
  Point2D,
  Segment,
  Polygon,
  BoundingBox,
} from "@/features/planner/lib/geometry/types";

describe("lib/geometry/types", () => {
  it("accepts geometry domain shapes", () => {
    const p: Point2D = { x: 1, y: 2 };
    const s: Segment = { start: p, end: { x: 3, y: 4 } };
    const poly: Polygon = { vertices: [p, s.end, { x: 0, y: 4 }] };
    const box: BoundingBox = { minX: 0, minY: 0, maxX: 3, maxY: 4 };
    expect(poly.vertices).toHaveLength(3);
    expect(box.maxX).toBe(3);
  });
});
