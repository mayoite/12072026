import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlannerCatalogStore } from "@/features/planner/catalog-api/catalogStore";
import { fetchConfiguratorCatalogItems } from "@/features/planner/catalog-api/configuratorCatalogApi";
import { fetchPlannerCatalogItems } from "@/features/planner/catalog-api/plannerCatalogApi";

vi.mock("@/features/planner/catalog-api/plannerCatalogApi", () => ({
  fetchPlannerCatalogItems: vi.fn(),
}));

vi.mock("@/features/planner/catalog-api/configuratorCatalogApi", () => ({
  fetchConfiguratorCatalogItems: vi.fn(),
}));

vi.mock("@/features/planner/catalog-api/workspaceCatalog", () => ({
  PLANNER_CATALOG_ITEMS: [
    {
      id: "item-1",
      name: "Desk 1",
      tags: [],
      category: "desks",
      widthMm: 120,
      heightMm: 60,
      shapeType: "linear",
      depthMm: 60,
      description: "static",
    },
  ],
}));

describe("catalogStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlannerCatalogStore.setState({
      query: "",
      purposeFilter: null,
      recentIds: [],
      catalogSource: "static",
      managedCount: 0,
      configuratorCount: 0,
      items: [
        {
          id: "item-1",
          name: "Desk 1",
          tags: [],
          category: "desks",
          widthMm: 120,
          heightMm: 60,
          shapeType: "linear",
          sku: "DESK-1",
          shortName: "Desk 1",
          material: "wood",
          purposeTab: "workstations",
          subCategory: "linear",
          depthMm: 60,
          description: "static",
        },
      ],
    });
  });

  it("updates query and filters items correctly", () => {
    const store = usePlannerCatalogStore.getState();
    expect(store.query).toBe("");

    usePlannerCatalogStore.getState().setQuery("Desk");
    expect(usePlannerCatalogStore.getState().query).toBe("Desk");

    const filtered = usePlannerCatalogStore.getState().getFilteredItems();
    expect(filtered.length).toBe(1);
  });

  it("hydrates catalog from managed and configurator layers", async () => {
    vi.mocked(fetchPlannerCatalogItems).mockResolvedValue({
      items: [
        {
          id: "managed-1",
          name: "Managed desk",
          tags: ["managed"],
          category: "desks",
          widthMm: 120,
          heightMm: 60,
          shapeType: "linear",
          depthMm: 60,
          description: "managed",
        },
      ],
      source: "planner_managed_products",
    });
    vi.mocked(fetchConfiguratorCatalogItems).mockResolvedValue({
      items: [
        {
          id: "config-1",
          name: "Config desk",
          tags: ["configurator"],
          category: "desks",
          widthMm: 140,
          heightMm: 70,
          shapeType: "linear",
          depthMm: 60,
          description: "configurator",
        },
      ],
      source: "configurator_products",
    });

    await usePlannerCatalogStore.getState().hydrateCatalog();

    const store = usePlannerCatalogStore.getState();
    expect(store.catalogSource).toBe("static+configurator+managed");
    expect(store.managedCount).toBe(1);
    expect(store.configuratorCount).toBe(1);
    expect(store.items.some((item) => item.id === "config-1")).toBe(true);
    expect(store.items.some((item) => item.id === "managed-1")).toBe(true);
  });
});
