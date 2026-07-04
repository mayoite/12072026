import { describe, expect, it } from "vitest";
import { plannerWorldBoundsRect, clampViewportTransform, canvasUnitsToMillimeters, millimetersToCanvasUnits, clampCanvasScalar, clampCanvasPoint, clampCanvasRect, isWithinCanvasBounds, capMillimetersToCanvas, clampLayoutOrigin, capRoomEstimateMm, plannerCanvasWorldCenter } from "@/features/planner/lib/canvasBounds";

describe("canvasBounds", () => {
  it("should have function plannerWorldBoundsRect defined", () => {
    expect(plannerWorldBoundsRect).toBeTypeOf("function");
  });
  it("should have function clampViewportTransform defined", () => {
    expect(clampViewportTransform).toBeTypeOf("function");
  });
  it("should have function canvasUnitsToMillimeters defined", () => {
    expect(canvasUnitsToMillimeters).toBeTypeOf("function");
  });
  it("should have function millimetersToCanvasUnits defined", () => {
    expect(millimetersToCanvasUnits).toBeTypeOf("function");
  });
  it("should have function clampCanvasScalar defined", () => {
    expect(clampCanvasScalar).toBeTypeOf("function");
  });
  it("should have function clampCanvasPoint defined", () => {
    expect(clampCanvasPoint).toBeTypeOf("function");
  });
  it("should have function clampCanvasRect defined", () => {
    expect(clampCanvasRect).toBeTypeOf("function");
  });
  it("should have function isWithinCanvasBounds defined", () => {
    expect(isWithinCanvasBounds).toBeTypeOf("function");
  });
  it("should have function capMillimetersToCanvas defined", () => {
    expect(capMillimetersToCanvas).toBeTypeOf("function");
  });
  it("should have function clampLayoutOrigin defined", () => {
    expect(clampLayoutOrigin).toBeTypeOf("function");
  });
  it("should have function capRoomEstimateMm defined", () => {
    expect(capRoomEstimateMm).toBeTypeOf("function");
  });
  it("should have function plannerCanvasWorldCenter defined", () => {
    expect(plannerCanvasWorldCenter).toBeTypeOf("function");
  });
});