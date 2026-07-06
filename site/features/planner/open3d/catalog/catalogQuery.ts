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

  // Parallelize to avoid waterfall (descriptor loader + API probe); re-assert chosen to ensure client state
  // (api load() may race and clobber; descriptors preferred per original logic).
  const descriptorsPromise = client.loadDescriptorsFromLoader().then(() => client.getAll());
  const apiPromise = client.loadFromApi("configurator", 200).catch(() => [] as Open3dCatalogItem[]);
  const [descriptors, apiLoaded] = await Promise.all([descriptorsPromise, apiPromise]);

  if (descriptors.length > 0) {
    client.load(descriptors, "configurator");
    return { items: descriptors, source: "remote" };
  }
  if (apiLoaded.length > 0) return { items: apiLoaded, source: "remote" };
  client.load(OPEN3D_DEMO_CATALOG_ITEMS, "configurator");
  return { items: OPEN3D_DEMO_CATALOG_ITEMS, source: "fallback" };
}
