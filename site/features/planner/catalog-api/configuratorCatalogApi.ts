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
  error?: string;
}> {
  try {
    const response = await browserApiFetch(apiPath("/api/planner/catalog/configurator"));
    if (!response.ok) {
      return {
        items: [],
        source: "configurator-fetch-failed",
        error: `HTTP ${response.status}`,
      };
    }
    const payload = (await response.json()) as ConfiguratorCatalogApiResponse;
    return {
      items: payload.items ?? [],
      source: payload.source ?? "configurator_products",
    };
  } catch (error) {
    return {
      items: [],
      source: "configurator-fetch-failed",
      error: error instanceof Error ? error.message : "Configurator catalog fetch failed",
    };
  }
}
