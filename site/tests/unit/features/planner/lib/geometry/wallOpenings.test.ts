import { describe, expect, it } from "vitest";
import { mmToCanvasUnits, projectPointOntoSegment, wallLength, computeWallOpenings, computeSolidSpans, findWallAttachment, doorPlanSize, windowPlanSize, rectCenterAt, MM_PER_CANVAS_UNIT } from "@/features/planner/lib/geometry/wallOpenings";

describe("wallOpenings", () => {
  it("exposes MM_PER_CANVAS_UNIT", () => {
    expect(typeof MM_PER_CANVAS_UNIT).toBe("number");
    expect(MM_PER_CANVAS_UNIT).toBeGreaterThan(0);
  });
  it("should have function mmToCanvasUnits defined", () => {
    expect(mmToCanvasUnits).toBeTypeOf("function");
  });
  it("should have function projectPointOntoSegment defined", () => {
    expect(projectPointOntoSegment).toBeTypeOf("function");
  });
  it("should have function wallLength defined", () => {
    expect(wallLength).toBeTypeOf("function");
  });
  it("should have function computeWallOpenings defined", () => {
    expect(computeWallOpenings).toBeTypeOf("function");
  });
  it("should have function computeSolidSpans defined", () => {
    expect(computeSolidSpans).toBeTypeOf("function");
  });
  it("should have function findWallAttachment defined", () => {
    expect(findWallAttachment).toBeTypeOf("function");
  });
  it("should have function doorPlanSize defined", () => {
    expect(doorPlanSize).toBeTypeOf("function");
  });
  it("should have function windowPlanSize defined", () => {
    expect(windowPlanSize).toBeTypeOf("function");
  });
  it("should have function rectCenterAt defined", () => {
    expect(rectCenterAt).toBeTypeOf("function");
  });
});