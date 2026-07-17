import { create } from "zustand";

import type { PlannerPrimaryPurpose } from "@/features/planner/onboarding/projectSetup";
import { filterCatalogItemsByPurpose } from "@/features/planner/onboarding/projectSetup";

import {
  enrichCatalogItem,
  enrichCatalogItems,
  itemMatchesCatalogSearch,
} from "./catalogHierarchy";
import type { CatalogCategory, CatalogItem } from "./catalogTypes";
import { PLANNER_CATALOG_ITEMS } from "./workspaceCatalog";
import { mergeWorkspaceCatalogItemsLayered } from "./mergeCatalogItems";
import { fetchConfiguratorCatalogItems } from "./configuratorCatalogApi";
import { fetchPlannerCatalogItems } from "./plannerCatalogApi";

const RECENT_STORAGE_KEY = "planner-catalog-recent";
const RECENT_LIMIT = 8;
let catalogHydrationGeneration = 0;

function readRecentIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, RECENT_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function writeRecentIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids.slice(0, RECENT_LIMIT)));
  } catch {
    /* ignore */
  }
}

interface PlannerCatalogState {
  items: CatalogItem[];
  query: string;
  purposeFilter: PlannerPrimaryPurpose | null;
  recentIds: string[];
  catalogSource: string;
  managedCount: number;
  configuratorCount: number;
  catalogHydrating: boolean;
  setQuery: (query: string) => void;
  setPurposeFilter: (purpose: PlannerPrimaryPurpose | null) => void;
  recordRecentPlacement: (itemId: string) => void;
  hydrateCatalog: () => Promise<void>;
  getFilteredItems: () => CatalogItem[];
  getByCategory: (category: CatalogCategory) => CatalogItem[];
  getRecentItems: () => CatalogItem[];
}

function applyCatalogFilters(items: CatalogItem[], query: string, purpose: PlannerPrimaryPurpose | null) {
  const enriched = enrichCatalogItems(items);
  const purposeScoped = purpose ? filterCatalogItemsByPurpose(enriched, purpose) : enriched;
  return purposeScoped.filter((item) => itemMatchesCatalogSearch(item, query));
}

function composeCatalogSource(
  managedCount: number,
  configuratorCount: number,
  managedError?: string,
  configuratorError?: string,
): string {
  const parts = ["static"];
  if (configuratorCount > 0) parts.push("configurator");
  if (managedCount > 0) parts.push("managed");
  if (managedError) parts.push("managed-error");
  if (configuratorError) parts.push("configurator-error");
  return parts.join("+");
}

export const usePlannerCatalogStore = create<PlannerCatalogState>((set, get) => ({
  items: enrichCatalogItems(PLANNER_CATALOG_ITEMS),
  query: "",
  purposeFilter: null,
  recentIds: readRecentIds(),
  catalogSource: "static",
  managedCount: 0,
  configuratorCount: 0,
  catalogHydrating: false,
  setQuery: (query) => set({ query }),
  setPurposeFilter: (purpose) => set({ purposeFilter: purpose }),
  hydrateCatalog: async () => {
    const generation = ++catalogHydrationGeneration;
    set({ catalogHydrating: true });
    try {
      const [managedResult, configuratorResult] = await Promise.all([
        fetchPlannerCatalogItems(),
        fetchConfiguratorCatalogItems(),
      ]);
      if (generation !== catalogHydrationGeneration) return;

      const merged = mergeWorkspaceCatalogItemsLayered(
        PLANNER_CATALOG_ITEMS,
        configuratorResult.items,
        managedResult.items,
      );
      const managedCount = managedResult.items.length;
      const configuratorCount = configuratorResult.items.length;
      if (managedResult.error) {
        console.warn(
          "[planner] Managed catalog layer unavailable:",
          managedResult.error,
        );
      }
      if (configuratorResult.error) {
        console.warn(
          "[planner] Configurator catalog layer unavailable:",
          configuratorResult.error,
        );
      }

      set({
        items: enrichCatalogItems(merged),
        catalogSource: composeCatalogSource(
          managedCount,
          configuratorCount,
          managedResult.error,
          configuratorResult.error,
        ),
        managedCount,
        configuratorCount,
      });
    } catch (error) {
      if (generation !== catalogHydrationGeneration) return;
      console.error(
        "[planner] Catalog hydration failed; falling back to static workspace catalog:",
        error instanceof Error ? error.message : error,
      );
      set({
        items: enrichCatalogItems(PLANNER_CATALOG_ITEMS),
        catalogSource: "static+hydrate-error",
        managedCount: 0,
        configuratorCount: 0,
      });
    } finally {
      if (generation === catalogHydrationGeneration) {
        set({ catalogHydrating: false });
      }
    }
  },
  recordRecentPlacement: (itemId) =>
    set((state) => {
      const recentIds = [itemId, ...state.recentIds.filter((id) => id !== itemId)].slice(0, RECENT_LIMIT);
      writeRecentIds(recentIds);
      return { recentIds };
    }),
  getFilteredItems: () => applyCatalogFilters(get().items, get().query, get().purposeFilter),
  getByCategory: (category) => {
    const purpose = get().purposeFilter;
    const scoped = applyCatalogFilters(get().items, "", purpose);
    return scoped.filter((item) => item.category === category);
  },
  getRecentItems: () => {
    const byId = new Map(get().items.map((item) => [item.id, enrichCatalogItem(item)]));
    return get()
      .recentIds.map((id) => byId.get(id))
      .filter((item): item is CatalogItem => Boolean(item));
  },
}));
