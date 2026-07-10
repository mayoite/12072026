// Client-safe asset path utilities
// Note: File system checks are only available server-side

import type fsType from "node:fs";
import type pathType from "node:path";

const configuredAssetBaseUrl = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
  process.env.ASSET_BASE_URL ||
  ""
)
  .trim()
  .replace(/\/+$/, "");

function hasAbsoluteUrl(value: string): boolean {
  return /^(?:https?:)?\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function applyAssetBase(value: string): string {
  if (!configuredAssetBaseUrl) return value;
  if (!value.startsWith("/")) return value;
  return `${configuredAssetBaseUrl}${value}`;
}

function isServer(): boolean {
  return typeof window === "undefined";
}

// Lazy-loaded Node.js modules (server-only)
let _fs: typeof fsType | null = null;
let _path: typeof pathType | null = null;

/**
 * Server-only FS access via webpack's `__non_webpack_require__`.
 * Do **not** import `node:module` / `createRequire` here — this file is also
 * imported by client components (FilterGrid) and that breaks the browser bundle.
 */
function getFs(): typeof fsType | null {
  if (!isServer()) return null;
  if (!_fs) {
    try {
      _fs = __non_webpack_require__("node:fs");
    } catch {
      return null;
    }
  }
  return _fs;
}

function getPath(): typeof pathType | null {
  if (!isServer()) return null;
  if (!_path) {
    try {
      _path = __non_webpack_require__("node:path");
    } catch {
      return null;
    }
  }
  return _path;
}

// Declare __non_webpack_require__ for TypeScript (injected by Next/webpack on server)
declare const __non_webpack_require__: NodeRequire;

function toPublicFsPath(assetPath: string): string | null {
  const pathMod = getPath();
  if (!pathMod) return null;
  const normalized = assetPath.replace(/^\/+/, "").split("/").join(pathMod.sep);
  return pathMod.join(process.cwd(), "public", normalized);
}

function localAssetExists(assetPath: string): boolean {
  if (!isServer()) return false;
  if (!assetPath.startsWith("/")) return false;

  const fsMod = getFs();
  if (!fsMod) return false;

  try {
    const fsPath = toPublicFsPath(assetPath);
    return fsPath ? fsMod.existsSync(fsPath) : false;
  } catch {
    return false;
  }
}

/**
 * Catalog exports often use zero-padded names (`image-01.webp`) while files on disk
 * are unpadded (`image-1.webp` / `image-1.jpg`) — or the reverse. Expand both forms.
 */
function expandImagePathCandidates(assetPath: string): string[] {
  const candidates = [assetPath];
  const padded = assetPath.match(/^(.*\/image-)0+(\d+)(\.[a-z0-9]+)$/i);
  if (padded) {
    candidates.push(`${padded[1]}${Number.parseInt(padded[2], 10)}${padded[3]}`);
    return candidates;
  }
  // Reverse: catalog unpadded, disk zero-padded (image-1 → image-01).
  const unpadded = assetPath.match(/^(.*\/image-)(\d)(\.[a-z0-9]+)$/i);
  if (unpadded) {
    candidates.push(`${unpadded[1]}0${unpadded[2]}${unpadded[3]}`);
  }
  return candidates;
}

function withAlternateExtensions(assetPath: string): string[] {
  const lower = assetPath.toLowerCase();
  const out = [assetPath];
  if (lower.endsWith(".webp")) {
    out.push(assetPath.replace(/\.webp$/i, ".jpg"));
    out.push(assetPath.replace(/\.webp$/i, ".jpeg"));
    out.push(assetPath.replace(/\.webp$/i, ".png"));
  } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    out.push(assetPath.replace(/\.(jpe?g)$/i, ".webp"));
    out.push(assetPath.replace(/\.(jpe?g)$/i, ".png"));
  } else if (lower.endsWith(".png")) {
    out.push(assetPath.replace(/\.png$/i, ".webp"));
    out.push(assetPath.replace(/\.png$/i, ".jpg"));
  }
  return out;
}

/**
 * When image-N is missing but the product folder has other image-* files, pick the
 * nearest lower index (else first). Server-only — needs directory listing.
 */
function resolveNearestSiblingImage(assetPath: string): string | null {
  const fsMod = getFs();
  const pathMod = getPath();
  if (!fsMod || !pathMod) return null;

  const match = assetPath.match(/^(.*\/)(image-)0*(\d+)(\.[a-z0-9]+)$/i);
  if (!match) return null;

  const dirWeb = match[1].replace(/\/+$/, "");
  const requested = Number.parseInt(match[3], 10);
  if (!Number.isFinite(requested)) return null;

  const dirFs = toPublicFsPath(dirWeb);
  if (!dirFs || !fsMod.existsSync(dirFs)) return null;

  let entries: string[];
  try {
    entries = fsMod.readdirSync(dirFs);
  } catch {
    return null;
  }

  const numbered = entries
    .map((file) => {
      const m = file.match(/^image-0*(\d+)\.[a-z0-9]+$/i);
      if (!m) return null;
      return {
        number: Number.parseInt(m[1], 10),
        webPath: `${dirWeb}/${file}`,
      };
    })
    .filter((row): row is { number: number; webPath: string } => row !== null)
    .sort((a, b) => a.number - b.number);

  if (numbered.length === 0) return null;

  const exact = numbered.find((row) => row.number === requested);
  if (exact && localAssetExists(exact.webPath)) return exact.webPath;

  const lowerOrEqual = [...numbered].reverse().find((row) => row.number <= requested);
  if (lowerOrEqual && localAssetExists(lowerOrEqual.webPath)) return lowerOrEqual.webPath;

  const first = numbered[0];
  return first && localAssetExists(first.webPath) ? first.webPath : null;
}

function resolveLocalImageVariant(assetPath: string): string {
  const numbered = expandImagePathCandidates(assetPath);

  // Client: no FS. Keep the original path — do **not** force-unpad.
  // Aggressive image-01 → image-1 rewrite breaks folders that only ship
  // zero-padded webps (or image-01.webp + image-1.jpg without image-1.webp).
  // Catalog adapters normalize server-side with FS; client re-entry must not
  // destroy those resolved paths (FilterGrid calls normalize again).
  if (!isServer()) {
    return assetPath;
  }

  for (const base of numbered) {
    for (const candidate of withAlternateExtensions(base)) {
      if (localAssetExists(candidate)) return candidate;
    }
  }

  // Same folder, different index (e.g. catalog image-1, disk only image-2.jpg).
  const sibling = resolveNearestSiblingImage(assetPath);
  if (sibling) return sibling;

  // Raster fallback only — next/image returns 400 for SVG by default (black cards).
  return PRODUCT_IMAGE_FALLBACK;
}

/** next/image-safe placeholder (not SVG). */
export const PRODUCT_IMAGE_FALLBACK = "/images/fallback/product-placeholder.webp";

export function normalizeAssetPath(assetPath: string | null | undefined): string {
  if (!assetPath) return "";
  const normalized = String(assetPath).trim();
  if (!normalized) return "";
  if (hasAbsoluteUrl(normalized)) return normalized;
  const hasImageExtension = /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(normalized);
  let candidatePath = normalized;
  let candidateLower = candidatePath.toLowerCase();

  // Legacy export tree → `/images/catalog/*` (prefix kept for old absolute paths only).
  const legacySegment = String.fromCharCode(97, 102, 99); // historical path segment
  const legacyCatalogPrefix = `/images/${legacySegment}/`;
  if (candidateLower.startsWith(legacyCatalogPrefix)) {
    candidatePath = `/images/catalog/${candidatePath.slice(legacyCatalogPrefix.length)}`;
    candidateLower = candidatePath.toLowerCase();
  }

  // Legacy homepage content used `/products/*.webp` while static files are under `/images/products/*`.
  if (hasImageExtension && candidateLower.startsWith("/products/")) {
    candidatePath = `/images/products/${candidatePath.slice("/products/".length)}`;
    candidateLower = candidatePath.toLowerCase();
  }

  // Canonicalize legacy placeholder paths → raster next/image-safe fallback.
  if (
    candidateLower === "/images/fallback/category.webp" ||
    candidateLower === "/images/fallback/category.svg" ||
    candidateLower === "/images/fallback/category.png"
  ) {
    return applyAssetBase(PRODUCT_IMAGE_FALLBACK);
  }

  // Phoenix seating assets are currently repo-backed as JPG files only.
  if (
    candidateLower.startsWith("/images/catalog/oando-seating--phoenix/image-") &&
    candidateLower.endsWith(".webp")
  ) {
    const match = candidateLower.match(/image-(\d+)\.webp$/);
    const imageIndex = match ? Number.parseInt(match[1], 10) : Number.NaN;
    if (Number.isNaN(imageIndex) || imageIndex < 1 || imageIndex > 3) {
      return applyAssetBase(PRODUCT_IMAGE_FALLBACK);
    }
    return applyAssetBase(`/images/catalog/oando-seating--phoenix/image-${imageIndex}.jpg`);
  }

  // Resolve to an existing local variant when possible.
  if (candidatePath.startsWith("/images/") && hasImageExtension) {
    const resolvedVariant = resolveLocalImageVariant(candidatePath);
    if (!resolvedVariant) return applyAssetBase(PRODUCT_IMAGE_FALLBACK);
    return applyAssetBase(resolvedVariant);
  }

  return applyAssetBase(candidatePath);
}

export function normalizeAssetList(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!Array.isArray(values)) return [PRODUCT_IMAGE_FALLBACK];
  const resolved = values
    .map((value) => normalizeAssetPath(value))
    .filter(Boolean) as string[];
  return resolved.length > 0 ? resolved : [PRODUCT_IMAGE_FALLBACK];
}
