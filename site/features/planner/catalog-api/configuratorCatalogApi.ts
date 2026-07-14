import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

import type { CatalogItem } from "./catalogTypes";

type ConfiguratorCatalogApiResponse = {
  success?: boolean;
  items?: CatalogItem[];
  source?: string;
  total?: number;
};

export async function fetchConfiguratorCatalogItems(): Promise<{
  items: CatalogItem[];
  source: string;
}> {
  const response = await browserApiFetch(apiPath("/api/planner/catalog/configurator"));
  if (!response.ok) {
    return { items: [], source: "static" };
  }
  const payload = (await response.json()) as ConfiguratorCatalogApiResponse;
  return {
    items: payload.items ?? [],
    source: payload.source ?? "configurator_products",
  };
}
