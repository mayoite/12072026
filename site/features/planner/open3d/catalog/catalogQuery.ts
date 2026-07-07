import type { QueryFunctionContext } from "@tanstack/react-query";

import { OPEN3D_DEMO_CATALOG_ITEMS } from "../editor/demoCatalogItems";
import type { Open3dCatalogClient } from "./catalogClient";
import type { Open3dCatalogItem } from "./catalogTypes";

export const OPEN3D_CATALOG_QUERY_KEY = ["open3d", "catalog"] as const;

export interface Open3dCatalogQueryData {
  items: Open3dCatalogItem[];
  source: "remote" | "fallback";
}

export async function loadOpen3dCatalog(
  client: Open3dCatalogClient,
  context?: Pick<QueryFunctionContext, "signal">,
): Promise<Open3dCatalogQueryData> {
  if (context?.signal.aborted) throw new DOMException("Aborted", "AbortError");
  await client.loadDescriptorsFromLoader();
  const allItems = client.getAll();
  const hasSvgBlocks = allItems.some(
    (item) => item.provenance?.source === "descriptor-loader",
  );
  if (hasSvgBlocks) return { items: allItems, source: "remote" };

  const loaded = await client.loadFromApi("configurator", 200);
  if (loaded.length > 0) return { items: loaded, source: "remote" };
  client.load(OPEN3D_DEMO_CATALOG_ITEMS, "configurator");
  return { items: OPEN3D_DEMO_CATALOG_ITEMS, source: "fallback" };
}
