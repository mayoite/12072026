import { describe, expect, it } from "vitest";
import {
  mergeWorkspaceCatalogItems,
  mergeWorkspaceCatalogItemsLayered,
} from "@/features/planner/catalog-api/mergeCatalogItems";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

function item(partial: Partial<CatalogItem> & Pick<CatalogItem, "id" | "name">): CatalogItem {
  return {
    category: "desks",
    shapeType: "planner-desk",
    widthMm: 120,
    heightMm: 60,
    depthMm: 60,
    description: "test",
    tags: [],
    ...partial,
  };
}

describe("mergeCatalogItems", () => {
  it("managed layer wins on same id", () => {
    const merged = mergeWorkspaceCatalogItems(
      [item({ id: "a", name: "static" })],
      [item({ id: "a", name: "managed" })],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.name).toBe("managed");
  });

  it("evicts static item when managed item shares its sku", () => {
    const merged = mergeWorkspaceCatalogItems(
      [item({ id: "static-1", name: "Static", sku: "SKU-1" })],
      [item({ id: "managed-1", name: "Managed", sku: "SKU-1" })],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.id).toBe("managed-1");
    expect(merged[0]?.name).toBe("Managed");
  });

  it("keeps non-colliding items from every layer", () => {
    const merged = mergeWorkspaceCatalogItemsLayered(
      [item({ id: "a", name: "A" })],
      [item({ id: "b", name: "B" })],
      [item({ id: "c", name: "C" })],
    );
    expect(merged.map((i) => i.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("later layer replaces earlier on id collision", () => {
    const merged = mergeWorkspaceCatalogItemsLayered(
      [item({ id: "x", name: "first" })],
      [item({ id: "x", name: "second" })],
      [item({ id: "x", name: "third" })],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.name).toBe("third");
  });
});
