import type { QueryFunctionContext } from "@tanstack/react-query";

import type { PlannerCatalogClient } from "./catalogClient";
import type { PlannerCatalogItem } from "./catalogTypes";

export const PLANNER_CATALOG_QUERY_KEY = ["open3d", "catalog"] as const;

export interface PlannerCatalogQueryData {
  items: PlannerCatalogItem[];
  /**
   * remote = svg-blocks and/or configurator returned items.
   * fallback = honest empty when APIs yield nothing — never demo-sofa / OFL junk (P18/BQ4).
   */
  source: "remote" | "fallback";
}

/**
 * Catalogue-first load for the planner workspace.
 * Does **not** inject PLANNER_DEMO_CATALOG_ITEMS when remote is empty —
 * guest inventory must stay brand-hero clean (P10 / BQ4 / P18).
 */
export async function loadPlannerCatalog(
  client: PlannerCatalogClient,
  context?: Pick<QueryFunctionContext, "signal">,
): Promise<PlannerCatalogQueryData> {
  const signal = context?.signal;
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  await client.loadDescriptorsFromLoader(signal);
  const allItems = client.getAll();
  const hasSvgBlocks = allItems.some(
    (item) => item.provenance?.source === "descriptor-loader",
  );
  if (hasSvgBlocks) return { items: allItems, source: "remote" };

  const loaded = await client.loadFromApi("configurator", 200, signal);
  if (loaded.length > 0) return { items: loaded, source: "remote" };
  // Honest empty: no residential demo seed, no OFL toys, no systems-v0 junk.
  return { items: [], source: "fallback" };
}
