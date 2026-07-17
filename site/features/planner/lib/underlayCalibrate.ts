/**
 * Underlay scale calibration pure helpers.
 * Two plan points + known real-world distance → mm per image pixel scale factor.
 */

export type UnderlayPoint = { x: number; y: number };

export type UnderlayCalibratePickSession =
  | { phase: "pick-a"; knownLengthMm: number }
  | { phase: "pick-b"; knownLengthMm: number; pointA: UnderlayPoint };

export type UnderlayCalibratePickResult =
  | { kind: "need-second"; session: Extract<UnderlayCalibratePickSession, { phase: "pick-b" }> }
  | {
      kind: "complete";
      pointA: UnderlayPoint;
      pointB: UnderlayPoint;
      knownLengthMm: number;
    };

/**
 * Distance between two points in the same unit system (px or mm).
 */
export function underlaySegmentLength(a: UnderlayPoint, b: UnderlayPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Compute mm-per-pixel from a measured pixel segment and known millimetre length.
 * Returns null when inputs are non-finite or segment is too short.
 */
export function calibrateMmPerPixel(input: {
  pointA: UnderlayPoint;
  pointB: UnderlayPoint;
  knownLengthMm: number;
}): number | null {
  const pixelLength = underlaySegmentLength(input.pointA, input.pointB);
  if (!Number.isFinite(pixelLength) || pixelLength < 1) return null;
  if (!Number.isFinite(input.knownLengthMm) || input.knownLengthMm <= 0) return null;
  return input.knownLengthMm / pixelLength;
}

/**
 * Map full image width (px) to a known real width (mm).
 */
export function calibrateMmPerPixelFromImageWidth(
  imageWidthPx: number,
  knownWidthMm: number,
): number | null {
  if (!Number.isFinite(imageWidthPx) || imageWidthPx < 1) return null;
  if (!Number.isFinite(knownWidthMm) || knownWidthMm <= 0) return null;
  return knownWidthMm / imageWidthPx;
}

/**
 * Default underlay scale: map full image width to an assumed room width (mm).
 */
export function defaultUnderlayMmPerPixel(
  imageWidthPx: number,
  assumeRoomWidthMm = 10_000,
): number {
  const w = Number.isFinite(imageWidthPx) && imageWidthPx > 0 ? imageWidthPx : 1;
  const room =
    Number.isFinite(assumeRoomWidthMm) && assumeRoomWidthMm > 0
      ? assumeRoomWidthMm
      : 10_000;
  return room / w;
}

/**
 * Resolve stored or default mm-per-pixel for an underlay.
 */
export function resolveUnderlayMmPerPixel(
  imageWidthPx: number,
  mmPerPixel?: number,
): number {
  if (Number.isFinite(mmPerPixel) && (mmPerPixel as number) > 0) {
    return mmPerPixel as number;
  }
  return defaultUnderlayMmPerPixel(imageWidthPx);
}

/**
 * Convert a plan-space point (mm) into image-pixel space for the underlay.
 * Rotation is ignored (underlay footprint is axis-aligned in plan space).
 */
export function planPointToImagePixel(
  plan: UnderlayPoint,
  underlay: {
    position: UnderlayPoint;
    mmPerPixel: number;
    scale?: number;
  },
): UnderlayPoint {
  const scale =
    Number.isFinite(underlay.scale) && (underlay.scale as number) > 0
      ? (underlay.scale as number)
      : 1;
  const mpp =
    Number.isFinite(underlay.mmPerPixel) && underlay.mmPerPixel > 0
      ? underlay.mmPerPixel
      : 1;
  const factor = mpp * scale;
  return {
    x: (plan.x - underlay.position.x) / factor,
    y: (plan.y - underlay.position.y) / factor,
  };
}

/**
 * Two plan-space clicks + known length → new mm-per-pixel via image-pixel path.
 * Returns null when the segment is too short or scale inputs are invalid.
 */
export function calibrateMmPerPixelFromPlanSegment(input: {
  pointA: UnderlayPoint;
  pointB: UnderlayPoint;
  knownLengthMm: number;
  underlay: {
    position: UnderlayPoint;
    mmPerPixel: number;
    scale?: number;
  };
}): number | null {
  const pixelA = planPointToImagePixel(input.pointA, input.underlay);
  const pixelB = planPointToImagePixel(input.pointB, input.underlay);
  return calibrateMmPerPixel({
    pointA: pixelA,
    pointB: pixelB,
    knownLengthMm: input.knownLengthMm,
  });
}

/**
 * Advance a two-click calibrate session with the next plan point.
 */
export function advanceUnderlayCalibratePick(
  session: UnderlayCalibratePickSession,
  point: UnderlayPoint,
): UnderlayCalibratePickResult {
  if (session.phase === "pick-a") {
    return {
      kind: "need-second",
      session: {
        phase: "pick-b",
        knownLengthMm: session.knownLengthMm,
        pointA: { x: point.x, y: point.y },
      },
    };
  }
  return {
    kind: "complete",
    pointA: session.pointA,
    pointB: { x: point.x, y: point.y },
    knownLengthMm: session.knownLengthMm,
  };
}

/**
 * Plan-space width/depth of an underlay image given mm-per-pixel.
 */
export function underlayFootprintMm(input: {
  imageWidthPx: number;
  imageHeightPx: number;
  mmPerPixel: number;
}): { widthMm: number; depthMm: number } {
  const mpp =
    Number.isFinite(input.mmPerPixel) && input.mmPerPixel > 0
      ? input.mmPerPixel
      : 1;
  return {
    widthMm: Math.max(1, input.imageWidthPx * mpp),
    depthMm: Math.max(1, input.imageHeightPx * mpp),
  };
}
