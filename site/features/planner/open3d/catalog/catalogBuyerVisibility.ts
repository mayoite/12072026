/**
 * Buyer-facing catalog visibility — hide internal/proof/fallback SKUs from guest inventory.
 * Pure helpers; no React. Repo evidence: UI-DIAGNOSIS P-UI-1.
 */

import type { Open3dCatalogItem } from "./catalogTypes";
import { displayCmFromCanonicalMm } from "./unitConversion";

const INTERNAL_TAG = /^(proof|test|internal|dev|fixture|fallback)$/i;
const INTERNAL_NAME =
  /\b(proof\s*chair|missing\s*geom(?:etry)?\s*fallback|missing\s*geometry\s*fallback|geom\s*fallback)\b/i;
const INTERNAL_ID =
  /^(proof-|sample-proof|missing-geom|missing-geometry|geom-fallback)/i;

/**
 * True when item must not appear in buyer/guest catalog UI.
 */
export function isInternalCatalogItem(item: Open3dCatalogItem): boolean {
  if (item.provenance?.source === "proof_catalog") {
    return true;
  }
  if (INTERNAL_ID.test(item.id) || INTERNAL_ID.test(item.slug ?? "")) {
    return true;
  }
  if (item.sku && /^PROOF[-_]/i.test(item.sku)) {
    return true;
  }
  if (INTERNAL_NAME.test(item.name) || INTERNAL_NAME.test(item.shortName ?? "")) {
    return true;
  }
  const tags = item.tags ?? [];
  if (tags.some((t) => INTERNAL_TAG.test(t))) {
    return true;
  }
  return false;
}

/** Buyer-facing list (drops proof / test / missing-geom fallback). */
export function filterBuyerFacingCatalogItems(
  items: readonly Open3dCatalogItem[],
): Open3dCatalogItem[] {
  return items.filter((item) => !isInternalCatalogItem(item));
}

/**
 * Footprint for inventory tiles. Default **cm** to match workspace display unit chrome.
 * Canonical store remains mm.
 */
export function formatCatalogFootprintCm(
  widthMm: number,
  depthMm: number,
): string {
  const w = displayCmFromCanonicalMm(widthMm);
  const d = displayCmFromCanonicalMm(depthMm);
  return `${w} × ${d} cm`;
}
