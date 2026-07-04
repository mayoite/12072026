import { describe, expect, it } from "vitest";
import { polygonArea, polygonPerimeter, polygonCentroid, boundingBox } from "@/features/planner/lib/geometry/polygon";

describe("polygon", () => {
  it("should have function polygonArea defined", () => {
    expect(polygonArea).toBeTypeOf("function");
  });
  it("should have function polygonPerimeter defined", () => {
    expect(polygonPerimeter).toBeTypeOf("function");
  });
  it("should have function polygonCentroid defined", () => {
    expect(polygonCentroid).toBeTypeOf("function");
  });
  it("should have function boundingBox defined", () => {
    expect(boundingBox).toBeTypeOf("function");
  });
});