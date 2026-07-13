/**
 * ADM-SVG-04 / ADM-SVG-05 — stage layout contract without inventing CSS.
 * Reads the known admin-svg-engine grid formula for proof at 1280px.
 */

/** Matches admin-svg-engine.css: minmax(0,1fr) minmax(280px, 22rem) */
export const STAGE_GRID_COLUMNS = "minmax(0, 1fr) minmax(280px, 22rem)";
export const STAGE_GAP_REM = 0.75;
export const RAIL_MAX_REM = 22;
export const ROOT_FONT_PX = 16;
export const AUTHORING_WIDTH_PX = 1280;
export const STAGE_MIN_FRACTION = 0.55;

export const STUDIO_REGION_IDS = [
  "command",
  "stage",
  "layers",
  "properties",
] as const;

export type StudioRegionId = (typeof STUDIO_REGION_IDS)[number];

export function stageWidthFractionAt(
  contentWidthPx: number,
  rootFontPx: number = ROOT_FONT_PX,
): number {
  const gapPx = STAGE_GAP_REM * rootFontPx;
  const railPx = Math.min(
    RAIL_MAX_REM * rootFontPx,
    Math.max(280, RAIL_MAX_REM * rootFontPx),
  );
  // Rail preferred size is 22rem when space allows; at 1280 it fits.
  const preferredRail = RAIL_MAX_REM * rootFontPx;
  const usedRail = Math.min(preferredRail, contentWidthPx - gapPx - 1);
  const stage = contentWidthPx - gapPx - usedRail;
  return stage / contentWidthPx;
}

export function stageMeetsMinimumAt1280(): boolean {
  return stageWidthFractionAt(AUTHORING_WIDTH_PX) >= STAGE_MIN_FRACTION;
}
