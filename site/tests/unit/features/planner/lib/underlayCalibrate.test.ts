import { describe, it, expect } from "vitest";
import {
  calibrateMmPerPixel,
  defaultUnderlayMmPerPixel,
  underlayFootprintMm,
  underlaySegmentLength,
} from "@/features/planner/lib/underlayCalibrate";

describe("underlayCalibrate", () => {
  it("measures segment length", () => {
    expect(underlaySegmentLength({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("calibrates mm per pixel from known distance", () => {
    const mpp = calibrateMmPerPixel({
      pointA: { x: 0, y: 0 },
      pointB: { x: 100, y: 0 },
      knownLengthMm: 5000,
    });
    expect(mpp).toBe(50);
  });

  it("defaults room width mapping", () => {
    expect(defaultUnderlayMmPerPixel(2000, 10_000)).toBe(5);
  });

  it("computes footprint", () => {
    expect(
      underlayFootprintMm({
        imageWidthPx: 1000,
        imageHeightPx: 500,
        mmPerPixel: 10,
      }),
    ).toEqual({ widthMm: 10_000, depthMm: 5000 });
  });
});
