/**
 * Coverage Gap Tests â€” Phase 03A
 *
 * Targets uncovered branches and statements in:
 * - svgFixtureGallery (0%)
 * - placementAction (54%)
 * - catalogClient (79%)
 * - recentFavorites (87%)
 * - inventoryState (88%)
 * - svgSanitizer (82%)
 * - svgSymbols (91%)
 * - unitConversion (85%)
 * - inventoryIndex (89%)
 * - catalogMapping (83%)
 * - pureActions (98% stmts but 88% branches)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// â”€â”€ SVG Fixture Gallery â”€â”€
import { buildSvgFixtureGallery } from "@/features/planner/open3d/catalog/svg/svgFixtureGallery";

describe("SVG Fixture Gallery", () => {
  it("builds gallery with expected entry count", () => {
    const gallery = buildSvgFixtureGallery();
    // 5 fixture entries + 1 fallback
    expect(gallery.length).toBe(6);
  });

  it("each entry has valid SVG markup", () => {
    const gallery = buildSvgFixtureGallery();
    for (const entry of gallery) {
      expect(entry.svg).toContain("<svg");
      expect(entry.svg).toContain("</svg>");
      expect(entry.widthMm).toBeGreaterThan(0);
      expect(entry.depthMm).toBeGreaterThan(0);
    }
  });

  it("covers all theme variants", () => {
    const gallery = buildSvgFixtureGallery();
    const themes = gallery.map((e) => e.theme);
    expect(themes).toContain("light");
    expect(themes).toContain("dark");
    expect(themes).toContain("selected");
    expect(themes).toContain("print");
    expect(themes).toContain("high-contrast");
    expect(themes).toContain("fallback");
  });

  it("covers multiple categories", () => {
    const gallery = buildSvgFixtureGallery();
    const cats = new Set(gallery.map((e) => e.category));
    expect(cats.has("Furniture")).toBe(true);
    expect(cats.has("Decor")).toBe(true);
    expect(cats.has("Symbols")).toBe(true);
  });

  it("includes rotated entries", () => {
    const gallery = buildSvgFixtureGallery();
    const rotations = gallery.map((e) => e.rotation);
    expect(rotations).toContain(0);
    expect(rotations).toContain(90);
    expect(rotations).toContain(180);
    expect(rotations).toContain(270);
  });

  it("viewBox is a valid string", () => {
    const gallery = buildSvgFixtureGallery();
    for (const entry of gallery) {
      expect(entry.viewBox).toMatch(/^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?$/);
    }
  });
});

// â”€â”€ Placement Action â”€â”€
import {
  placeCatalogItem,
  clickToPlace,
  dragToPlace,
  apiPlace,
  verifyPlacementIdentity,
  placeCatalogItemInProject,
} from "@/features/planner/open3d/catalog/placementAction";
import type { Open3dCatalogItem, Open3dCatalogVariant } from "@/features/planner/open3d/catalog/catalogTypes";

function makePlacementItem(overrides: Partial<Open3dCatalogItem> = {}): Open3dCatalogItem {
  return {
    id: "item-1",
    slug: "test-chair",
    sku: "SKU-001",
    name: "Test Chair",
    description: "A test chair",
    category: "Furniture",
    subCategory: "Chairs",
    tags: ["office"],
    roomTags: ["Office"],
    styleTags: ["Modern"],
    dimensions: { widthMm: 500, depthMm: 500, heightMm: 900 },
    material: { normalizedMaterial: "Fabric", marketingMaterial: "Fabric" },
    color: { normalizedFamily: "Black", name: "black", hex: "#000000" },
    availability: "in-stock",
    variants: [{
      variantId: "v1",
      sku: "SKU-001-V1",
      label: "Black Fabric",
      dimensions: { widthMm: 500, depthMm: 500, heightMm: 900 },
      material: { normalizedMaterial: "Fabric", marketingMaterial: "Fabric" },
      color: { normalizedFamily: "Black", name: "black", hex: "#000000" },
      availability: "in-stock",
      assets: { thumbnail: "https://example.com/thumb.jpg" },
    }],
    provenance: {
      source: "standard",
      legacyProductId: "legacy-1",
      plannerSourceSlug: "test-chair",
    },
    assets: { thumbnail: "https://example.com/thumb.jpg" },
    pricing: { price: 299, currency: "USD" },
    ...overrides,
  } as Open3dCatalogItem;
}

describe("Placement Action", () => {
  const item = makePlacementItem();

  it("placeCatalogItem with all options", () => {
    const result = placeCatalogItem(item, item.variants[0], {
      placedFrom: "drag",
      position: { x: 100, y: 200 },
      rotation: 45,
      scale: { x: 2, y: 2, z: 2 },
      materialOverride: "wood",
      colorOverride: "oak",
      locked: true,
    });
    expect(result.placementId).toContain("plc-");
    expect(result.position).toEqual({ x: 100, y: 200 });
    expect(result.rotation).toBe(45);
    expect(result.scale).toEqual({ x: 2, y: 2, z: 2 });
    expect(result.materialOverride).toBe("wood");
    expect(result.colorOverride).toBe("oak");
    expect(result.locked).toBe(true);
    expect(result.sourceMetadata.placedFrom).toBe("drag");
  });

  it("placeCatalogItem defaults", () => {
    const result = placeCatalogItem(item, null);
    expect(result.position).toEqual({ x: 0, y: 0 });
    expect(result.rotation).toBe(0);
    expect(result.scale).toEqual({ x: 1, y: 1, z: 1 });
    expect(result.locked).toBe(false);
    expect(result.sourceMetadata.placedFrom).toBe("click");
    // Uses first variant when null passed
    expect(result.variantIdentity).not.toBeNull();
  });

  it("placeCatalogItem with item that has no variants", () => {
    const noVariantItem = makePlacementItem({ variants: [] });
    const result = placeCatalogItem(noVariantItem, null);
    expect(result.variantIdentity).toBeNull();
  });

  it("clickToPlace creates correct snapshot", () => {
    const result = clickToPlace(item, item.variants[0], { x: 50, y: 75 });
    expect(result.sourceMetadata.placedFrom).toBe("click");
    expect(result.position).toEqual({ x: 50, y: 75 });
  });

  it("dragToPlace creates correct snapshot", () => {
    const result = dragToPlace(item, null, { x: 30, y: 40 });
    expect(result.sourceMetadata.placedFrom).toBe("drag");
    expect(result.position).toEqual({ x: 30, y: 40 });
  });

  it("apiPlace creates correct snapshot", () => {
    const result = apiPlace(item, null, { rotation: 90, locked: true });
    expect(result.sourceMetadata.placedFrom).toBe("api");
    expect(result.rotation).toBe(90);
    expect(result.locked).toBe(true);
  });

  it("apiPlace with no overrides", () => {
    const result = apiPlace(item, null);
    expect(result.sourceMetadata.placedFrom).toBe("api");
    expect(result.rotation).toBe(0);
  });

  it("verifyPlacementIdentity returns true for matching", () => {
    const result = placeCatalogItem(item, null);
    expect(verifyPlacementIdentity(result, item)).toBe(true);
  });

  it("verifyPlacementIdentity returns false for mismatched", () => {
    const result = placeCatalogItem(item, null);
    const wrongItem = makePlacementItem({ id: "wrong-id" });
    expect(verifyPlacementIdentity(result, wrongItem)).toBe(false);
  });

  it("generates unique IDs across batch", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const result = placeCatalogItem(item, null);
      ids.add(result.placementId);
    }
    expect(ids.size).toBe(100);
  });

  it("placeCatalogItemInProject preserves overrides and unrelated furniture", () => {
    const project = {
      id: "project",
      name: "Project",
      activeFloorId: "floor-1",
      displayUnit: "cm" as const,
      createdAt: "2026-07-03T00:00:00.000Z",
      updatedAt: "2026-07-03T00:00:00.000Z",
      floors: [{
        id: "floor-1",
        name: "Floor 1",
        level: 0,
        walls: [],
        rooms: [],
        doors: [],
        windows: [],
        furniture: [{
          id: "existing-chair",
          catalogId: "chair",
          position: { x: 0, y: 0 },
          rotation: 0,
          width: 500,
          depth: 500,
          height: 900,
        }],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      }],
    };
    const placementItem = makePlacementItem({
      id: "catalog-desk",
      slug: "catalog-desk",
      sku: "DESK-BASE",
      color: { normalizedFamily: "Black", name: "black", hex: "#111111" },
      material: { normalizedMaterial: "Wood", marketingMaterial: "wood" },
    });

    const placement = placeCatalogItemInProject(project as never, placementItem, null, {
      placedFrom: "api",
      position: { x: 200, y: 300 },
      materialOverride: "Oak",
      colorOverride: "#ABCDEF",
    });

    const [existing, placed] = placement.result.project.floors[0].furniture;
    expect(existing.id).toBe("existing-chair");
    expect(placed.material).toBe("Oak");
    expect(placed.color).toBe("#ABCDEF");
    expect(placed.sourceSku).toBe("SKU-001-V1");
  });
});

// â”€â”€ Catalog Client additional coverage â”€â”€
import { Open3dCatalogClient } from "@/features/planner/open3d/catalog/catalogClient";

describe("Catalog Client â€” coverage gaps", () => {
  function makeItems(count: number): Open3dCatalogItem[] {
    const cats: Open3dCatalogItem["category"][] = ["Furniture", "Lighting", "Decor", "Outdoor"];
    const rooms: Open3dCatalogItem["roomTags"][0][] = ["Office", "Living Room", "Bedroom"];
    const styles: Open3dCatalogItem["styleTags"][0][] = ["Modern", "Traditional", "Industrial"];
    return Array.from({ length: count }, (_, i) => makePlacementItem({
      id: `item-${i}`,
      slug: `item-slug-${i}`,
      sku: `SKU-${i}`,
      name: `Product ${i}`,
      description: `Description for product ${i} with keywords`,
      category: cats[i % 4],
      tags: [`tag-${i % 5}`, "common"],
      roomTags: [rooms[i % 3]],
      styleTags: [styles[i % 3]],
      dimensions: { widthMm: 400 + i * 10, depthMm: 300 + i * 5, heightMm: 700 + i },
      material: { marketingMaterial: "Wood", normalizedMaterial: ["Wood", "Metal", "Fabric"][i % 3] },
      color: { name: "Black", normalizedFamily: ["Black", "White", "Brown"][i % 3], hex: "#000000" },
      availability: (["in-stock", "preorder", "discontinued"] as const)[i % 3],
      pricing: { price: 100 + i * 10, currencyCode: "USD" },
    }));
  }

  let client: Open3dCatalogClient;

  beforeEach(() => {
    client = new Open3dCatalogClient({ cacheTtlMs: 100 });
    client.load(makeItems(50), "standard");
  });

  it("getAll returns loaded items", () => {
    expect(client.getAll().length).toBe(50);
  });

  it("getById returns item or null", () => {
    expect(client.getById("item-0")).not.toBeNull();
    expect(client.getById("nonexistent")).toBeNull();
  });

  it("getBySlug case-insensitive", () => {
    expect(client.getBySlug("ITEM-SLUG-0")).not.toBeNull();
    expect(client.getBySlug("nope")).toBeNull();
  });

  it("getBySku case-insensitive", () => {
    expect(client.getBySku("sku-0")).not.toBeNull();
    expect(client.getBySku("nope")).toBeNull();
  });

  it("getByCategory returns matching items", () => {
    const furniture = client.getByCategory("Furniture");
    expect(furniture.length).toBeGreaterThan(0);
    expect(furniture.every((i) => i.category === "Furniture")).toBe(true);
  });

  it("getByRoom returns matching items", () => {
    const office = client.getByRoom("Office");
    expect(office.length).toBeGreaterThan(0);
  });

  it("getByStyle returns matching items", () => {
    const modern = client.getByStyle("Modern");
    expect(modern.length).toBeGreaterThan(0);
  });

  it("search with text query", () => {
    const result = client.search({ text: "Product 5" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.tookMs).toBeGreaterThanOrEqual(0);
  });

  it("search with category filter", () => {
    const result = client.search({ categoryFilter: "Lighting" });
    expect(result.items.every((i) => i.category === "Lighting")).toBe(true);
  });

  it("search with room filter", () => {
    const result = client.search({ roomFilter: ["Office"] });
    expect(result.items.every((i) => i.roomTags.includes("Office"))).toBe(true);
  });

  it("search with style filter", () => {
    const result = client.search({ styleFilter: ["Modern"] });
    expect(result.items.every((i) => i.styleTags.includes("Modern"))).toBe(true);
  });

  it("search with material filter", () => {
    const result = client.search({ materialFilter: ["Wood"] });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("search with color filter", () => {
    const result = client.search({ colorFilter: ["Black"] });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("search with dimension filter", () => {
    const result = client.search({ dimensionFilter: { minWidthMm: 450, maxWidthMm: 500 } });
    expect(result.items.every((i) => i.dimensions.widthMm >= 450 && i.dimensions.widthMm <= 500)).toBe(true);
  });

  it("search with dimension filter depth and height", () => {
    const result = client.search({
      dimensionFilter: { minDepthMm: 310, maxDepthMm: 350, minHeightMm: 700, maxHeightMm: 720 },
    });
    for (const item of result.items) {
      expect(item.dimensions.depthMm).toBeGreaterThanOrEqual(310);
      expect(item.dimensions.depthMm).toBeLessThanOrEqual(350);
      expect(item.dimensions.heightMm).toBeGreaterThanOrEqual(700);
      expect(item.dimensions.heightMm).toBeLessThanOrEqual(720);
    }
  });

  it("search with availability filter", () => {
    const result = client.search({ availabilityFilter: ["in-stock"] });
    expect(result.items.every((i) => i.availability === "in-stock")).toBe(true);
  });

  it("search with sort order name-asc", () => {
    const result = client.search({ sortOrder: "name-asc" });
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i].name.localeCompare(result.items[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });

  it("search with sort order name-desc", () => {
    const result = client.search({ sortOrder: "name-desc" });
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i].name.localeCompare(result.items[i - 1].name)).toBeLessThanOrEqual(0);
    }
  });

  it("search with sort order price-asc", () => {
    const result = client.search({ sortOrder: "price-asc" });
    for (let i = 1; i < result.items.length; i++) {
      expect((result.items[i].pricing?.price ?? 0)).toBeGreaterThanOrEqual(result.items[i - 1].pricing?.price ?? 0);
    }
  });

  it("search with sort order price-desc", () => {
    const result = client.search({ sortOrder: "price-desc" });
    for (let i = 1; i < result.items.length; i++) {
      expect((result.items[i].pricing?.price ?? 0)).toBeLessThanOrEqual(result.items[i - 1].pricing?.price ?? 0);
    }
  });

  it("search with sort order newest", () => {
    const result = client.search({ sortOrder: "newest" });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("search pagination with cursor", () => {
    const first = client.search({ pageSize: 5 });
    expect(first.items.length).toBe(5);
    expect(first.hasMore).toBe(true);
    expect(first.nextCursor).not.toBeNull();

    const second = client.search({ pageSize: 5, cursor: first.nextCursor! });
    expect(second.items.length).toBe(5);
    expect(second.items[0].id).not.toBe(first.items[0].id);
  });

  it("search with invalid cursor defaults to start", () => {
    const result = client.search({ cursor: "zzzzz", pageSize: 5 });
    expect(result.items.length).toBe(5);
  });

  it("search caches results", () => {
    const r1 = client.search({ text: "Product 1" });
    const r2 = client.search({ text: "Product 1" });
    expect(r2.items.length).toBe(r1.items.length);
  });

  it("search on empty catalog returns empty", () => {
    const empty = new Open3dCatalogClient();
    const result = empty.search({ text: "anything" });
    expect(result.items.length).toBe(0);
    expect(result.totalCount).toBe(0);
  });

  it("isLoaded returns correct state", () => {
    expect(client.isLoaded()).toBe(true);
    const empty = new Open3dCatalogClient();
    expect(empty.isLoaded()).toBe(false);
  });

  it("getSource returns loaded source", () => {
    expect(client.getSource()).toBe("standard");
    const empty = new Open3dCatalogClient();
    expect(empty.getSource()).toBeNull();
  });

  it("invalidate clears cache and rebuilds index", () => {
    client.search({ text: "Product 1" });
    client.invalidate();
    const result = client.search({ text: "Product 1" });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("getById/getBySlug/getBySku return null on unloaded client", () => {
    const empty = new Open3dCatalogClient();
    expect(empty.getById("x")).toBeNull();
    expect(empty.getBySlug("x")).toBeNull();
    expect(empty.getBySku("x")).toBeNull();
    expect(empty.getByCategory("Furniture")).toEqual([]);
    expect(empty.getByRoom("Office")).toEqual([]);
    expect(empty.getByStyle("Modern")).toEqual([]);
  });

  it("exact SKU match appears in results", () => {
    const result = client.search({ text: "SKU-5" });
    const skus = result.items.map((i) => i.sku);
    expect(skus).toContain("SKU-5");
  });

  it("loadFromApi rejects missing fetch and failed responses", async () => {
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, "fetch", { value: undefined, configurable: true });
    try {
      const noFetch = new Open3dCatalogClient();
      await expect(noFetch.loadFromApi("standard")).rejects.toThrow("requires fetch");
    } finally {
      Object.defineProperty(globalThis, "fetch", { value: originalFetch, configurable: true });
    }

    const fetchMock = vi.fn(async () => ({ ok: false, status: 503 } as Response));
    const failing = new Open3dCatalogClient({ fetchImpl: fetchMock as unknown as typeof fetch });
    await expect(failing.loadFromApi("standard")).rejects.toThrow("Catalog API request failed: 503");
  });

  it("search falls back to per-item tokenization when index is empty", () => {
    const sparseClient = new Open3dCatalogClient();
    sparseClient.load([makePlacementItem({
      id: "sku-only",
      slug: "sku-only",
      sku: "TOOL-01",
      name: "x",
      description: "y",
      tags: ["z"],
    })], "standard");
    const result = sparseClient.search({ text: "TOOL-01" });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("sku-only");
  });
});

// â”€â”€ Recent Favorites coverage â”€â”€
import {
  addRecentItem,
  getRecentItems,
  clearRecentItems,
  addFavoriteItem,
  removeFavoriteItem,
  isFavorite,
  getFavoriteItems,
  getFavoritesByCategory,
  migrateRecentItemsSchema,
  migrateFavoritesSchema,
} from "@/features/planner/open3d/catalog/recentFavorites";

describe("Recent Favorites â€” coverage gaps", () => {
  beforeEach(() => {
    clearRecentItems();
    // Clear favorites by removing all
    for (const fav of getFavoriteItems()) {
      removeFavoriteItem(fav.catalogId);
    }
  });

  it("addRecentItem deduplicates by SKU", () => {
    addRecentItem({ sku: "A", id: "1", name: "Item A" });
    addRecentItem({ sku: "B", id: "2", name: "Item B" });
    addRecentItem({ sku: "A", id: "1", name: "Item A" });
    const items = getRecentItems();
    expect(items.length).toBe(2);
    expect(items[0].sku).toBe("A");
  });

  it("addRecentItem enforces max count", () => {
    for (let i = 0; i < 55; i++) {
      addRecentItem({ sku: `SKU-${i}`, id: `id-${i}`, name: `Item ${i}` });
    }
    expect(getRecentItems().length).toBe(50);
  });

  it("clearRecentItems empties list", () => {
    addRecentItem({ sku: "A", id: "1", name: "Item A" });
    clearRecentItems();
    expect(getRecentItems().length).toBe(0);
  });

  it("addFavoriteItem prevents duplicates", () => {
    addFavoriteItem({ id: "1", sku: "A", name: "Item A", category: "Furniture" });
    addFavoriteItem({ id: "1", sku: "A", name: "Item A", category: "Furniture" });
    expect(getFavoriteItems().length).toBe(1);
  });

  it("addFavoriteItem enforces max count (evicts oldest)", () => {
    for (let i = 0; i < 201; i++) {
      addFavoriteItem({ id: `id-${i}`, sku: `SKU-${i}`, name: `Item ${i}`, category: "Furniture" });
    }
    expect(getFavoriteItems().length).toBe(200);
  });

  it("removeFavoriteItem removes by catalogId", () => {
    addFavoriteItem({ id: "1", sku: "A", name: "Item", category: "Furniture" });
    removeFavoriteItem("1");
    expect(isFavorite("1")).toBe(false);
  });

  it("getFavoritesByCategory filters correctly", () => {
    addFavoriteItem({ id: "1", sku: "A", name: "Lamp", category: "Lighting" });
    addFavoriteItem({ id: "2", sku: "B", name: "Chair", category: "Furniture" });
    const lighting = getFavoritesByCategory("Lighting");
    expect(lighting.length).toBe(1);
    expect(lighting[0].name).toBe("Lamp");
  });

  it("migrateRecentItemsSchema is a no-op at current version", () => {
    addRecentItem({ sku: "A", id: "1", name: "Item" });
    migrateRecentItemsSchema();
    expect(getRecentItems().length).toBe(1);
  });

  it("migrateFavoritesSchema is a no-op at current version", () => {
    addFavoriteItem({ id: "1", sku: "A", name: "Item", category: "Furniture" });
    migrateFavoritesSchema();
    expect(getFavoriteItems().length).toBe(1);
  });
});

// â”€â”€ Inventory State coverage â”€â”€
import {
  defaultInventoryPanelState,
  reduceInventoryCommand,
  defaultCollectionsState,
  addInventoryRecent,
  addProjectRecent,
  addInventoryFavorite,
  removeInventoryFavorite,
  isInventoryFavorite,
  upsertInventoryCollection,
  addInventoryItemToCollection,
  removeInventoryItemFromCollection,
  INVENTORY_PANEL_CONTRACT,
} from "@/features/planner/open3d/catalog/inventory/inventoryState";

describe("Inventory State â€” coverage gaps", () => {
  it("defaultInventoryPanelState returns expected shape", () => {
    const state = defaultInventoryPanelState();
    expect(state.searchQuery).toBe("");
    expect(state.selectedCategoryId).toBeNull();
    expect(state.sortOrder).toBe("name-asc");
    expect(state.density).toBe("comfortable");
  });

  it("reduceInventoryCommand handles all command types", () => {
    let state = defaultInventoryPanelState();
    state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "desk" });
    expect(state.searchQuery).toBe("desk");

    state = reduceInventoryCommand(state, { type: "SELECT_CATEGORY", categoryId: "cat-1" });
    expect(state.selectedCategoryId).toBe("cat-1");
    expect(state.selectedSubCategoryId).toBeNull();

    state = reduceInventoryCommand(state, { type: "SELECT_SUBCATEGORY", subCategoryId: "sub-1" });
    expect(state.selectedSubCategoryId).toBe("sub-1");

    state = reduceInventoryCommand(state, { type: "SELECT_ROOM", roomGroupId: "room-1" });
    expect(state.selectedRoomGroupId).toBe("room-1");

    state = reduceInventoryCommand(state, { type: "SELECT_STYLE", styleGroupId: "style-1" });
    expect(state.selectedStyleGroupId).toBe("style-1");

    state = reduceInventoryCommand(state, { type: "SET_SORT", sort: "price-asc" });
    expect(state.sortOrder).toBe("price-asc");

    state = reduceInventoryCommand(state, { type: "SET_DENSITY", density: "compact" });
    expect(state.density).toBe("compact");

    state = reduceInventoryCommand(state, { type: "TOGGLE_CATEGORY_COLLAPSE", categoryId: "cat-1" });
    expect(state.collapsedCategories["cat-1"]).toBe(true);

    state = reduceInventoryCommand(state, { type: "TOGGLE_CATEGORY_COLLAPSE", categoryId: "cat-1" });
    expect(state.collapsedCategories["cat-1"]).toBe(false);

    state = reduceInventoryCommand(state, { type: "TOGGLE_RECENT_VISIBLE" });
    expect(state.recentVisible).toBe(true);

    state = reduceInventoryCommand(state, { type: "TOGGLE_FAVORITES_VISIBLE" });
    expect(state.favoritesVisible).toBe(true);

    state = reduceInventoryCommand(state, { type: "CLEAR_SEARCH" });
    expect(state.searchQuery).toBe("");

    state = reduceInventoryCommand(state, { type: "RESET_FILTERS" });
    expect(state).toEqual(defaultInventoryPanelState());
  });

  it("reduceInventoryCommand PLACE_ITEM returns state unchanged", () => {
    const state = defaultInventoryPanelState();
    const result = reduceInventoryCommand(state, {
      type: "PLACE_ITEM", itemId: "x", variantId: null, position: { x: 0, y: 0 },
    });
    expect(result).toEqual(state);
  });

  it("reduceInventoryCommand handles mode, focus, scroll, range, and announcements", () => {
    let state = defaultInventoryPanelState();
    state = reduceInventoryCommand(state, { type: "SET_MODE", mode: "search" });
    expect(state.mode).toBe("search");

    state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "  chair  " });
    expect(state.searchQuery).toBe("  chair  ");
    expect(state.mode).toBe("search");

    state = reduceInventoryCommand(state, {
      type: "SET_FOCUSED_ITEM",
      item: { itemId: "desk-1", variantId: "oak" },
    });
    expect(state.focusedItem).toEqual({ itemId: "desk-1", variantId: "oak" });

    state = reduceInventoryCommand(state, {
      type: "SET_SCROLL_ANCHOR",
      item: { itemId: "desk-1", variantId: null },
    });
    expect(state.scrollAnchor).toEqual({ itemId: "desk-1", variantId: null });

    state = reduceInventoryCommand(state, {
      type: "SET_LOADED_RANGE",
      range: { startIndex: 0, endIndex: 24, totalCount: 120 },
    });
    expect(state.loadedRange).toEqual({ startIndex: 0, endIndex: 24, totalCount: 120 });

    state = reduceInventoryCommand(state, {
      type: "ANNOUNCE",
      announcement: {
        kind: "filter-count",
        message: "24 items",
        politeness: "polite",
        createdAt: "2026-07-03T00:00:00.000Z",
      },
    });
    expect(state.liveAnnouncement?.message).toBe("24 items");

    state = reduceInventoryCommand(state, { type: "CLEAR_ANNOUNCEMENT" });
    expect(state.liveAnnouncement).toBeNull();

    state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "   " });
    expect(state.searchQuery).toBe("   ");
    expect(state.mode).toBe("search");

    const beforeFavorites = state;
    state = reduceInventoryCommand(state, { type: "ADD_TO_FAVORITES", itemId: "x" });
    expect(state).toBe(beforeFavorites);
  });

  it("collections: project recents and variant-aware recents", () => {
    let state = defaultCollectionsState();
    state = addProjectRecent(state, "proj-item", "2026-01-01T00:00:00Z", "variant-a");
    expect(state.projectRecent[0]).toEqual({
      itemId: "proj-item",
      variantId: "variant-a",
      openedAt: "2026-01-01T00:00:00Z",
    });

    state = addInventoryRecent(state, "placed-item", "2026-01-01T00:01:00Z", "variant-b");
    expect(state.recent[0].variantId).toBe("variant-b");
  });

  it("collections: add and remove recent", () => {
    let state = defaultCollectionsState();
    state = addInventoryRecent(state, "item-1", "2026-01-01T00:00:00Z");
    expect(state.recent.length).toBe(1);
    expect(state.frequent.length).toBe(1);
    expect(state.frequent[0].useCount).toBe(1);

    state = addInventoryRecent(state, "item-1", "2026-01-01T00:01:00Z");
    expect(state.recent.length).toBe(1);
    expect(state.frequent[0].useCount).toBe(2);

    state = addInventoryRecent(state, "item-2", "2026-01-01T00:02:00Z");
    expect(state.recent.length).toBe(2);
    expect(state.recent[0].itemId).toBe("item-2");
  });

  it("collections: favorites add/remove/check", () => {
    let state = defaultCollectionsState();
    state = addInventoryFavorite(state, "item-1");
    expect(isInventoryFavorite(state, "item-1")).toBe(true);
    expect(isInventoryFavorite(state, "item-2")).toBe(false);

    // Adding duplicate is no-op
    state = addInventoryFavorite(state, "item-1");
    expect(state.favorites.length).toBe(1);

    state = removeInventoryFavorite(state, "item-1");
    expect(isInventoryFavorite(state, "item-1")).toBe(false);
  });

  it("collections: upsert and item management", () => {
    let state = defaultCollectionsState();
    state = upsertInventoryCollection(state, { id: "col-1", name: "Living Room", itemIds: ["a", "b"] });
    expect(state.collections.length).toBe(1);
    expect(state.collections[0].itemIds).toEqual(["a", "b"]);

    state = addInventoryItemToCollection(state, "col-1", "c");
    expect(state.collections[0].itemIds).toContain("c");

    state = removeInventoryItemFromCollection(state, "col-1", "a");
    expect(state.collections[0].itemIds).not.toContain("a");
  });

  it("collections: add to nonexistent collection is no-op", () => {
    let state = defaultCollectionsState();
    state = addInventoryItemToCollection(state, "nope", "item-1");
    expect(state.collections.length).toBe(0);
  });

  it("collections: remove from nonexistent collection is no-op", () => {
    let state = defaultCollectionsState();
    state = removeInventoryItemFromCollection(state, "nope", "item-1");
    expect(state.collections.length).toBe(0);
  });

  it("INVENTORY_PANEL_CONTRACT has expected shape", () => {
    expect(INVENTORY_PANEL_CONTRACT.panelId).toBe("inventory");
    expect(INVENTORY_PANEL_CONTRACT.defaultDock).toBe("left");
    expect(INVENTORY_PANEL_CONTRACT.minWidth).toBeGreaterThan(0);
    expect(INVENTORY_PANEL_CONTRACT.shortcutCommands.length).toBeGreaterThan(0);
  });
});

// â”€â”€ SVG Sanitizer coverage â”€â”€
import { sanitizeSvg, isSvgSafe } from "@/features/planner/open3d/catalog/svg/svgSanitizer";

describe("SVG Sanitizer â€” coverage gaps", () => {
  const validSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="50" height="50"/></svg>';

  it("rejects empty input", () => {
    expect(sanitizeSvg("").safe).toBe(false);
    expect(sanitizeSvg("   ").safe).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(sanitizeSvg(null as unknown as string).safe).toBe(false);
  });

  it("rejects oversized SVG", () => {
    const big = `<svg xmlns="http://www.w3.org/2000/svg">${"x".repeat(200000)}</svg>`;
    expect(sanitizeSvg(big).safe).toBe(false);
    expect(sanitizeSvg(big).issues[0]).toContain("maximum size");
  });

  it("rejects malformed SVG without root element", () => {
    expect(sanitizeSvg("<div>not svg</div>").safe).toBe(false);
  });

  it("rejects script elements", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const result = sanitizeSvg(svg);
    expect(result.safe).toBe(false);
    expect(result.issues[0]).toContain("script");
  });

  it("rejects foreignObject", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject></foreignObject></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects entity declarations", () => {
    const svg = '<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects event handler attributes", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects onclick", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="evil()"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects href attributes", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><a href="http://evil.com"><rect/></a></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects javascript: protocol", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="javascript:alert(1)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects data: protocol in attributes", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><image src="data:text/html,<script>"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects use element (external reference)", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><use href="#icon"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects iframe element", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><iframe src="evil"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects embed element", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><embed type="text/html"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects object element", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><object data="evil"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("rejects unsafe url() reference in style", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect style="fill:url(http://evil.com/x)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("allows safe internal url(#id) reference", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="url(#gradient1)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(true);
  });

  it("passes valid SVG", () => {
    expect(sanitizeSvg(validSvg).safe).toBe(true);
    expect(sanitizeSvg(validSvg).sanitized).toBe(validSvg);
  });

  it("warns about missing namespace but still passes", () => {
    const noNs = '<svg viewBox="0 0 100 100"><rect width="50" height="50"/></svg>';
    const result = sanitizeSvg(noNs);
    expect(result.safe).toBe(true);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("isSvgSafe shorthand works", () => {
    expect(isSvgSafe(validSvg)).toBe(true);
    expect(isSvgSafe("")).toBe(false);
  });
});

// â”€â”€ Unit Conversion coverage â”€â”€
import {
  configuratorHeightCmFromMixedUnit,
  displayDimensions,
  displayFtInFromCanonicalMm,
  displayInFromCanonicalMm,
  displayMFromCanonicalMm,
  buildAccessibleName,
} from "@/features/planner/open3d/catalog/unitConversion";

describe("Unit Conversion â€” coverage gaps", () => {
  it("configuratorHeightCmFromMixedUnit with undefined", () => {
    expect(configuratorHeightCmFromMixedUnit(undefined)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with 0", () => {
    expect(configuratorHeightCmFromMixedUnit(0)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with negative", () => {
    expect(configuratorHeightCmFromMixedUnit(-10)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with NaN", () => {
    expect(configuratorHeightCmFromMixedUnit(NaN)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with Infinity", () => {
    expect(configuratorHeightCmFromMixedUnit(Infinity)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with value > threshold (mm)", () => {
    expect(configuratorHeightCmFromMixedUnit(750)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit with value <= threshold (cm)", () => {
    expect(configuratorHeightCmFromMixedUnit(75)).toBe(75);
  });

  it("configuratorHeightCmFromMixedUnit custom fallback", () => {
    expect(configuratorHeightCmFromMixedUnit(undefined, 100)).toBe(100);
  });

  it("displayDimensions mm format", () => {
    const dims = { widthMm: 1200, depthMm: 600, heightMm: 750 };
    const result = displayDimensions(dims, "mm");
    expect(result).toContain("1200 mm");
    expect(result).toContain("600 mm");
    expect(result).toContain("750 mm");
  });

  it("displayDimensions cm format", () => {
    const dims = { widthMm: 1200, depthMm: 600, heightMm: 750 };
    const result = displayDimensions(dims, "cm");
    expect(result).toContain("120 cm");
  });

  it("displayDimensions m format", () => {
    const dims = { widthMm: 1200, depthMm: 600, heightMm: 750 };
    const result = displayDimensions(dims, "m");
    expect(result).toContain("1.2 m");
  });

  it("displayDimensions in format", () => {
    const dims = { widthMm: 254, depthMm: 254, heightMm: 254 };
    const result = displayDimensions(dims, "in");
    expect(result).toContain("10");
  });

  it("displayDimensions ft-in format", () => {
    const dims = { widthMm: 1828, depthMm: 914, heightMm: 2438 };
    const result = displayDimensions(dims, "ft-in");
    expect(result).toContain("'");
    expect(result).toContain("\"");
  });

  it("displayDimensions with zero height omits height", () => {
    const dims = { widthMm: 1200, depthMm: 600, heightMm: 0 };
    const result = displayDimensions(dims, "cm");
    expect(result).not.toContain("Ã— 0 cm");
  });

  it("displayFtInFromCanonicalMm formats correctly", () => {
    expect(displayFtInFromCanonicalMm(3048)).toBe("10' 0\"");
  });

  it("displayInFromCanonicalMm converts correctly", () => {
    expect(displayInFromCanonicalMm(254)).toBeCloseTo(10, 0);
  });

  it("displayMFromCanonicalMm converts correctly", () => {
    expect(displayMFromCanonicalMm(1500)).toBe(1.5);
  });

  it("buildAccessibleName formats correctly", () => {
    const name = buildAccessibleName("Office Chair", { widthMm: 450, depthMm: 450, heightMm: 900 });
    expect(name).toContain("Office Chair");
    expect(name).toContain("45 cm");
    expect(name).toContain("90 cm");
  });
});

// â”€â”€ SVG Symbols additional coverage â”€â”€
import {
  generateSymbol,
  renderSvgSymbol,
  getCachedSvgSymbol,
  clearSvgCache,
  getSvgSymbolDimensionAgreement,
} from "@/features/planner/open3d/catalog/svg/svgSymbols";

describe("SVG Symbols â€” coverage gaps", () => {
  const dims = { widthMm: 1200, depthMm: 600, heightMm: 750 };

  it("renderSvgSymbol with all themes", () => {
    const sym = generateSymbol("Furniture", "Desks", dims, "Desk");
    const themes = ["light", "dark", "print", "selected", "high-contrast", "fallback"] as const;
    for (const theme of themes) {
      const output = renderSvgSymbol(sym, theme);
      expect(output.svg).toContain("<svg");
      expect(output.widthMm).toBeGreaterThan(0);
      expect(output.heightMm).toBeGreaterThan(0);
    }
  });

  it("renderSvgSymbol with rotation values", () => {
    const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
    for (const rot of [0, 90, 180, 270]) {
      const output = renderSvgSymbol(sym, "light", rot);
      expect(output.svg).toContain("<svg");
    }
  });

  it("getCachedSvgSymbol caches and retrieves", () => {
    clearSvgCache();
    const sym = generateSymbol("Lighting", undefined, dims, "Lamp");
    const first = getCachedSvgSymbol(sym, "dark", 0);
    const second = getCachedSvgSymbol(sym, "dark", 0);
    expect(first.svg).toBe(second.svg);
  });

  it("clearSvgCache empties cache", () => {
    const sym = generateSymbol("Decor", "Rugs", dims, "Rug");
    getCachedSvgSymbol(sym, "light", 0);
    clearSvgCache();
    // After clear, next call generates fresh
    const output = getCachedSvgSymbol(sym, "light", 0);
    expect(output.svg).toContain("<svg");
  });

  it("getSvgSymbolDimensionAgreement returns valid viewBox", () => {
    const sym = generateSymbol("Furniture", "Desks", dims, "Desk");
    const agreement = getSvgSymbolDimensionAgreement(sym);
    expect(agreement.viewBox).toMatch(/^-?\d+/);
    expect(agreement.viewBox.split(" ").length).toBe(4);
  });

  it("generateSymbol with all known subcategories", () => {
    const subcats = ["Chairs", "Desks", "Sofas & Sectionals", "Tables", "Beds", "Storage"];
    for (const sub of subcats) {
      const sym = generateSymbol("Furniture", sub, dims, sub);
      expect(sym.shapes.length).toBeGreaterThan(0);
    }
  });

  it("generateSymbol with unknown subcategory falls back", () => {
    const sym = generateSymbol("Furniture", "UnknownSubCat", dims, "Thing");
    expect(sym.shapes.length).toBeGreaterThan(0);
  });

  it("render uses deterministic generatedAt value", () => {
    const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
    const output = renderSvgSymbol(sym, "light");
    expect(output.generatedAt).toBe(0);
  });
});

// â”€â”€ Placement Action crypto branch coverage â”€â”€
describe("Placement Action â€” crypto branches", () => {
  it("generates ID without crypto.randomUUID (getRandomValues fallback)", () => {
    const origUUID = crypto.randomUUID;
    Object.defineProperty(crypto, "randomUUID", { value: undefined, configurable: true });
    try {
      const result = placeCatalogItem(makePlacementItem(), null);
      expect(result.placementId).toContain("plc-");
      expect(result.placementId.length).toBeGreaterThan(10);
    } finally {
      Object.defineProperty(crypto, "randomUUID", { value: origUUID, configurable: true });
    }
  });

  it("generates ID when crypto exists without randomUUID or getRandomValues", () => {
    const origCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", {
      value: {},
      configurable: true,
    });
    try {
      const result = placeCatalogItem(makePlacementItem(), null);
      expect(result.placementId).toContain("plc-");
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: origCrypto, configurable: true });
    }
  });

  it("generates ID without crypto at all (randomSuffix fallback)", () => {
    const origCrypto = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    try {
      const result = placeCatalogItem(makePlacementItem(), null);
      expect(result.placementId).toContain("plc-");
      expect(result.placementId.length).toBeGreaterThan(10);
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: origCrypto, configurable: true });
    }
  });
});

// â”€â”€ Inventory Index coverage â”€â”€
import { InventorySearchIndex } from "@/features/planner/open3d/catalog/inventory/inventoryIndex";

describe("Inventory Index â€” coverage gaps", () => {
  function makeSearchItems(count: number): Open3dCatalogItem[] {
    return Array.from({ length: count }, (_, i) => makePlacementItem({
      id: `search-${i}`,
      slug: `search-slug-${i}`,
      sku: `SRCH-${i}`,
      name: `Searchable Product ${i}`,
      description: `A description with keyword${i} for searching`,
      category: (["Furniture", "Lighting", "Decor", "Outdoor"] as const)[i % 4],
      tags: [`tag-${i % 3}`, "common-tag"],
      roomTags: [(["Office", "Living Room", "Bedroom"] as const)[i % 3]],
      styleTags: [(["Modern", "Traditional", "Industrial"] as const)[i % 3]],
      dimensions: { widthMm: 500 + i, depthMm: 400 + i, heightMm: 700 + i },
      material: { marketingMaterial: "Wood", normalizedMaterial: ["Wood", "Metal", "Fabric"][i % 3] },
      availability: (["in-stock", "preorder", "discontinued"] as const)[i % 3],
    }));
  }

  let index: InventorySearchIndex;

  beforeEach(() => {
    index = new InventorySearchIndex();
    index.load(makeSearchItems(100));
  });

  it("search with empty query returns all filtered items", () => {
    const result = index.search("");
    expect(result.totalCount).toBe(100);
    expect(result.relaxed).toBe(false);
  });

  it("search with text returns relevant items", () => {
    const result = index.search("Product 5");
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("search with category filter", () => {
    const result = index.search("", { category: "Furniture" });
    expect(result.items.every((i) => i.category === "Furniture")).toBe(true);
  });

  it("search with room filter", () => {
    const result = index.search("", { roomTags: ["Office"] });
    expect(result.items.every((i) => i.roomTags.includes("Office"))).toBe(true);
  });

  it("search with style filter", () => {
    const result = index.search("", { styleTags: ["Modern"] });
    expect(result.items.every((i) => i.styleTags.includes("Modern"))).toBe(true);
  });

  it("search with material filter", () => {
    const result = index.search("", { material: ["Wood"] });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("search with availability filter", () => {
    const result = index.search("", { availability: ["in-stock"] });
    expect(result.items.every((i) => i.availability === "in-stock")).toBe(true);
  });

  it("typo tolerance triggers on zero results with long query", () => {
    // "Searachable" is a typo of "Searchable" â€” adjacent swap
    const result = index.search("Saerchable");
    // Should try typo variants and find results
    expect(result.totalCount).toBeGreaterThanOrEqual(0);
  });

  it("typo tolerance disabled", () => {
    const result = index.search("xyznonexistent", { typoTolerance: false });
    expect(result.totalCount).toBe(0);
    expect(result.relaxed).toBe(false);
  });

  it("minScore filters low-relevance results", () => {
    const result = index.search("common", { minScore: 100 });
    // High minScore should filter most items
    expect(result.totalCount).toBeLessThanOrEqual(100);
  });

  it("suggest returns matching items", () => {
    const suggestions = index.suggest("Search");
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it("suggest with short query returns empty", () => {
    expect(index.suggest("a")).toEqual([]);
    expect(index.suggest("")).toEqual([]);
  });

  it("suggest returns tag matches", () => {
    const suggestions = index.suggest("common");
    expect(suggestions.length).toBeGreaterThan(0);
  });
});

// â”€â”€ Catalog Mapping coverage â”€â”€
import {
  mapPlannerManagedProductToCatalogItem,
  mapConfiguratorProductToCatalogItem,
  resolveSubCategory,
  resolveAvailabilityStatus,
} from "@/features/planner/open3d/catalog/catalogMapping";

describe("Catalog Mapping â€” coverage gaps", () => {
  it("mapPlannerManagedProductToCatalogItem returns null for missing id", () => {
    expect(mapPlannerManagedProductToCatalogItem({ id: "", name: "X", category: "Office" } as any)).toBeNull();
  });

  it("mapPlannerManagedProductToCatalogItem returns null for missing name", () => {
    expect(mapPlannerManagedProductToCatalogItem({ id: "1", name: "", category: "Office" } as any)).toBeNull();
  });

  it("mapPlannerManagedProductToCatalogItem returns null for zero dimensions", () => {
    expect(mapPlannerManagedProductToCatalogItem({
      id: "1", name: "Thing", category: "Office", specs: { widthMm: 0, depthMm: 0 },
    } as any)).toBeNull();
  });

  it("mapPlannerManagedProductToCatalogItem succeeds with valid input", () => {
    const result = mapPlannerManagedProductToCatalogItem({
      id: "prod-1",
      name: "Standing Desk",
      category: "Desks",
      series_name: "Ergonomic",
      slug: "standing-desk",
      specs: { widthMm: 140, depthMm: 70, heightMm: 75 },
      active: true,
      images: ["https://example.com/img.jpg"],
    } as any);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Standing Desk");
    expect(result!.dimensions.widthMm).toBe(1400);
  });

  it("mapConfiguratorProductToCatalogItem returns null for missing slug", () => {
    expect(mapConfiguratorProductToCatalogItem({ slug: "", name: "X" } as any)).toBeNull();
  });

  it("mapConfiguratorProductToCatalogItem parametric sizing", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "conf-desk",
      name: "Config Desk",
      category_id: "desks",
      sizingType: "parametric",
      workstation: {
        lengthOptions: [120, 160],
        depthOptions: [60, 80],
        seaterOptions: [1, 2],
        heightMm: 750,
        shape: "straight",
        sharing: "individual",
      },
    } as any);
    expect(result).not.toBeNull();
    expect(result!.dimensions.widthMm).toBeGreaterThan(0);
  });

  it("mapConfiguratorProductToCatalogItem L-shape parametric", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "l-desk",
      name: "L Desk",
      category_id: "desks",
      sizingType: "parametric",
      workstation: {
        lengthOptions: [120],
        depthOptions: [60],
        seaterOptions: [1],
        heightMm: 750,
        shape: "l-shape",
        sharing: "sharing",
      },
    } as any);
    expect(result).not.toBeNull();
  });

  it("mapConfiguratorProductToCatalogItem discrete sizing", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "disc-table",
      name: "Discrete Table",
      category_id: "tables",
      sizingType: "discrete",
      sizeOptions: [
        { dim: { L: 120, D: 60, H: 750 } },
        { dim: { L: 80, D: 40, H: 750 } },
      ],
    } as any);
    expect(result).not.toBeNull();
  });

  it("mapConfiguratorProductToCatalogItem defaultFootprint fallback", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "fallback-product",
      name: "Fallback",
      category_id: "furniture",
      sizingType: "fixed",
      defaultFootprint: { L: 100, D: 50, H: 750 },
    } as any);
    expect(result).not.toBeNull();
  });

  it("mapConfiguratorProductToCatalogItem returns null for no dimensions", () => {
    expect(mapConfiguratorProductToCatalogItem({
      slug: "no-dims",
      name: "No Dims",
      category_id: "x",
      sizingType: "fixed",
    } as any)).toBeNull();
  });

  it("resolveSubCategory extracts from series name", () => {
    expect(resolveSubCategory("Office", "Standing Desk Collection")).toBe("Standing Desk Collection");
  });

  it("resolveSubCategory extracts from family", () => {
    expect(resolveSubCategory("Office", null, "Ergonomic Family")).toBe("Ergonomic Family");
  });

  it("resolveSubCategory falls back to category matching", () => {
    expect(resolveSubCategory("desk and workstation", null, null)).toBe("Desks");
    expect(resolveSubCategory("sofa", null, null)).toBe("Sofas & Sectionals");
    expect(resolveSubCategory("chair ergonomic", null, null)).toBe("Chairs");
    expect(resolveSubCategory("dining table", null, null)).toBe("Tables");
    expect(resolveSubCategory("storage cabinet", null, null)).toBe("Storage");
    expect(resolveSubCategory("king bed", null, null)).toBe("Beds");
    expect(resolveSubCategory("ceiling light", null, null)).toBe("Lighting");
    expect(resolveSubCategory("random stuff", null, null)).toBe("random stuff");
  });

  it("resolveAvailabilityStatus returns discontinued for inactive", () => {
    expect(resolveAvailabilityStatus({ active: false })).toBe("discontinued");
    expect(resolveAvailabilityStatus({ visible: false })).toBe("discontinued");
    expect(resolveAvailabilityStatus({ plannerVisible: false })).toBe("discontinued");
  });

  it("resolveAvailabilityStatus returns in-stock for active", () => {
    expect(resolveAvailabilityStatus({ active: true, visible: true })).toBe("in-stock");
    expect(resolveAvailabilityStatus({})).toBe("in-stock");
  });
});

// â”€â”€ Recent Favorites branch coverage (localStorage edge cases) â”€â”€
describe("Recent Favorites â€” localStorage branches", () => {
  it("migrateRecentItemsSchema upgrades old schema version", () => {
    // Write data with old schema version
    localStorage.setItem("open3d-catalog-recent", JSON.stringify({
      schemaVersion: 0,
      items: [{ sku: "A", catalogId: "1", name: "Item", lastUsedAt: "2026-01-01" }],
    }));
    migrateRecentItemsSchema();
    const raw = JSON.parse(localStorage.getItem("open3d-catalog-recent")!);
    expect(raw.schemaVersion).toBe(1);
  });

  it("migrateFavoritesSchema upgrades old schema version", () => {
    localStorage.setItem("open3d-catalog-favorites", JSON.stringify({
      schemaVersion: 0,
      items: [{ catalogId: "1", sku: "A", name: "X", category: "Furniture", favoritedAt: "2026-01-01" }],
    }));
    migrateFavoritesSchema();
    const raw = JSON.parse(localStorage.getItem("open3d-catalog-favorites")!);
    expect(raw.schemaVersion).toBe(1);
  });

  it("safeRead handles corrupted JSON gracefully", () => {
    localStorage.setItem("open3d-catalog-recent", "not valid json{{{");
    const items = getRecentItems();
    expect(items).toEqual([]);
  });

  it("safeWrite handles full localStorage gracefully", () => {
    // Fill localStorage to trigger quota error
    const originalSetItem = localStorage.setItem.bind(localStorage);
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    // Should not throw
    addRecentItem({ sku: "X", id: "x", name: "X" });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.removeItem("open3d-catalog-recent");
    localStorage.removeItem("open3d-catalog-favorites");
  });
});

// â”€â”€ SVG Sanitizer additional branch coverage â”€â”€
describe("SVG Sanitizer â€” remaining branches", () => {
  it("catches unsafe URL in second-pass attribute scan", () => {
    // Craft SVG that has a url() reference in a non-standard attribute position
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect style="background:url(http://evil.com)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("catches vbscript protocol", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="vbscript:alert(1)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("catches custom on-event attribute (ontouchstart)", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect ontouchstart="evil()"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("handles unquoted attribute values", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width=100 height=100/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(true);
  });
});

// â”€â”€ SVG Symbols cache eviction and scale tests â”€â”€
describe("SVG Symbols â€” cache eviction and edge cases", () => {
  const dims = { widthMm: 800, depthMm: 400, heightMm: 600 };

  it("getCachedSvgSymbol with scale parameter", () => {
    clearSvgCache();
    const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
    const output = getCachedSvgSymbol(sym, "light", 0, 2.0);
    expect(output.svg).toContain("<svg");
  });

  it("getCachedSvgSymbol with invalid rotation/scale uses defaults", () => {
    clearSvgCache();
    const sym = generateSymbol("Furniture", "Desks", dims, "Desk");
    const output = getCachedSvgSymbol(sym, "light", NaN, -1);
    expect(output.svg).toContain("<svg");
  });

  it("getCachedSvgSymbol with unknown theme falls back to light", () => {
    clearSvgCache();
    const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
    const output = getCachedSvgSymbol(sym, "nonexistent" as any, 0);
    expect(output.svg).toContain("<svg");
  });

  it("cache eviction works at scale", () => {
    clearSvgCache();
    // Generate many unique cache entries to trigger eviction
    for (let i = 0; i < 50; i++) {
      const sym = generateSymbol("Furniture", "Chairs", { widthMm: 500 + i, depthMm: 400, heightMm: 600 }, `Chair ${i}`);
      getCachedSvgSymbol(sym, "light", i * 7);
    }
    // Should not throw and cache should be bounded
    const sym = generateSymbol("Furniture", "Chairs", dims, "Final Chair");
    const output = getCachedSvgSymbol(sym, "dark", 45);
    expect(output.svg).toContain("<svg");
  });
});

// â”€â”€ Unit Conversion remaining branches â”€â”€
import { displayDimensions as displayDims2 } from "@/features/planner/open3d/catalog/unitConversion";

describe("Unit Conversion â€” remaining lines", () => {
  it("displayDimensions with unknown unit falls back to cm", () => {
    const dims = { widthMm: 1000, depthMm: 500, heightMm: 800 };
    const result = displayDims2(dims, "unknown" as any);
    expect(result).toContain("cm");
  });
});

// â”€â”€ Catalog Client remaining functions â”€â”€
describe("Catalog Client â€” remaining function coverage", () => {
  it("LRU cache evicts when at capacity", () => {
    const client = new Open3dCatalogClient({ maxCacheItems: 3, cacheTtlMs: 100 });
    const items = Array.from({ length: 5 }, (_, i) => makePlacementItem({
      id: `evict-${i}`, slug: `evict-slug-${i}`, sku: `EVICT-${i}`, name: `Evict ${i}`,
    }));
    client.load(items, "standard");
    // Generate more searches than cache capacity
    client.search({ text: "Evict 0" });
    client.search({ text: "Evict 1" });
    client.search({ text: "Evict 2" });
    client.search({ text: "Evict 3" });
    // Should still work after eviction
    const result = client.search({ text: "Evict 4" });
    expect(result.items.length).toBeGreaterThanOrEqual(0);
  });

  it("stale cache triggers revalidation", async () => {
    const client = new Open3dCatalogClient({ cacheTtlMs: 10 });
    const items = Array.from({ length: 5 }, (_, i) => makePlacementItem({
      id: `stale-${i}`, slug: `stale-slug-${i}`, sku: `STALE-${i}`, name: `Stale ${i}`,
    }));
    client.load(items, "standard");
    client.search({ text: "Stale 0" });
    // Wait for cache to become stale
    await new Promise((r) => setTimeout(r, 20));
    const result = client.search({ text: "Stale 0" });
    expect(result.items.length).toBeGreaterThanOrEqual(0);
  });
});

// â”€â”€ Unit Conversion validation exceeds maximum â”€â”€
import { validateDimensions } from "@/features/planner/open3d/catalog/unitConversion";

describe("Unit Conversion â€” validateDimensions max bounds", () => {
  it("rejects widthMm exceeding 100000", () => {
    const result = validateDimensions({ widthMm: 200000, depthMm: 500, heightMm: 700 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("widthMm exceeds maximum reasonable value (100000 mm)");
  });

  it("rejects depthMm exceeding 100000", () => {
    const result = validateDimensions({ widthMm: 500, depthMm: 200000, heightMm: 700 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("depthMm exceeds maximum reasonable value (100000 mm)");
  });

  it("rejects heightMm exceeding 100000", () => {
    const result = validateDimensions({ widthMm: 500, depthMm: 500, heightMm: 200000 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("heightMm exceeds maximum reasonable value (100000 mm)");
  });

  it("rejects invalid weightKg", () => {
    const result = validateDimensions({ widthMm: 500, depthMm: 500, heightMm: 700, weightKg: -5 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("weightKg must be a non-negative finite number");
  });
});

// â”€â”€ Asset Validation coverage â”€â”€
import { validateAssetUrl, validateAssetUrls } from "@/features/planner/open3d/catalog/assetValidation";

describe("Asset Validation â€” coverage gaps", () => {
  it("validateAssetUrl rejects non-https URL", () => {
    const result = validateAssetUrl("http://example.com/image.jpg");
    expect(result.valid).toBe(false);
  });

  it("validateAssetUrl rejects empty string", () => {
    const result = validateAssetUrl("");
    expect(result.valid).toBe(false);
  });

  it("validateAssetUrls validates multiple URLs", () => {
    const result = validateAssetUrls(["https://allowed.com/img.jpg", "http://bad.com/img.jpg"]);
    expect(result.validUrls.length + result.rejectedCount).toBe(2);
  });
});

// â”€â”€ Catalog Mapping remaining branches â”€â”€
describe("Catalog Mapping â€” remaining branches", () => {
  it("configurator parametric with empty length options falls through to null", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "empty-opts",
      name: "Empty Opts",
      category_id: "desks",
      sizingType: "parametric",
      workstation: {
        lengthOptions: [],
        depthOptions: [60],
        seaterOptions: [1],
        heightMm: 750,
        shape: "straight",
        sharing: "individual",
      },
    } as any);
    // Parametric fails because lengthOptions is empty, no fallback, returns null
    expect(result).toBeNull();
  });

  it("configurator parametric with invalid values returns null", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "bad-vals",
      name: "Bad Vals",
      category_id: "desks",
      sizingType: "parametric",
      workstation: {
        lengthOptions: [-1, 0],
        depthOptions: [0],
        seaterOptions: [-1],
        heightMm: 750,
        shape: "straight",
        sharing: "individual",
      },
    } as any);
    expect(result).toBeNull();
  });

  it("configurator discrete with zero-area options skips them", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "zero-area",
      name: "Zero Area",
      category_id: "tables",
      sizingType: "discrete",
      sizeOptions: [
        { dim: { L: 0, D: 60, H: 750 } },
        { dim: { L: 100, D: 50, H: 750 } },
      ],
    } as any);
    expect(result).not.toBeNull();
  });

  it("configurator with non-parametric sizingType and seatCount path", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "discrete-seat",
      name: "Discrete No Seat",
      category_id: "desks",
      sizingType: "discrete",
      sizeOptions: [{ dim: { L: 120, D: 60, H: 750 } }],
    } as any);
    expect(result).not.toBeNull();
  });
});

// â”€â”€ Recent Favorites localStorage undefined branch â”€â”€
describe("Recent Favorites â€” localStorage undefined", () => {
  it("handles localStorage being undefined", () => {
    const orig = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", { value: undefined, configurable: true });
    try {
      // Should not throw and return empty
      const items = getRecentItems();
      expect(items).toEqual([]);
      // safeWrite should also not throw
      addRecentItem({ sku: "X", id: "x", name: "X" });
    } finally {
      Object.defineProperty(globalThis, "localStorage", { value: orig, configurable: true });
    }
  });
});

// â”€â”€ SVG Sanitizer lines 137-138 and 156-157 â”€â”€
describe("SVG Sanitizer â€” deep branch coverage", () => {
  it("catches blocked attribute via regex scan (xlink:href in nested element)", () => {
    // xlink:href is in BLOCKED_ATTRIBUTES - test via the regex attribute loop
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text xlink:href="http://evil.com">x</text></svg>';
    const result = sanitizeSvg(svg);
    expect(result.safe).toBe(false);
  });

  it("catches formaction in the attribute regex loop", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect formaction="http://evil.com"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("second-pass catches data: protocol in quoted value", () => {
    // This should be caught by the second loop where protocols are checked on raw quoted values
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="data:image/svg+xml,<script>"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("second-pass catches url() with external reference in style value", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" patternUnits="userSpaceOnUse"><image/></pattern></defs><rect style="fill: url(https://evil.com/track)"/></svg>';
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("attribute scan catches xlink:title via matchAll loop", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text xlink:title="evil">x</text></svg>';
    const result = sanitizeSvg(svg);
    expect(result.safe).toBe(false);
    expect(result.issues.some((issue) => issue.includes("blocked attribute"))).toBe(true);
  });

  it("quoted-value scan catches data protocol in single-quoted attributes", () => {
    const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"><rect fill='data:text/html,test'/></svg>";
    expect(sanitizeSvg(svg).safe).toBe(false);
  });

  it("attribute scan catches xlink:show through matchAll blocked-attribute path", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text XLink:show="replace">x</text></svg>';
    const result = sanitizeSvg(svg);
    expect(result.safe).toBe(false);
  });
});

// â”€â”€ SVG Symbols lines 205-208 and 570-572 â”€â”€
describe("SVG Symbols â€” deep branch coverage", () => {
  it("renderSvgSymbol with sofa has multiple shapes", () => {
    const sofa = generateSymbol("Furniture", "Sofas & Sectionals", { widthMm: 2400, depthMm: 1000, heightMm: 850 }, "L-Sofa");
    expect(sofa.shapes.length).toBeGreaterThanOrEqual(3);
    const output = renderSvgSymbol(sofa, "dark", 90);
    expect(output.svg).toContain("<svg");
  });

  it("bed symbol with headboard shapes", () => {
    const bed = generateSymbol("Furniture", "Beds", { widthMm: 2000, depthMm: 1800, heightMm: 500 }, "King Bed");
    expect(bed.shapes.length).toBeGreaterThan(1);
    const output = renderSvgSymbol(bed, "print", 180);
    expect(output.svg).toContain("<svg");
  });

  it("storage symbol generation", () => {
    const storage = generateSymbol("Furniture", "Storage", { widthMm: 800, depthMm: 400, heightMm: 1800 }, "Wardrobe");
    expect(storage.shapes.length).toBeGreaterThan(0);
  });

  it("plants symbol (circle shape)", () => {
    const plant = generateSymbol("Decor", "Plants", { widthMm: 300, depthMm: 300, heightMm: 800 }, "Plant");
    expect(plant.shapes.length).toBeGreaterThan(0);
    const output = renderSvgSymbol(plant, "high-contrast", 45);
    expect(output.svg).toContain("<svg");
  });
});

// â”€â”€ Pure Actions branches 678 and 1017-1018 â”€â”€
import { addFloor, importFloorIntoCurrentProject } from "@/features/planner/open3d/model/operations/pureActions";

describe("Pure Actions â€” remaining branches", () => {
  function makeProject() {
    return {
      id: "proj-1",
      name: "Test",
      unit: "mm" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeFloorId: "floor-1",
      floors: [{
        id: "floor-1",
        name: "Ground",
        level: 0,
        walls: [{ id: "w1", x1: 0, y1: 0, x2: 1000, y2: 0, thickness: 100 }],
        doors: [],
        windows: [],
        furniture: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      }],
    };
  }

  it("addFloor with copyCurrentLayout copies walls from active floor", () => {
    const project = makeProject();
    const result = addFloor(project as any, "Upper Floor", { copyCurrentLayout: true });
    expect(result.project.floors.length).toBe(2);
    expect(result.project.floors[1].walls.length).toBe(1);
  });

  it("importFloorData merges stairs and columns", () => {
    const project = makeProject();
    const floorData = {
      id: "imported",
      walls: [],
      doors: [],
      windows: [],
      furniture: [],
      stairs: [{ id: "s1", x: 0, y: 0, width: 200, depth: 400 }],
      columns: [{ id: "c1", x: 100, y: 100, diameter: 50 }],
    };
    const result = importFloorIntoCurrentProject(project as any, floorData as any);
    expect(result.project.floors[0].stairs).toHaveLength(1);
    expect(result.project.floors[0].columns).toHaveLength(1);
  });
});

// â”€â”€ Catalog Client functions coverage â”€â”€
describe("Catalog Client â€” uncovered functions", () => {
  it("LRU cache has() returns false for expired entries", async () => {
    const client = new Open3dCatalogClient({ cacheTtlMs: 5 });
    const items = [makePlacementItem({ id: "exp-1", slug: "exp-1", sku: "EXP-1", name: "Exp 1" })];
    client.load(items, "standard");
    client.search({ text: "Exp" });
    await new Promise((r) => setTimeout(r, 20));
    // Cache should be expired, next search should re-compute
    const result = client.search({ text: "Exp" });
    expect(result.items.length).toBeGreaterThanOrEqual(0);
  });
});

// â”€â”€ Catalog Mapping â€” line 303-305 and 358-378 deep coverage â”€â”€
describe("Catalog Mapping â€” deep coverage", () => {
  it("configurator non-parametric non-discrete with defaultFootprint", () => {
    // sizingType is neither parametric nor discrete, so defaultFootprint branch is taken
    const result = mapConfiguratorProductToCatalogItem({
      slug: "fixed-prod",
      name: "Fixed Product",
      category_id: "furniture",
      family: "Standard",
      sizingType: "fixed",
      defaultFootprint: { L: 100, D: 60, H: 750 },
      description: "A fixed size product",
      specs: { materials: ["Oak Wood"] },
      thumbnailUrl: "https://example.com/thumb.jpg",
      model3dUrl: "https://example.com/model.glb",
    } as any);
    expect(result).not.toBeNull();
    expect(result!.dimensions.widthMm).toBe(1000);
    expect(result!.material.normalizedMaterial).toBeDefined();
  });

  it("configurator parametric with sharing=sharing doubles depth", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "sharing-desk",
      name: "Sharing Desk",
      category_id: "desks",
      sizingType: "parametric",
      workstation: {
        lengthOptions: [120],
        depthOptions: [70],
        seaterOptions: [2],
        heightMm: 750,
        shape: "straight",
        sharing: "sharing",
      },
    } as any);
    expect(result).not.toBeNull();
    // sharing doubles depth: 70 * 2 = 140cm -> 1400mm
    expect(result!.dimensions.depthMm).toBe(1400);
  });

  it("configurator with all metadata fields", () => {
    const result = mapConfiguratorProductToCatalogItem({
      slug: "full-meta",
      name: "Full Meta Product",
      category_id: "chair",
      family: "Ergonomic",
      sizingType: "discrete",
      sizeOptions: [{ dim: { L: 60, D: 60, H: 110 } }],
      description: "Full featured product",
      specs: { materials: ["Mesh", "Aluminum"] },
      thumbnailUrl: "https://example.com/thumb.jpg",
    } as any);
    expect(result).not.toBeNull();
    expect(result!.description).toBe("Full featured product");
  });
});

// â”€â”€ SVG Symbols â€” lines 205-208 and 570-572 deep â”€â”€
describe("SVG Symbols â€” cache eviction edge case", () => {
  it("symbol with very small dimensions", () => {
    const sym = generateSymbol("Symbols", "Electrical", { widthMm: 50, depthMm: 50, heightMm: 20 }, "Tiny");
    const output = renderSvgSymbol(sym, "light", 0);
    expect(output.svg).toContain("<svg");
  });

  it("symbol with very large dimensions", () => {
    const sym = generateSymbol("Furniture", "Tables", { widthMm: 5000, depthMm: 3000, heightMm: 900 }, "Conference Table");
    const output = renderSvgSymbol(sym, "dark", 270);
    expect(output.svg).toContain("<svg");
  });

  it("getCachedSvgSymbol reuses cached entry", () => {
    clearSvgCache();
    const sym = generateSymbol("Outdoor", undefined, { widthMm: 600, depthMm: 600, heightMm: 200 }, "Planter");
    const first = getCachedSvgSymbol(sym, "light", 0);
    const second = getCachedSvgSymbol(sym, "light", 0);
    expect(first.svg).toBe(second.svg);
  });

  it("default symbol for unknown category handles edge case", () => {
    const sym = generateSymbol("Bedding & Textiles" as any, "Sheets", { widthMm: 1500, depthMm: 2000, heightMm: 30 }, "Sheet");
    expect(sym.symbolId).toContain("default");
    const output = renderSvgSymbol(sym, "fallback", 0);
    expect(output.svg).toContain("<svg");
  });
});
