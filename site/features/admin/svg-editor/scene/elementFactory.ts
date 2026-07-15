/**
 * elementFactory.ts
 *
 * Programmatically creates Excalidraw elements with exact real-world dimensions
 * for a floor-planner application.
 *
 * ─── Implementation note on newElementWith ────────────────────────────────
 * The Excalidraw export `newElementWith(el, updates)` is a MUTATION helper —
 * it takes an existing element and returns a copy with incremented version.
 * It is NOT suitable for creation from scratch.
 *
 * The correct Excalidraw API for skeleton-based creation is
 * `convertToExcalidrawElements(skeletons[])`. However, to avoid a hard
 * dependency on a specific @excalidraw/excalidraw version, we construct
 * the element objects directly (the same pattern used throughout this
 * codebase in gridSnapping.ts and DimensionLabels.tsx).
 *
 * ─── Height storage convention ────────────────────────────────────────────
 * 3-D / elevation data is stored in `el.customData.heightPx` (pixels) and
 * `el.customData.heightM` (meters). This matches the convention read by
 * DimensionLabels.tsx and the existing `customData.isGridLine` flag.
 * A separate `heightData.ts` module is not required.
 */

import {
  PIXELS_PER_METER,
  metersToPixels,
  pixelsToDimensionString,
  UnitSystem,
} from "./units";
import type { ExcalidrawAPI, ExcalidrawElement } from "./elementUtils";

// ─── Utilities ────────────────────────────────────────────────────────────

/** Clamp a pixel value to at least 1 to avoid degenerate elements. */
function clampPx(px: number): number {
  return Math.max(1, px);
}

let _seq = 0;
function uid(): string {
  return `fp-${Date.now()}-${++_seq}`;
}

function versionNonce(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

/** Shared base fields for every Excalidraw element. */
function base(
  type: string,
  x: number,
  y: number,
  width: number,
  height: number,
  overrides: Partial<Record<string, unknown>> = {}
): Record<string, unknown> {
  return {
    id: uid(),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    boundElements: null,
    updated: Date.now(),
    version: 1,
    versionNonce: versionNonce(),
    isDeleted: false,
    ...overrides,
  };
}

// ─── 1. createWall ────────────────────────────────────────────────────────

/**
 * Creates a LINE element representing a wall.
 *
 * @param startX         Canvas X of the wall start (pixels)
 * @param startY         Canvas Y of the wall start (pixels)
 * @param lengthInMeters Real-world wall length
 * @param angleDeg       Direction angle in degrees (0 = right, 90 = down)
 * @param heightInMeters Optional wall height stored in customData
 */
export function createWall(
  startX: number,
  startY: number,
  lengthInMeters: number,
  angleDeg: number,
  heightInMeters?: number
): ExcalidrawElement {
  const lengthPx = clampPx(metersToPixels(lengthInMeters));
  const rad = (angleDeg * Math.PI) / 180;
  const dx = lengthPx * Math.cos(rad);
  const dy = lengthPx * Math.sin(rad);

  const customData: Record<string, unknown> = {};
  if (heightInMeters !== undefined && heightInMeters > 0) {
    customData.heightPx = metersToPixels(heightInMeters);
    customData.heightM = heightInMeters;
  }

  return base("line", startX, startY, dx, dy, {
    strokeWidth: 4,
    strokeColor: "#1e1e1e",
    strokeLinecap: "round",
    roughness: 0,
    points: [[0, 0], [dx, dy]],
    lastCommittedPoint: [dx, dy],
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
    ...(Object.keys(customData).length > 0 ? { customData } : {}),
  }) as unknown as ExcalidrawElement;
}

// ─── 2. createRoom ────────────────────────────────────────────────────────

/**
 * Creates a RECTANGLE element representing a room.
 *
 * @param x              Canvas X of the top-left corner (pixels)
 * @param y              Canvas Y of the top-left corner (pixels)
 * @param widthInMeters  Real-world room width
 * @param lengthInMeters Real-world room depth/length (Y axis)
 * @param heightInMeters Optional ceiling height stored in customData
 */
export function createRoom(
  x: number,
  y: number,
  widthInMeters: number,
  lengthInMeters: number,
  heightInMeters?: number
): ExcalidrawElement {
  const widthPx = clampPx(metersToPixels(widthInMeters));
  const heightPx = clampPx(metersToPixels(lengthInMeters));

  const customData: Record<string, unknown> = {};
  if (heightInMeters !== undefined && heightInMeters > 0) {
    customData.heightPx = metersToPixels(heightInMeters);
    customData.heightM = heightInMeters;
  }

  return base("rectangle", x, y, widthPx, heightPx, {
    strokeWidth: 2,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    ...(Object.keys(customData).length > 0 ? { customData } : {}),
  }) as unknown as ExcalidrawElement;
}

// ─── 3. createDoor ───────────────────────────────────────────────────────

/**
 * Creates an ARROW element representing a door swing.
 *
 * The arrow is placed at the wall's midpoint and runs perpendicular to the
 * wall direction, with its length equal to the door width in pixels.
 *
 * @param wallStartX       Canvas X of wall start
 * @param wallStartY       Canvas Y of wall start
 * @param wallEndX         Canvas X of wall end
 * @param wallEndY         Canvas Y of wall end
 * @param doorWidthInMeters Door width in meters
 * @param heightInMeters    Optional door height in customData
 */
export function createDoor(
  wallStartX: number,
  wallStartY: number,
  wallEndX: number,
  wallEndY: number,
  doorWidthInMeters: number,
  heightInMeters?: number
): ExcalidrawElement {
  const doorPx = clampPx(metersToPixels(doorWidthInMeters));

  // Wall direction angle
  const wallDx = wallEndX - wallStartX;
  const wallDy = wallEndY - wallStartY;
  const wallAngle = Math.atan2(wallDy, wallDx);

  // Door swing is perpendicular to the wall (90° CCW)
  const perpAngle = wallAngle - Math.PI / 2;
  const swingDx = doorPx * Math.cos(perpAngle);
  const swingDy = doorPx * Math.sin(perpAngle);

  // Place the door at the wall's start point
  const originX = wallStartX;
  const originY = wallStartY;

  const customData: Record<string, unknown> = { isDoor: true };
  if (heightInMeters !== undefined && heightInMeters > 0) {
    customData.heightPx = metersToPixels(heightInMeters);
    customData.heightM = heightInMeters;
  }

  return base("arrow", originX, originY, swingDx, swingDy, {
    strokeWidth: 2,
    strokeColor: "#1e1e1e",
    strokeStyle: "solid",
    roughness: 0,
    points: [[0, 0], [swingDx, swingDy]],
    lastCommittedPoint: [swingDx, swingDy],
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
    customData,
  }) as unknown as ExcalidrawElement;
}

// ─── 4. createDimensionAnnotation ────────────────────────────────────────

/**
 * Creates a TEXT element that displays a human-readable measurement label.
 *
 * @param x              Canvas X (element is centred horizontally)
 * @param y              Canvas Y
 * @param lengthInMeters Length to display (converted via units.ts)
 * @param unit           Unit system for formatting
 */
export function createDimensionAnnotation(
  x: number,
  y: number,
  lengthInMeters: number,
  unit: UnitSystem
): ExcalidrawElement {
  const lengthPx = Math.max(0, metersToPixels(lengthInMeters));
  const label = pixelsToDimensionString(lengthPx, unit);

  // Approximate text element width (Excalidraw recalculates on render)
  const approxWidth = label.length * 9;
  const approxHeight = 22;

  return base("text", x, y, approxWidth, approxHeight, {
    strokeColor: "#1e1e1e",
    text: label,
    originalText: label,
    fontSize: 16,
    // fontFamily 1 = Virgil (Excalidraw's default hand-drawn font)
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "top",
    // baseline approximation for fontFamily 1 at fontSize 16
    baseline: 14,
    lineHeight: 1.25,
    containerId: null,
    customData: { isDimensionLabel: true, lengthM: lengthInMeters },
  }) as unknown as ExcalidrawElement;
}

// ─── 5. addElementsToScene ────────────────────────────────────────────────

/**
 * Appends new elements to the existing scene without replacing user content.
 *
 * @param api      The excalidrawAPI instance
 * @param elements One or more factory-created elements to add
 */
export function addElementsToScene(
  api: ExcalidrawAPI,
  elements: ExcalidrawElement[]
): void {
  if (elements.length === 0) return;
  const existing = api.getSceneElements();
  api.updateScene({
    elements: [...existing, ...elements] as readonly ExcalidrawElement[],
  });
}
