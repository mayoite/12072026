import { describe, expect, it } from "vitest";
import {
  mmToPlannerCm,
  plannerCmToMm,
  normalizeDegrees,
  degreesToRadians,
  displayValueToMm,
  mmToDisplayValue,
  parseFeetAndInches,
  formatFeetAndInches,
  formatLengthDisplay,
  formatLengthInput,
  parseLengthInput,
  formatAreaDisplay,
  boundsMmToPlannerCm,
  boundsplannerCmToMm,
} from "@/features/planner/model/units";

describe("units", () => {
  it("converts mm/cm and normalizes degrees", () => {
    expect(mmToPlannerCm(20)).toBe(2);
    expect(plannerCmToMm(2)).toBe(20);
    expect(normalizeDegrees(-10)).toBe(350);
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  });

  it("display conversions for mm/cm/m/in", () => {
    expect(displayValueToMm(2, "mm")).toBe(2);
    expect(displayValueToMm(2, "cm")).toBe(20);
    expect(displayValueToMm(2, "m")).toBe(2000);
    expect(displayValueToMm(2, "in")).toBeCloseTo(50.8);
    expect(mmToDisplayValue(25.4, "in")).toBeCloseTo(1);
  });

  it("parses and formats feet-inches and length labels", () => {
    expect(parseFeetAndInches("5ft")).toBe(1524);
    expect(formatFeetAndInches(1524)).toMatch(/5'/);
    expect(formatLengthDisplay(1500, "mm")).toBe("1500 mm");
    expect(formatLengthDisplay(1500, "m")).toContain("m");
    expect(formatLengthInput(1500, "mm")).toBe("1500");
    expect(parseLengthInput("1500", "mm")).toBe(1500);
    expect(formatAreaDisplay(1_000_000, "mm")).toMatch(/m|mm|ft/i);
    const b = boundsMmToPlannerCm({ minX: 0, minY: 0, maxX: 100, maxY: 200 });
    expect(b.maxX).toBe(10);
    expect(boundsplannerCmToMm(b).maxY).toBe(200);
  });
});
