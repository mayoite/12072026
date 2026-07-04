import { describe, expect, it } from "vitest";

import {
  formatArea,
  formatDimensionPair,
  formatFeetAndInches,
  formatLength,
  formatMeasurementInputValue,
  formatMetricFromBounds,
  formatMillimeters,
  getShapeMeta,
  parseMeasurementInput,
  plannerUnitSystemToMeasurementUnit,
} from "@/features/planner/lib/measurements";

describe("planner measurements", () => {
  it("formats imperial values to the nearest inch", () => {
    expect(formatFeetAndInches(2032)).toBe(`6' 8"`);
  });

  it("round-trips displayed imperial values back to canonical millimeters", () => {
    const formatted = formatMeasurementInputValue(2438, "ft-in");

    expect(formatted).toBe(`8' 0"`);
    expect(parseMeasurementInput(formatted, "ft-in")).toBe(2438);
  });

  it("parses imperial inspector inputs in supported formats", () => {
    expect(parseMeasurementInput(`6' 8"`, "ft-in")).toBe(2032);
    expect(parseMeasurementInput("6 8", "ft-in")).toBe(2032);
    expect(parseMeasurementInput('80"', "ft-in")).toBe(2032);
  });

  it("parses metric inspector inputs and rejects invalid measurements", () => {
    expect(parseMeasurementInput("1,200 mm", "mm")).toBe(1200);
    expect(parseMeasurementInput("0", "mm")).toBeNull();
    expect(parseMeasurementInput("-40", "mm")).toBeNull();
    expect(parseMeasurementInput("desk", "ft-in")).toBeNull();
    expect(parseMeasurementInput("", "mm")).toBeNull();
    expect(parseMeasurementInput("5 ft 6 in", "ft-in")).toBe(1676);
  });

  it("formats lengths, areas, and unit-system conversions", () => {
    expect(formatMillimeters(1200)).toBe("1,200 mm");
    expect(formatLength(1200, "mm")).toBe("1,200 mm");
    expect(formatLength(2438, "ft-in")).toBe(`8' 0"`);
    expect(parseMeasurementInput(`5'`, "ft-in")).toBe(1524);
    expect(formatDimensionPair(1200, 800, "mm")).toContain("1,200 mm");
    expect(formatArea(1_000_000, "mm")).toBe("1.0 m2");
    expect(formatArea(92_903.04, "ft-in")).toBe("1.0 sq ft");
    expect(formatMetricFromBounds({ w: 120, h: 80 }, "mm")).toBe("W 1,200 mm x H 800 mm");
    expect(plannerUnitSystemToMeasurementUnit("imperial")).toBe("ft-in");
    expect(plannerUnitSystemToMeasurementUnit("metric")).toBe("mm");
  });

  it("reads shape metadata safely", () => {
    expect(getShapeMeta({ text: "Desk" }).text).toBe("Desk");
    expect(getShapeMeta(null)).toEqual({});
  });
});
