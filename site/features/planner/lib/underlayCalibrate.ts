/**
 * Underlay scale calibration pure helpers.
 * Two plan points + known real-world distance → mm per image pixel scale factor.
 */

export type UnderlayPoint = { x: number; y: number };

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
