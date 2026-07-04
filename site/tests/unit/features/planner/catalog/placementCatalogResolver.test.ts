import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPlacementCatalogItem,
  listPlacementCatalogItems,
  getDefaultPlacementCatalogItemId,
  isFurniturePlacementCatalogItem,
} from "@/features/planner/catalog/placementCatalogResolver";
import { PLANNER_CATALOG_ITEMS } from "@/features/planner/catalog/workspaceCatalog";

vi.mock("@/features/planner/store/catalogData", () => ({
  furnitureCatalog: [
    { id: "legacy-1", name: "Legacy Desk", category: "desks", widthMm: 1200, depthMm: 600, heightMm: 750, shape: "linear", sku: "LEG-1", iconPath: "icon.png" },
  ],
}));

vi.mock("@/features/planner/catalog/workspaceCatalog", () => ({
  PLANNER_CATALOG_ITEMS: [
    { id: "ws-1", name: "Workspace Desk", category: "desks", shapeType: "linear", depthMm: 75, sku: "WS-1", imageUrl: "img.png" },
  ],
}));

vi.mock("@/features/planner/catalog/shapeTypeRegistry", () => ({
  catalogShapeTypeToFurnitureType: vi.fn().mockReturnValue("linear"),
  isCatalogShapeType: vi.fn().mockReturnValue(false),
  isRoomCatalogShapeType: vi.fn().mockReturnValue(false),
  PlannerCatalogShapeType: { desk: "desk", zone: "zone" },
}));

vi.mock("@/features/planner/catalog/catalogBlockBridge", () => ({
  normalizeCatalogMm: vi.fn().mockImplementation((val) => val * 10),
  resolveCatalogPlacementFootprintMm: vi.fn().mockReturnValue({ widthMm: 1200, depthMm: 600 }),
}));

describe("placementCatalogResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves legacy catalog items", () => {
    const item = getPlacementCatalogItem("legacy-1");
    expect(item).toBeDefined();
    expect(item?.name).toBe("Legacy Desk");
  });

  it("resolves workspace catalog items", () => {
    const item = getPlacementCatalogItem("ws-1");
    expect(item).toBeDefined();
    expect(item?.name).toBe("Workspace Desk");
    expect(item?.widthMm).toBe(1200);
  });

  it("lists all placement catalog items", () => {
    const list = listPlacementCatalogItems();
    expect(list.length).toBe(2);
  });

  it("gets default placement catalog item ID", () => {
    const defaultId = getDefaultPlacementCatalogItemId();
    expect(defaultId).toBe("ws-1");
  });

  it("identifies if a catalog item is for furniture placement", () => {
    const isFurniture = isFurniturePlacementCatalogItem(PLANNER_CATALOG_ITEMS[0]);
    expect(isFurniture).toBe(true);
  });
});
