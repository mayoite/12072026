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

/** Webpack exposes this; plain Node/tsx does not — fall back to createRequire. */
function nodeRequire(id: "node:fs" | "node:path"): unknown {
  try {
    if (typeof __non_webpack_require__ === "function") {
      return __non_webpack_require__(id);
    }
  } catch {
    /* fall through */
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRequire } = require("node:module") as typeof import("node:module");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const req = createRequire(typeof __filename !== "undefined" ? __filename : process.cwd() + "/package.json");
    return req(id);
  } catch {
    return null;
  }
}

function getFs(): typeof fsType | null {
  if (!isServer()) return null;
  if (!_fs) {
    _fs = nodeRequire("node:fs") as typeof fsType | null;
  }
  return _fs;
}

function getPath(): typeof pathType | null {
  if (!isServer()) return null;
  if (!_path) {
    _path = nodeRequire("node:path") as typeof pathType | null;
  }
  return _path;
}

// Declare __non_webpack_require__ for TypeScript
declare const __non_webpack_require__: NodeRequire | undefined;

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
 * are unpadded (`image-1.webp` / `image-1.jpg`). Expand both forms for resolution.
 */
function expandImagePathCandidates(assetPath: string): string[] {
  const candidates = [assetPath];
  const match = assetPath.match(/^(.*\/image-)0+(\d+)(\.[a-z0-9]+)$/i);
  if (match) {
    candidates.push(`${match[1]}${Number.parseInt(match[2], 10)}${match[3]}`);
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

function resolveLocalImageVariant(assetPath: string): string {
  const numbered = expandImagePathCandidates(assetPath);

  // Client: no FS — still strip zero-padding so the browser hits real public files.
  if (!isServer()) {
    return numbered[numbered.length - 1] ?? assetPath;
  }

  for (const base of numbered) {
    for (const candidate of withAlternateExtensions(base)) {
      if (localAssetExists(candidate)) return candidate;
    }
  }

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
