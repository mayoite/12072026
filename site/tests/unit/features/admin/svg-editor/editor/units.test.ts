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
    expect(parseDimensionInput("2.5 meters", "metric")).toBe(250);
    expect(parseDimensionInput("8ft 4.5in", "imperial")).toBe(
      feetInchesToPixels(8, 4.5),
    );
    expect(parseDimensionInput("garbage", "metric")).toBeNull();
    expect(parseDimensionInput("", "metric")).toBeNull();
    expect(parseDimensionInput("-1", "metric")).toBeNull();
  });

  it("parses imperial feet-only, inches-only, bare number, and rejects junk", () => {
    expect(parseDimensionInput("8ft", "imperial")).toBe(feetInchesToPixels(8, 0));
    expect(parseDimensionInput("8'", "imperial")).toBe(feetInchesToPixels(8, 0));
    expect(parseDimensionInput("4.5in", "imperial")).toBe(
      feetInchesToPixels(0, 4.5),
    );
    expect(parseDimensionInput('4.5"', "imperial")).toBe(
      feetInchesToPixels(0, 4.5),
    );
    expect(parseDimensionInput("8", "imperial")).toBe(feetInchesToPixels(8, 0));
    expect(parseDimensionInput("8'4.5\"", "imperial")).toBe(
      feetInchesToPixels(8, 4.5),
    );
    expect(parseDimensionInput("nope", "imperial")).toBeNull();
    expect(parseDimensionInput("-2ft", "imperial")).toBeNull();
  });

  it("formats zero and fractional imperial inches", () => {
    expect(pixelsToDimensionString(0, "imperial")).toBe("0 ft 0 in");
    expect(pixelsToFeetInches(0)).toEqual({ feet: 0, inches: 0 });
    expect(pixelsToFeetInches(-5)).toEqual({ feet: 0, inches: 0 });
    const fractional = pixelsToDimensionString(
      feetInchesToPixels(1, 1.5),
      "imperial",
    );
    expect(fractional).toMatch(/1 ft/);
    expect(fractional).toMatch(/in/);
  });

  it("round-trips feet and inches from pixels", () => {
    const { feet, inches } = pixelsToFeetInches(feetInchesToPixels(3, 6));
    expect(feet).toBe(3);
    expect(inches).toBeCloseTo(6, 1);
  });
});
