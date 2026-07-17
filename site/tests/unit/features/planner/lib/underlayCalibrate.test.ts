import { describe, it, expect } from "vitest";
import {
  advanceUnderlayCalibratePick,
  applyUnderlayTwoPointCalibration,
  applyUnderlayWidthCalibration,
  calibrateMmPerPixel,
  calibrateMmPerPixelFromImageWidth,
  calibrateMmPerPixelFromPlanSegment,
  DEFAULT_ASSUMED_ROOM_WIDTH_MM,
  defaultUnderlayMmPerPixel,
  effectiveUnderlayMmPerPixel,
  normalizeUnderlayScale,
  planPointToImagePixel,
  resolveUnderlayDisplayScale,
  resolveUnderlayMmPerPixel,
  reviveUnderlayScaleAfterReload,
  UNDERLAY_KNOWN_WIDTH_10M_MM,
  UNDERLAY_KNOWN_WIDTH_5M_MM,
  underlayFootprintMm,
  underlayScalePersistenceFields,
  underlaySegmentLength,
} from "@/features/planner/lib/underlayCalibrate";

describe("underlayCalibrate", () => {
  it("exports 5 m / 10 m width presets", () => {
    expect(UNDERLAY_KNOWN_WIDTH_5M_MM).toBe(5_000);
    expect(UNDERLAY_KNOWN_WIDTH_10M_MM).toBe(10_000);
    expect(DEFAULT_ASSUMED_ROOM_WIDTH_MM).toBe(UNDERLAY_KNOWN_WIDTH_10M_MM);
  });

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

  it("calibrates from full image width (5 m and 10 m presets)", () => {
    expect(
      calibrateMmPerPixelFromImageWidth(2000, UNDERLAY_KNOWN_WIDTH_10M_MM),
    ).toBe(5);
    expect(
      calibrateMmPerPixelFromImageWidth(2000, UNDERLAY_KNOWN_WIDTH_5M_MM),
    ).toBe(2.5);
    expect(calibrateMmPerPixelFromImageWidth(0, 10_000)).toBeNull();
  });

  it("applyUnderlayWidthCalibration stores scale 1 for 5 m / 10 m", () => {
    expect(
      applyUnderlayWidthCalibration({
        imageWidthPx: 1000,
        knownWidthMm: UNDERLAY_KNOWN_WIDTH_10M_MM,
      }),
    ).toEqual({ mmPerPixel: 10, scale: 1 });
    expect(
      applyUnderlayWidthCalibration({
        imageWidthPx: 1000,
        knownWidthMm: UNDERLAY_KNOWN_WIDTH_5M_MM,
      }),
    ).toEqual({ mmPerPixel: 5, scale: 1 });
    expect(
      applyUnderlayWidthCalibration({ imageWidthPx: 0, knownWidthMm: 5000 }),
    ).toBeNull();
  });

  it("defaults room width mapping", () => {
    expect(defaultUnderlayMmPerPixel(2000, 10_000)).toBe(5);
    expect(defaultUnderlayMmPerPixel(2000)).toBe(5);
  });

  it("resolves stored or default mm per pixel", () => {
    expect(resolveUnderlayMmPerPixel(2000, 12)).toBe(12);
    expect(resolveUnderlayMmPerPixel(2000, undefined)).toBe(5);
    expect(resolveUnderlayDisplayScale(2)).toBe(2);
    expect(resolveUnderlayDisplayScale(undefined)).toBe(1);
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

  it("applyUnderlayTwoPointCalibration folds into mmPerPixel with scale 1", () => {
    const result = applyUnderlayTwoPointCalibration({
      pointA: { x: 0, y: 0 },
      pointB: { x: 5000, y: 0 },
      knownLengthMm: 2500,
      underlay: {
        position: { x: 0, y: 0 },
        mmPerPixel: 10,
        scale: 1,
      },
    });
    expect(result).toEqual({ mmPerPixel: 5, scale: 1 });
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

  it("computes footprint including optional display scale", () => {
    expect(
      underlayFootprintMm({
        imageWidthPx: 1000,
        imageHeightPx: 500,
        mmPerPixel: 10,
      }),
    ).toEqual({ widthMm: 10_000, depthMm: 5000 });
    expect(
      underlayFootprintMm({
        imageWidthPx: 1000,
        imageHeightPx: 500,
        mmPerPixel: 10,
        scale: 2,
      }),
    ).toEqual({ widthMm: 20_000, depthMm: 10_000 });
  });

  it("normalizes display scale into mmPerPixel without changing footprint", () => {
    const before = underlayFootprintMm({
      imageWidthPx: 800,
      imageHeightPx: 600,
      mmPerPixel: 4,
      scale: 2.5,
    });
    const normalized = normalizeUnderlayScale({ mmPerPixel: 4, scale: 2.5 });
    expect(normalized.scale).toBe(1);
    expect(normalized.mmPerPixel).toBe(effectiveUnderlayMmPerPixel(4, 2.5));
    expect(
      underlayFootprintMm({
        imageWidthPx: 800,
        imageHeightPx: 600,
        ...normalized,
      }),
    ).toEqual(before);
  });

  it("scale survives JSON reload after width calibration", () => {
    const calibrated = applyUnderlayWidthCalibration({
      imageWidthPx: 2000,
      knownWidthMm: UNDERLAY_KNOWN_WIDTH_5M_MM,
    });
    expect(calibrated).not.toBeNull();
    if (!calibrated) return;

    const persisted = underlayScalePersistenceFields({
      position: { x: 100, y: 50 },
      imageWidthPx: 2000,
      imageHeightPx: 1500,
      mmPerPixel: calibrated.mmPerPixel,
      scale: calibrated.scale,
    });

    const cloned = JSON.parse(JSON.stringify(persisted)) as typeof persisted;
    const revived = reviveUnderlayScaleAfterReload(cloned);

    expect(revived.mmPerPixel).toBe(2.5);
    expect(revived.scale).toBe(1);
    expect(revived.footprint).toEqual({
      widthMm: 5000,
      depthMm: 3750,
    });
    expect(revived.position).toEqual({ x: 100, y: 50 });
  });

  it("scale survives JSON reload after two-point calibration", () => {
    const applied = applyUnderlayTwoPointCalibration({
      pointA: { x: 0, y: 0 },
      pointB: { x: 4000, y: 0 },
      knownLengthMm: 2000,
      underlay: {
        position: { x: 0, y: 0 },
        mmPerPixel: 10,
        scale: 1,
      },
    });
    expect(applied).not.toBeNull();
    if (!applied) return;

    const persisted = underlayScalePersistenceFields({
      position: { x: 0, y: 0 },
      imageWidthPx: 1000,
      imageHeightPx: 800,
      mmPerPixel: applied.mmPerPixel,
      scale: applied.scale,
    });
    const cloned = JSON.parse(JSON.stringify(persisted)) as typeof persisted;
    const revived = reviveUnderlayScaleAfterReload(cloned);

    // 2000 mm / 400 px = 5 mm/px; footprint width = 1000 * 5 = 5000.
    expect(revived.mmPerPixel).toBe(5);
    expect(revived.footprint.widthMm).toBe(5000);
    expect(revived.footprint.depthMm).toBe(4000);
  });

  it("revives missing mmPerPixel with default 10 m width mapping", () => {
    const revived = reviveUnderlayScaleAfterReload({
      position: { x: 0, y: 0 },
      imageWidthPx: 2000,
      imageHeightPx: 1000,
    });
    expect(revived.mmPerPixel).toBe(5);
    expect(revived.footprint.widthMm).toBe(10_000);
  });
});
