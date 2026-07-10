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

/** Higher = earlier in default (empty search) office-systems browse order. */
export function officeSystemsBrowseScore(item: Open3dCatalogItem): number {
  const blob = [
    item.id,
    item.slug ?? "",
    item.name,
    item.shortName ?? "",
    item.subCategory ?? "",
    item.taxonomyPath ?? "",
    ...(item.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  if (/\bworkstation\b/.test(blob) || /\blinear\b/.test(blob) || /\bl-shape\b/.test(blob)) {
    score += 100;
  }
  if (/\bdesk\b/.test(blob) || /\bworkstation\b/.test(blob)) {
    score += 80;
  }
  if (/\bcabinet\b/.test(blob) || /\bstorage\b/.test(blob) || /\bpedestal\b/.test(blob)) {
    score += 60;
  }
  if (/\boffice\b/.test(blob) && /\bchair\b/.test(blob)) {
    score += 50;
  }
  if (/\bmeeting\b/.test(blob) || /\bconference\b/.test(blob)) {
    score += 40;
  }
  if (/\bchair\b/.test(blob) || /\bseat\b/.test(blob)) {
    score += 20;
  }
  if (/\bsofa\b/.test(blob) || /\bsectional\b/.test(blob) || /\bchaise\b/.test(blob) || /\bbed\b/.test(blob)) {
    score -= 40;
  }
  return score;
}

/**
 * Stable sort for empty-search browse in office-systems mode.
 * Search query ranking (Fuse) is applied separately and left alone.
 */
export function prioritizeOfficeSystemsBrowse(
  items: readonly Open3dCatalogItem[],
): Open3dCatalogItem[] {
  return [...items].sort((a, b) => {
    const delta = officeSystemsBrowseScore(b) - officeSystemsBrowseScore(a);
    if (delta !== 0) return delta;
    return a.name.localeCompare(b.name);
  });
}
