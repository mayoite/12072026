/**
 * Site → Planner inventory continuity.
 * Match inbound `siteProduct` (marketing / PDP slug) to a placeable catalog item.
 * Exact identity wins; prefix slug match covers size variants (fluid-desk → fluid-desk-1400).
 * Does not place furniture — callers select/focus only.
 */

import type { PlannerCatalogItem } from "./catalogTypes";

export type CatalogSiteProductMatchKind =
  | "exact-id"
  | "exact-slug"
  | "exact-sku"
  | "exact-source-slug"
  | "prefix-slug";

export interface CatalogSiteProductMatch {
  readonly item: PlannerCatalogItem;
  readonly matchKind: CatalogSiteProductMatchKind;
}

function normalizeKey(value: string | null | undefined): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function identityKeys(item: PlannerCatalogItem): {
  id: string;
  slug: string;
  sku: string;
  sourceSlug: string;
} {
  return {
    id: normalizeKey(item.id),
    slug: normalizeKey(item.slug),
    sku: normalizeKey(item.sku),
    sourceSlug: normalizeKey(item.provenance?.plannerSourceSlug),
  };
}

function isPrefixMatch(candidate: string, query: string): boolean {
  if (!candidate || !query || candidate === query) return false;
  // catalog slug extends the site product: oando-fluid-desk → oando-fluid-desk-1400
  if (candidate.startsWith(`${query}-`) || candidate.startsWith(`${query}.`)) {
    return true;
  }
  // site product extends catalog slug (rare reverse): oando-fluid-desk-1400 query vs shorter catalog
  if (query.startsWith(`${candidate}-`) || query.startsWith(`${candidate}.`)) {
    return true;
  }
  return false;
}

const MATCH_RANK: Record<CatalogSiteProductMatchKind, number> = {
  "exact-id": 0,
  "exact-slug": 1,
  "exact-sku": 2,
  "exact-source-slug": 3,
  "prefix-slug": 4,
};

/**
 * Find the best catalog item for a Site continuity product slug.
 * Returns null when no usable match (toast/banner only is OK).
 */
export function matchCatalogItemBySiteProduct(
  items: readonly PlannerCatalogItem[],
  siteProduct: string | null | undefined,
): CatalogSiteProductMatch | null {
  const query = normalizeKey(siteProduct);
  if (!query || items.length === 0) return null;

  let best: CatalogSiteProductMatch | null = null;

  for (const item of items) {
    const keys = identityKeys(item);
    let matchKind: CatalogSiteProductMatchKind | null = null;

    if (keys.id === query) matchKind = "exact-id";
    else if (keys.slug === query) matchKind = "exact-slug";
    else if (keys.sku === query) matchKind = "exact-sku";
    else if (keys.sourceSlug === query) matchKind = "exact-source-slug";
    else if (
      isPrefixMatch(keys.slug, query) ||
      isPrefixMatch(keys.id, query) ||
      isPrefixMatch(keys.sourceSlug, query)
    ) {
      matchKind = "prefix-slug";
    }

    if (!matchKind) continue;

    const candidate: CatalogSiteProductMatch = { item, matchKind };
    if (!best) {
      best = candidate;
      continue;
    }

    const rankDelta = MATCH_RANK[matchKind] - MATCH_RANK[best.matchKind];
    if (rankDelta < 0) {
      best = candidate;
      continue;
    }
    if (rankDelta > 0) continue;

    // Same rank: prefer shorter slug (closer identity), then name.
    const a = normalizeKey(candidate.item.slug) || candidate.item.id;
    const b = normalizeKey(best.item.slug) || best.item.id;
    if (a.length < b.length) {
      best = candidate;
      continue;
    }
    if (a.length === b.length && candidate.item.name.localeCompare(best.item.name) < 0) {
      best = candidate;
    }
  }

  return best;
}

/**
 * True when the catalog item is the continuity target for siteProduct.
 * Used by inventory UI for data-selected / highlight without re-ranking.
 */
export function isCatalogItemSiteProductMatch(
  item: PlannerCatalogItem,
  siteProduct: string | null | undefined,
): boolean {
  const match = matchCatalogItemBySiteProduct([item], siteProduct);
  return match !== null;
}
