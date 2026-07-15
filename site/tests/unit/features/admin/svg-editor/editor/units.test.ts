import { describe, expect, it } from "vitest";

import {
  PIXELS_PER_METER,
  feetInchesToPixels,
  metersToPixels,
  parseDimensionInput,
  pixelsToDimensionString,
  pixelsToFeetInches,
  pixelsToMeters,
} from "@/features/admin/svg-editor/editor/units";

describe("admin svg editor units", () => {
  it("converts meters and pixels with non-positive guards", () => {
    expect(metersToPixels(2.5)).toBe(250);
    expect(metersToPixels(0)).toBe(0);
    expect(metersToPixels(-1)).toBe(0);
    expect(pixelsToMeters(250)).toBe(2.5);
    expect(pixelsToMeters(0)).toBe(0);
  });

  it("converts imperial feet and inches to pixels", () => {
    const px = feetInchesToPixels(8, 4);
    const totalInches = 8 * 12 + 4;
    expect(px).toBeCloseTo(totalInches * (PIXELS_PER_METER / 39.3701), 4);
    expect(feetInchesToPixels(-1, 4)).toBe(feetInchesToPixels(0, 4));
  });

  it("formats dimension strings for metric and imperial", () => {
    expect(pixelsToDimensionString(250, "metric")).toBe("2.50 m");
    expect(pixelsToDimensionString(0, "metric")).toBe("0.00 m");
    expect(pixelsToDimensionString(250, "imperial")).toMatch(/ft/);
  });

  it("parses metric and imperial user input", () => {
    expect(parseDimensionInput("2.5 m", "metric")).toBe(250);
    expect(parseDimensionInput("8ft 4.5in", "imperial")).toBe(
      feetInchesToPixels(8, 4.5),
    );
    expect(parseDimensionInput("garbage", "metric")).toBeNull();
  });

  it("round-trips feet and inches from pixels", () => {
    const { feet, inches } = pixelsToFeetInches(feetInchesToPixels(3, 6));
    expect(feet).toBe(3);
    expect(inches).toBeCloseTo(6, 1);
  });
});