/**
 * ADM-SVG-04 / ADM-SVG-05 — stage layout contract without inventing CSS.
 * Mirrors the locked admin theme shell grid: minmax(0,1fr) minmax(280px, 22rem).
 */

/** Must stay in lockstep with [data-admin-layout] .admin-svg-engine-shell. */
export const STAGE_GRID_COLUMNS = "minmax(0, 1fr) minmax(280px, 22rem)";
export const STAGE_GAP_REM = 0.75;
export const RAIL_MAX_REM = 22;
export const ROOT_FONT_PX = 16;
export const AUTHORING_WIDTH_PX = 1280;
export const STAGE_MIN_FRACTION = 0.55;

/** ADM-SVG-05 stable studio regions (always mounted in SvgStudioCanvas). */
export const STUDIO_REGION_IDS = [
  "command",
  "stage",
  "layers",
  "properties",
] as const;

export type StudioRegionId = (typeof STUDIO_REGION_IDS)[number];

/** data-testid values for the four stable regions. */
export const STUDIO_REGION_TEST_IDS: Readonly<
  Record<StudioRegionId, string>
> = Object.freeze({
  command: "admin-studio-region-command",
  stage: "admin-studio-region-stage",
  layers: "admin-studio-region-layers",
  properties: "admin-studio-region-properties",
});

/**
 * Stage column share of the content shell at a given width.
 * Rail uses minmax(280px, 22rem) preferred size when it fits.
 */
export function stageWidthFractionAt(
  contentWidthPx: number,
  rootFontPx: number = ROOT_FONT_PX,
): number {
  const gapPx = STAGE_GAP_REM * rootFontPx;
  const preferredRail = RAIL_MAX_REM * rootFontPx;
  const usedRail = Math.min(preferredRail, Math.max(0, contentWidthPx - gapPx - 1));
  const stage = contentWidthPx - gapPx - usedRail;
  return stage / contentWidthPx;
}

export function stageMeetsMinimumAt1280(): boolean {
  return stageWidthFractionAt(AUTHORING_WIDTH_PX) >= STAGE_MIN_FRACTION;
}
