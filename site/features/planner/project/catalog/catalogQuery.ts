import type { QueryFunctionContext } from "@tanstack/react-query";

import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";
import type { PlannerCatalogClient } from "./catalogClient";
import type { PlannerCatalogItem } from "./catalogTypes";

export const PLANNER_CATALOG_QUERY_KEY = ["open3d", "catalog"] as const;

export interface PlannerCatalogQueryData {
  items: PlannerCatalogItem[];
  source: "remote" | "fallback";
}

export async function loadPlannerCatalog(
  client: PlannerCatalogClient,
  context?: Pick<QueryFunctionContext, "signal">,
): Promise<PlannerCatalogQueryData> {
  if (context?.signal.aborted) throw new DOMException("Aborted", "AbortError");
  await client.loadDescriptorsFromLoader();
  const allItems = client.getAll();
  const hasSvgBlocks = allItems.some(
    (item) => item.provenance?.source === "descriptor-loader",
  );
  if (hasSvgBlocks) return { items: allItems, source: "remote" };

  const loaded = await client.loadFromApi("configurator", 200);
  if (loaded.length > 0) return { items: loaded, source: "remote" };
  client.load(PLANNER_DEMO_CATALOG_ITEMS, "configurator");
  return { items: PLANNER_DEMO_CATALOG_ITEMS, source: "fallback" };
}
