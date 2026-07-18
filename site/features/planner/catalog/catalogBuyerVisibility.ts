/**
 * Buyer-facing catalog visibility — hide internal/proof/fallback SKUs from guest inventory.
 * Guest path prefers oando-* brand heroes only (P10 / BQ4 / P18).
 * Pure helpers; no React. Repo evidence: UI-DIAGNOSIS P-UI-1.
 */

import type { PlannerCatalogItem } from "./catalogTypes";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";
import { formatFootprintDisplay } from "@/features/planner/model/units";

const INTERNAL_TAG = /^(proof|test|internal|dev|fixture|fallback)$/i;
const INTERNAL_NAME =
  /\b(proof\s*chair|missing\s*geom(?:etry)?\s*fallback|missing\s*geometry\s*fallback|geom\s*fallback)\b/i;
const INTERNAL_ID =
  /^(proof-|sample-proof|missing-geom|missing-geometry|geom-fallback)/i;

/** Demo / sample ids that must never pollute guest inventory (BQ4). */
const DEMO_SAMPLE_ID = /^(sample[-_]|demo[-_]|cabinet-v0$|ws-v0-|workstation-v0)/i;

/** Generic OFL plan-kit ids/skus — not Oando brand heroes (P10). */
const OFL_GENERIC = /^ofl[-_]/i;

/** Residential rooms that mark home-DIY pollution on non-brand items. */
const RESIDENTIAL_ROOM = new Set([
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining",
  "Outdoor",
  "Garage",
]);

/**
 * True when item must not appear in buyer/guest catalog UI.
 */
export function isInternalCatalogItem(item: PlannerCatalogItem): boolean {
  // Brand heroes are never "internal" even if slug tags include words like "proof".
  if (isBrandHeroCatalogItem(item)) {
    return false;
  }
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

/**
 * True when id/slug/sku is an Oando brand hero (disk seed / published plan symbols).
 * Guest inventory authority for P10.
 */
export function isBrandHeroCatalogItem(item: PlannerCatalogItem): boolean {
  const keys = [item.id, item.slug ?? "", item.sku ?? ""];
  return keys.some((key) => {
    const normalized = key.trim().toLowerCase();
    return normalized.startsWith("oando-") || normalized.startsWith("oando_");
  });
}

/**
 * Demo-sofa / sample / OFL / residential / systems-v0 pollution for guest path.
 * Brand heroes are never pollution.
 */
export function isGuestInventoryPollution(item: PlannerCatalogItem): boolean {
  if (isBrandHeroCatalogItem(item)) {
    return false;
  }
  if (isInternalCatalogItem(item)) {
    return true;
  }
  const id = item.id.trim();
  const slug = (item.slug ?? "").trim();
  const sku = (item.sku ?? "").trim();
  if (
    DEMO_SAMPLE_ID.test(id) ||
    DEMO_SAMPLE_ID.test(slug) ||
    OFL_GENERIC.test(id) ||
    OFL_GENERIC.test(slug) ||
    OFL_GENERIC.test(sku)
  ) {
    return true;
  }
  const source = item.provenance?.source ?? "";
  if (
    source === "sample_data" ||
    source === "systems_v0" ||
    source === "proof_catalog"
  ) {
    return true;
  }
  if ((item.roomTags ?? []).some((room) => RESIDENTIAL_ROOM.has(room))) {
    return true;
  }
  return false;
}

/** Buyer-facing list (drops proof / test / missing-geom fallback). */
export function filterBuyerFacingCatalogItems(
  items: readonly PlannerCatalogItem[],
): PlannerCatalogItem[] {
  return items.filter((item) => !isInternalCatalogItem(item));
}

/**
 * Guest / office-systems inventory: brand heroes only.
 * Never injects demo-sofa, OFL toys, or residential sample junk (BQ4 / P10 / P18).
 * Empty list is the honest state when no heroes are available.
 */
export function filterGuestInventoryCatalogItems(
  items: readonly PlannerCatalogItem[],
): PlannerCatalogItem[] {
  return filterBuyerFacingCatalogItems(items).filter(isBrandHeroCatalogItem);
}

/**
 * Footprint for inventory tiles.
 * Canonical store remains mm; display follows workspace display unit.
 * @deprecated prefer formatCatalogFootprint(width, depth, unit)
 */
export function formatCatalogFootprintCm(
  widthMm: number,
  depthMm: number,
): string {
  return formatCatalogFootprint(widthMm, depthMm, "cm");
}

/** Footprint pair in the active planner display unit (mm / m / ft-in / …). */
export function formatCatalogFootprint(
  widthMm: number,
  depthMm: number,
  unit: PlannerDisplayUnit = "cm",
): string {
  return formatFootprintDisplay(widthMm, depthMm, unit);
}

/** Higher = earlier in default (empty search) office-systems browse order. */
export function officeSystemsBrowseScore(item: PlannerCatalogItem): number {
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
  items: readonly PlannerCatalogItem[],
): PlannerCatalogItem[] {
  return [...items].sort((a, b) => {
    const delta = officeSystemsBrowseScore(b) - officeSystemsBrowseScore(a);
    if (delta !== 0) return delta;
    return a.name.localeCompare(b.name);
  });
}
