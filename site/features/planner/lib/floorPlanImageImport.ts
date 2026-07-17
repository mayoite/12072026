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
/** When SVG has no intrinsic size, assume A3 landscape px for underlay scale. */
const SVG_FALLBACK_WIDTH = 1400;
const SVG_FALLBACK_HEIGHT = 990;

/** Accepted sketch / floor-plan image MIME types (PDF is a separate P5 path). */
export const FLOOR_PLAN_ACCEPTED_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

/** Value for `<input accept>` — includes SVG underlay (and raster). */
export const FLOOR_PLAN_FILE_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.svg";

/** Sketch-to-plan AI path — raster only (server does not convert SVG drawings). */
export const SKETCH_TO_PLAN_FILE_ACCEPT =
  "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp";

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

function extensionOf(fileName: string): string {
  const base = fileName.trim().toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot) : "";
}

/** Resolve MIME when browsers omit type for .svg downloads. */
export function resolveFloorPlanMimeType(file: File): string {
  const typed = (file.type || "").trim().toLowerCase();
  if (typed && ACCEPTED_MIME_TYPES.has(typed)) return typed;
  switch (extensionOf(file.name)) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return typed;
  }
}

export function isAcceptedFloorPlanImageType(mimeType: string): boolean {
  return ACCEPTED_MIME_TYPES.has(mimeType);
}

export function isSvgFloorPlanMime(mimeType: string): boolean {
  return mimeType === "image/svg+xml";
}

/**
 * Pure file gate before decode. Does not load pixels.
 */
export function validateFloorPlanImageFile(
  file: File,
): { ok: true } | { ok: false; error: string } {
  const mime = resolveFloorPlanMimeType(file);
  if (!isAcceptedFloorPlanImageType(mime)) {
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

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read the SVG file."));
    };
    reader.onerror = () => reject(new Error("Could not read the SVG file."));
    reader.readAsText(file);
  });
}

/**
 * Parse width/height or viewBox from SVG markup when Image() reports 0×0.
 */
export function parseSvgIntrinsicSize(svgText: string): {
  width: number;
  height: number;
} | null {
  const text = svgText.slice(0, 200_000);
  const openTag = text.match(/<svg\b[^>]*>/i)?.[0];
  if (!openTag) return null;

  const num = (raw: string | undefined): number | null => {
    if (!raw) return null;
    const n = Number.parseFloat(raw.replace(/px$/i, "").trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const widthAttr = openTag.match(/\bwidth\s*=\s*["']([^"']+)["']/i)?.[1];
  const heightAttr = openTag.match(/\bheight\s*=\s*["']([^"']+)["']/i)?.[1];
  const w = num(widthAttr);
  const h = num(heightAttr);
  if (w && h) return { width: w, height: h };

  const viewBox = openTag.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1];
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map((p) => Number.parseFloat(p));
    if (
      parts.length >= 4 &&
      Number.isFinite(parts[2]) &&
      Number.isFinite(parts[3]) &&
      (parts[2] as number) > 0 &&
      (parts[3] as number) > 0
    ) {
      return { width: parts[2] as number, height: parts[3] as number };
    }
  }

  return null;
}

function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () =>
      reject(new Error("The uploaded image could not be decoded."));
    image.src = dataUrl;
  });
}

async function dimensionsForSvg(file: File, dataUrl: string): Promise<{
  width: number;
  height: number;
}> {
  try {
    const fromImage = await loadImageDimensions(dataUrl);
    if (fromImage.width >= MIN_EDGE_PX && fromImage.height >= MIN_EDGE_PX) {
      return fromImage;
    }
  } catch {
    // Fall through to markup parse.
  }

  try {
    const text = await readFileAsText(file);
    const parsed = parseSvgIntrinsicSize(text);
    if (
      parsed &&
      parsed.width >= MIN_EDGE_PX &&
      parsed.height >= MIN_EDGE_PX
    ) {
      return parsed;
    }
  } catch {
    // Fall through to fallback.
  }

  return { width: SVG_FALLBACK_WIDTH, height: SVG_FALLBACK_HEIGHT };
}

/** Read a hand sketch or existing floor plan image for canvas underlay. */
export async function readFloorPlanImageFile(file: File): Promise<FloorPlanImagePayload> {
  const gate = validateFloorPlanImageFile(file);
  if (!gate.ok) {
    throw new Error(gate.error);
  }

  const mime = resolveFloorPlanMimeType(file);
  const dataUrl = await readFileAsDataUrl(file);

  const { width, height } = isSvgFloorPlanMime(mime)
    ? await dimensionsForSvg(file, dataUrl)
    : await loadImageDimensions(dataUrl);

  if (width < MIN_EDGE_PX || height < MIN_EDGE_PX) {
    throw new Error("Image is too small to use as a floor plan reference.");
  }

  return { dataUrl, width, height, fileName: file.name };
}
