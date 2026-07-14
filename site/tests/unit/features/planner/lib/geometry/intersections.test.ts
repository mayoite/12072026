import { describe, expect, it } from "vitest";
import { segmentsIntersect, segmentIntersection, polygonContainsPoint } from "@/features/planner/lib/geometry/intersections";

describe("intersections", () => {
  it("should have function segmentsIntersect defined", () => {
    expect(segmentsIntersect).toBeTypeOf("function"); expect(String(segmentsIntersect)).toContain('function');
  });
  it("should have function segmentIntersection defined", () => {
    expect(segmentIntersection).toBeTypeOf("function"); expect(String(segmentIntersection)).toContain('function');
  });
  it("should have function polygonContainsPoint defined", () => {
    expect(polygonContainsPoint).toBeTypeOf("function"); expect(String(polygonContainsPoint)).toContain('function');
  });
});