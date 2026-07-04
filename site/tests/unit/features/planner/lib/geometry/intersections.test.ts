import { describe, expect, it } from "vitest";
import { segmentsIntersect, segmentIntersection, polygonContainsPoint } from "@/features/planner/lib/geometry/intersections";

describe("intersections", () => {
  it("should have function segmentsIntersect defined", () => {
    expect(segmentsIntersect).toBeTypeOf("function");
  });
  it("should have function segmentIntersection defined", () => {
    expect(segmentIntersection).toBeTypeOf("function");
  });
  it("should have function polygonContainsPoint defined", () => {
    expect(polygonContainsPoint).toBeTypeOf("function");
  });
});