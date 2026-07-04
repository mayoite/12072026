import { describe, expect, it } from "vitest";
import { plannerUnitSystemToMeasurementUnit, formatMillimeters, formatFeetAndInches, formatLength, formatMeasurementInputValue, parseMeasurementInput, formatMetricFromBounds, formatDimensionPair, formatArea, getShapeMeta } from "@/features/planner/lib/measurements";

describe("measurements", () => {
  it("should have function plannerUnitSystemToMeasurementUnit defined", () => {
    expect(plannerUnitSystemToMeasurementUnit).toBeTypeOf("function");
  });
  it("should have function formatMillimeters defined", () => {
    expect(formatMillimeters).toBeTypeOf("function");
  });
  it("should have function formatFeetAndInches defined", () => {
    expect(formatFeetAndInches).toBeTypeOf("function");
  });
  it("should have function formatLength defined", () => {
    expect(formatLength).toBeTypeOf("function");
  });
  it("should have function formatMeasurementInputValue defined", () => {
    expect(formatMeasurementInputValue).toBeTypeOf("function");
  });
  it("should have function parseMeasurementInput defined", () => {
    expect(parseMeasurementInput).toBeTypeOf("function");
  });
  it("should have function formatMetricFromBounds defined", () => {
    expect(formatMetricFromBounds).toBeTypeOf("function");
  });
  it("should have function formatDimensionPair defined", () => {
    expect(formatDimensionPair).toBeTypeOf("function");
  });
  it("should have function formatArea defined", () => {
    expect(formatArea).toBeTypeOf("function");
  });
  it("should have function getShapeMeta defined", () => {
    expect(getShapeMeta).toBeTypeOf("function");
  });
});
