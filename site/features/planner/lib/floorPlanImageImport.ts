import {
  DEFAULT_ASSUMED_ROOM_WIDTH_MM,
  defaultUnderlayMmPerPixel,
} from "@/features/planner/lib/underlayCalibrate";

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_BYTES = 15 * 1024 * 1024;
const MIN_EDGE_PX = 32;

/** Accepted sketch / floor-plan image MIME types (PDF is a separate P5 path). */
export const FLOOR_PLAN_ACCEPTED_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const FLOOR_PLAN_MAX_BYTES = MAX_BYTES;
export const FLOOR_PLAN_MIN_EDGE_PX = MIN_EDGE_PX;

export type FloorPlanImagePayload = {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
};

/**
 * Locked underlay draft ready for `setBackgroundImage`.
 * Default scale maps image width to an assumed room width (10 m).
 */
export type LockedUnderlayDraft = {
  dataUrl: string;
  position: { x: number; y: number };
  scale: number;
  opacity: number;
  rotation: number;
  locked: true;
  imageWidthPx: number;
  imageHeightPx: number;
  mmPerPixel: number;
};

export function isAcceptedFloorPlanImageType(mimeType: string): boolean {
  return ACCEPTED_MIME_TYPES.has(mimeType);
}

/**
 * Pure file gate before decode. Does not load pixels.
 */
export function validateFloorPlanImageFile(
  file: File,
): { ok: true } | { ok: false; error: string } {
  if (!isAcceptedFloorPlanImageType(file.type)) {
    return {
      ok: false,
      error: "Upload a JPG, PNG, WebP, GIF, or SVG sketch or floor plan.",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be under 15 MB." };
  }
  return { ok: true };
}

/**
 * Build a locked, calibrated underlay from a decoded floor-plan image.
 * Scale is stored as mmPerPixel with display scale 1 so it survives reload.
 */
export function buildLockedUnderlayFromFloorPlan(
  payload: FloorPlanImagePayload,
  options?: {
    assumeRoomWidthMm?: number;
    opacity?: number;
    position?: { x: number; y: number };
  },
): LockedUnderlayDraft {
  const assumeRoomWidthMm =
    options?.assumeRoomWidthMm ?? DEFAULT_ASSUMED_ROOM_WIDTH_MM;
  const opacity =
    Number.isFinite(options?.opacity) &&
    (options?.opacity as number) > 0 &&
    (options?.opacity as number) <= 1
      ? (options?.opacity as number)
      : 0.4;
  const position = options?.position ?? { x: 0, y: 0 };
  const mmPerPixel = defaultUnderlayMmPerPixel(payload.width, assumeRoomWidthMm);

  return {
    dataUrl: payload.dataUrl,
    position: { x: position.x, y: position.y },
    scale: 1,
    opacity,
    rotation: 0,
    locked: true,
    imageWidthPx: payload.width,
    imageHeightPx: payload.height,
    mmPerPixel,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read the image file."));
    };
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
}

function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("The uploaded image could not be decoded."));
    image.src = dataUrl;
  });
}

/** Read a hand sketch or existing floor plan image for canvas underlay. */
export async function readFloorPlanImageFile(file: File): Promise<FloorPlanImagePayload> {
  const gate = validateFloorPlanImageFile(file);
  if (!gate.ok) {
    throw new Error(gate.error);
  }

  const dataUrl = await readFileAsDataUrl(file);
  const { width, height } = await loadImageDimensions(dataUrl);

  if (width < MIN_EDGE_PX || height < MIN_EDGE_PX) {
    throw new Error("Image is too small to use as a floor plan reference.");
  }

  return { dataUrl, width, height, fileName: file.name };
}
