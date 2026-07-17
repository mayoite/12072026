/**
 * Underlay scale calibration pure helpers.
 * Two plan points + known real-world distance → mm per image pixel scale factor.
 * Width presets (5 m / 10 m) and persistence fields for reload survival.
 */

export type UnderlayPoint = { x: number; y: number };

/** Properties “5 m” width preset — map full underlay image width to this length. */
export const UNDERLAY_KNOWN_WIDTH_5M_MM = 5_000;

/** Properties “10 m” width preset — map full underlay image width to this length. */
export const UNDERLAY_KNOWN_WIDTH_10M_MM = 10_000;

/** Default assumed room width when placing a new underlay (matches Sketch-to-Plan accept). */
export const DEFAULT_ASSUMED_ROOM_WIDTH_MM = UNDERLAY_KNOWN_WIDTH_10M_MM;

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

/** Subset of background-image fields that carry calibrated scale. */
export type UnderlayScaleState = {
  position: UnderlayPoint;
  imageWidthPx: number;
  imageHeightPx: number;
  mmPerPixel: number;
  scale: number;
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
  assumeRoomWidthMm = DEFAULT_ASSUMED_ROOM_WIDTH_MM,
): number {
  const w = Number.isFinite(imageWidthPx) && imageWidthPx > 0 ? imageWidthPx : 1;
  const room =
    Number.isFinite(assumeRoomWidthMm) && assumeRoomWidthMm > 0
      ? assumeRoomWidthMm
      : DEFAULT_ASSUMED_ROOM_WIDTH_MM;
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
 * Display scale multiplier (1 when missing or invalid).
 */
export function resolveUnderlayDisplayScale(scale?: number): number {
  if (Number.isFinite(scale) && (scale as number) > 0) {
    return scale as number;
  }
  return 1;
}

/**
 * Effective millimetres per image pixel including display scale.
 * Footprint width = imageWidthPx * effectiveMmPerPixel.
 */
export function effectiveUnderlayMmPerPixel(
  mmPerPixel: number,
  scale = 1,
): number {
  const mpp =
    Number.isFinite(mmPerPixel) && mmPerPixel > 0 ? mmPerPixel : 1;
  const s = resolveUnderlayDisplayScale(scale);
  return mpp * s;
}

/**
 * Fold display scale into mmPerPixel and reset scale to 1 (canonical store form).
 * Effective footprint is unchanged.
 */
export function normalizeUnderlayScale(input: {
  mmPerPixel: number;
  scale?: number;
}): { mmPerPixel: number; scale: 1 } {
  return {
    mmPerPixel: effectiveUnderlayMmPerPixel(input.mmPerPixel, input.scale),
    scale: 1,
  };
}

/**
 * Apply full-image-width calibration (Properties 5 m / 10 m).
 * Always stores scale = 1 so reload uses mmPerPixel alone.
 */
export function applyUnderlayWidthCalibration(input: {
  imageWidthPx: number;
  knownWidthMm: number;
}): { mmPerPixel: number; scale: 1 } | null {
  const mmPerPixel = calibrateMmPerPixelFromImageWidth(
    input.imageWidthPx,
    input.knownWidthMm,
  );
  if (mmPerPixel === null) return null;
  return { mmPerPixel, scale: 1 };
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
  const factor = effectiveUnderlayMmPerPixel(
    underlay.mmPerPixel,
    underlay.scale,
  );
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
 * Apply two-point plan-segment calibration.
 * Stores scale = 1 so the calibrated mmPerPixel survives reload.
 */
export function applyUnderlayTwoPointCalibration(input: {
  pointA: UnderlayPoint;
  pointB: UnderlayPoint;
  knownLengthMm: number;
  underlay: {
    position: UnderlayPoint;
    mmPerPixel: number;
    scale?: number;
  };
}): { mmPerPixel: number; scale: 1 } | null {
  const mmPerPixel = calibrateMmPerPixelFromPlanSegment(input);
  if (mmPerPixel === null) return null;
  return { mmPerPixel, scale: 1 };
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
 * Plan-space width/depth of an underlay image given mm-per-pixel (and optional display scale).
 */
export function underlayFootprintMm(input: {
  imageWidthPx: number;
  imageHeightPx: number;
  mmPerPixel: number;
  scale?: number;
}): { widthMm: number; depthMm: number } {
  const mpp = effectiveUnderlayMmPerPixel(input.mmPerPixel, input.scale);
  return {
    widthMm: Math.max(1, input.imageWidthPx * mpp),
    depthMm: Math.max(1, input.imageHeightPx * mpp),
  };
}

/**
 * Fields that must round-trip through save/reload for calibrated underlays.
 */
export function underlayScalePersistenceFields(
  state: UnderlayScaleState,
): UnderlayScaleState {
  const normalized = normalizeUnderlayScale(state);
  return {
    position: { x: state.position.x, y: state.position.y },
    imageWidthPx: state.imageWidthPx,
    imageHeightPx: state.imageHeightPx,
    mmPerPixel: normalized.mmPerPixel,
    scale: normalized.scale,
  };
}

/**
 * Revive scale after a JSON clone (reload simulation).
 * Resolves mmPerPixel with the same defaulting the canvas uses.
 */
export function reviveUnderlayScaleAfterReload(persisted: {
  position: UnderlayPoint;
  imageWidthPx: number;
  imageHeightPx: number;
  mmPerPixel?: number;
  scale?: number;
}): UnderlayScaleState & { footprint: { widthMm: number; depthMm: number } } {
  const mmPerPixel = resolveUnderlayMmPerPixel(
    persisted.imageWidthPx,
    persisted.mmPerPixel,
  );
  const scale = resolveUnderlayDisplayScale(persisted.scale);
  const state: UnderlayScaleState = {
    position: { x: persisted.position.x, y: persisted.position.y },
    imageWidthPx: persisted.imageWidthPx,
    imageHeightPx: persisted.imageHeightPx,
    mmPerPixel,
    scale,
  };
  return {
    ...state,
    footprint: underlayFootprintMm(state),
  };
}
