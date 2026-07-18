import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/usePlannerWorkspaceCatalog";
import {
  filterGuestInventoryCatalogItems,
} from "@/features/planner/catalog/catalogBuyerVisibility";
import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

describe("catalog/usePlannerWorkspaceCatalog.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["usePlannerWorkspaceCatalog", "usePlannerSvgCatalog"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });

  it("workspace catalog filter never surfaces demo seed pollution (P18)", () => {
    // Mirrors usePlannerWorkspaceCatalog item derivation: guest filter only, no demo merge.
    const remote: PlannerCatalogItem[] = [];
    const items = filterGuestInventoryCatalogItems(remote);
    expect(items).toEqual([]);
    const polluted = filterGuestInventoryCatalogItems([
      ...PLANNER_DEMO_CATALOG_ITEMS,
      {
        ...PLANNER_DEMO_CATALOG_ITEMS[1]!,
        id: "oando-fluid-desk-1600",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
        name: "Fluid Desk 1600",
        provenance: { source: "descriptor-loader" },
      },
    ]);
    expect(polluted.every((i) => i.id.startsWith("oando-"))).toBe(true);
    expect(polluted.some((i) => i.id === "sample-sofa-1")).toBe(false);
  });
});
