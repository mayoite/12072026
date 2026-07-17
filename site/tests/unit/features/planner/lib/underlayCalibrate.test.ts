import { describe, it, expect } from "vitest";
import {
  advanceUnderlayCalibratePick,
  calibrateMmPerPixel,
  calibrateMmPerPixelFromImageWidth,
  calibrateMmPerPixelFromPlanSegment,
  defaultUnderlayMmPerPixel,
  planPointToImagePixel,
  resolveUnderlayMmPerPixel,
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

  it("rejects degenerate pixel segments", () => {
    expect(
      calibrateMmPerPixel({
        pointA: { x: 0, y: 0 },
        pointB: { x: 0.5, y: 0 },
        knownLengthMm: 1000,
      }),
    ).toBeNull();
    expect(
      calibrateMmPerPixel({
        pointA: { x: 0, y: 0 },
        pointB: { x: 100, y: 0 },
        knownLengthMm: 0,
      }),
    ).toBeNull();
  });

  it("calibrates from full image width", () => {
    expect(calibrateMmPerPixelFromImageWidth(2000, 10_000)).toBe(5);
    expect(calibrateMmPerPixelFromImageWidth(0, 10_000)).toBeNull();
  });

  it("defaults room width mapping", () => {
    expect(defaultUnderlayMmPerPixel(2000, 10_000)).toBe(5);
  });

  it("resolves stored or default mm per pixel", () => {
    expect(resolveUnderlayMmPerPixel(2000, 12)).toBe(12);
    expect(resolveUnderlayMmPerPixel(2000, undefined)).toBe(5);
  });

  it("maps plan points into image pixel space", () => {
    expect(
      planPointToImagePixel(
        { x: 1000, y: 500 },
        { position: { x: 0, y: 0 }, mmPerPixel: 10, scale: 1 },
      ),
    ).toEqual({ x: 100, y: 50 });
  });

  it("calibrates from two plan-space points", () => {
    // Underlay at origin, 10 mm/px → plan segment 5000 mm is 500 px.
    // Known real length 2500 mm → 5 mm/px.
    const mpp = calibrateMmPerPixelFromPlanSegment({
      pointA: { x: 0, y: 0 },
      pointB: { x: 5000, y: 0 },
      knownLengthMm: 2500,
      underlay: {
        position: { x: 0, y: 0 },
        mmPerPixel: 10,
        scale: 1,
      },
    });
    expect(mpp).toBe(5);
  });

  it("accounts for display scale when calibrating plan segments", () => {
    // scale 2 doubles plan footprint for the same pixels.
    const mpp = calibrateMmPerPixelFromPlanSegment({
      pointA: { x: 0, y: 0 },
      pointB: { x: 10_000, y: 0 },
      knownLengthMm: 2500,
      underlay: {
        position: { x: 0, y: 0 },
        mmPerPixel: 10,
        scale: 2,
      },
    });
    expect(mpp).toBe(5);
  });

  it("advances two-click pick session", () => {
    const first = advanceUnderlayCalibratePick(
      { phase: "pick-a", knownLengthMm: 4000 },
      { x: 10, y: 20 },
    );
    expect(first).toEqual({
      kind: "need-second",
      session: {
        phase: "pick-b",
        knownLengthMm: 4000,
        pointA: { x: 10, y: 20 },
      },
    });

    const second = advanceUnderlayCalibratePick(first.session, {
      x: 110,
      y: 20,
    });
    expect(second).toEqual({
      kind: "complete",
      pointA: { x: 10, y: 20 },
      pointB: { x: 110, y: 20 },
      knownLengthMm: 4000,
    });
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
