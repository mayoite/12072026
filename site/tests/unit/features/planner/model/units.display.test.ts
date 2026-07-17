import { describe, expect, it } from "vitest";
import {
  formatAngleDisplay,
  formatAreaDisplay,
  formatFootprintDisplay,
  formatLengthDisplay,
  formatLengthInput,
  formatQuantityDisplay,
  PLANNER_PRECISION,
  parseLengthInput,
} from "@/features/planner/model/units";

describe("display unit conversion (canonical mm)", () => {
  it("formats mm / m / ft-in for labels", () => {
    expect(formatLengthDisplay(2032, "mm")).toBe("2032 mm");
    expect(formatLengthDisplay(2000, "m")).toBe("2 m");
    expect(formatLengthDisplay(2032, "ft-in")).toBe(`6' 8"`);
  });

  it("round-trips numeric units through input format/parse", () => {
    const cases: Array<{ mm: number; unit: "mm" | "cm" | "m" | "in" }> = [
      { mm: 1200, unit: "mm" },
      { mm: 1200, unit: "cm" },
      { mm: 2500, unit: "m" },
      { mm: 2540, unit: "in" },
    ];
    for (const { mm, unit } of cases) {
      const shown = formatLengthInput(mm, unit);
      const back = parseLengthInput(shown, unit);
      expect(back).not.toBeNull();
      expect(Math.abs((back as number) - mm)).toBeLessThanOrEqual(1);
    }
  });

  it("parses feet-inches and bare inches in ft-in mode", () => {
    expect(parseLengthInput(`6' 8"`, "ft-in")).toBe(2032);
    expect(parseLengthInput("80", "ft-in")).toBe(2032);
  });

  it("accepts unit suffixes when parsing metric", () => {
    expect(parseLengthInput("1.2 m", "m")).toBe(1200);
    expect(parseLengthInput("120 cm", "cm")).toBe(1200);
    expect(parseLengthInput("1200 mm", "mm")).toBe(1200);
  });

  it("honors explicit unit suffixes even when display unit differs", () => {
    // Regression: suffix used to be stripped then value re-scaled by display unit.
    expect(parseLengthInput("1200 mm", "cm")).toBe(1200);
    expect(parseLengthInput("120 cm", "mm")).toBe(1200);
    expect(parseLengthInput("1.2 m", "cm")).toBe(1200);
    expect(parseLengthInput("2 in", "mm")).toBeCloseTo(50.8);
    expect(parseLengthInput("1 ft", "mm")).toBeCloseTo(304.8);
    // Bare number still uses active display unit.
    expect(parseLengthInput("120", "cm")).toBe(1200);
    expect(parseLengthInput("1200", "mm")).toBe(1200);
  });

  it("preserves canonical sub-millimetre precision while display rounds", () => {
    expect(parseLengthInput("0.01", "in")).toBeCloseTo(0.254, 6);
    expect(parseLengthInput("0.125", "mm")).toBe(0.125);
    expect(formatLengthInput(0.125, "mm")).toBe("0.13");
    expect(PLANNER_PRECISION.linearFractionDigits.mm).toBe(2);
  });

  it("defines angular and quantity display precision", () => {
    expect(formatAngleDisplay(450.04)).toBe("90°");
    expect(formatAngleDisplay(-10.25)).toBe("349.8°");
    expect(formatQuantityDisplay(4.4)).toBe("4");
  });

  it("formats footprint and area in the active unit", () => {
    expect(formatFootprintDisplay(1200, 600, "cm")).toBe("120 cm × 60 cm");
    expect(formatAreaDisplay(12_000_000, "mm")).toBe("12 m²");
    expect(formatAreaDisplay(9_290_304, "ft-in")).toBe("100 sq ft");
  });
});
