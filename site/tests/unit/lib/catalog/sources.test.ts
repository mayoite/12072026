import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchAllProductsLive,
  fetchProductsByCategoryLive,
  fetchProductByUrlKeyLive,
  fetchCategoryIdsLive,
} from "@/lib/catalog/sources";
import {
  canQueryCatalogDatabase,
  fetchCatalogProductsLive,
  fetchCatalogProductsByCategoryLive,
  fetchCatalogProductBySlugLive,
  fetchCatalogCategoryIdsLive,
} from "@/lib/catalog/catalogDrizzle";
import { resolveCatalogFallbackProducts } from "@/lib/catalog/catalogFallbackResolver";

vi.mock("@/lib/catalog/catalogDrizzle", () => ({
  canQueryCatalogDatabase: vi.fn(),
  fetchCatalogProductsLive: vi.fn(),
  fetchCatalogProductsByCategoryLive: vi.fn(),
  fetchCatalogProductBySlugLive: vi.fn(),
  fetchCatalogCategoryIdsLive: vi.fn(),
  fetchCatalogCategoriesLive: vi.fn(),
}));

vi.mock("@/lib/catalog/catalogFallbackResolver", () => ({
  resolveCatalogFallbackProducts: vi.fn(),
}));

vi.mock("@/lib/catalog/adapters", () => ({
  normalizeProducts: vi.fn((x) => x),
}));

describe("sources", () => {
  const mockFallbackProducts = [
    { slug: "chair-a", category_id: "chairs", name: "Chair A" },
    { slug: "desk-b", category_id: "desks", name: "Desk B" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(resolveCatalogFallbackProducts).mockResolvedValue(mockFallbackProducts as any);
  });

  describe("fetchAllProductsLive", () => {
    it("should return fallback products if catalog DB is not configured", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(false);
      const res = await fetchAllProductsLive();
      expect(res).toEqual(mockFallbackProducts);
    });

    it("should fetch products from Drizzle when configured", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
      vi.mocked(fetchCatalogProductsLive).mockResolvedValue([{ name: "Live A" } as any]);

      const res = await fetchAllProductsLive();
      expect(res).toEqual([{ name: "Live A" }]);
    });

    it("should return fallback if Drizzle returns null", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
      vi.mocked(fetchCatalogProductsLive).mockResolvedValue(null);

      const res = await fetchAllProductsLive();
      expect(res).toEqual(mockFallbackProducts);
    });
  });

  describe("fetchProductsByCategoryLive", () => {
    it("should return filtered fallback if catalog DB is not configured", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(false);
      const res = await fetchProductsByCategoryLive("chairs");
      expect(res).toEqual([mockFallbackProducts[0]]);
    });

    it("should query Drizzle by category_id", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
      vi.mocked(fetchCatalogProductsByCategoryLive).mockResolvedValue([
        { name: "Live A", category_id: "chairs" } as any,
      ]);

      const res = await fetchProductsByCategoryLive("chairs");
      expect(res).toEqual([{ name: "Live A", category_id: "chairs" }]);
    });
  });

  describe("fetchProductByUrlKeyLive", () => {
    it("should find item in fallback list when DB unavailable", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(false);
      const res = await fetchProductByUrlKeyLive("desk-b");
      expect(res).toEqual(mockFallbackProducts[1]);
    });

    it("should fetch single product from Drizzle", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
      vi.mocked(fetchCatalogProductBySlugLive).mockResolvedValue({
        name: "Live A",
        slug: "chair-a",
      } as any);

      const res = await fetchProductByUrlKeyLive("chair-a");
      expect(res).toEqual({ name: "Live A", slug: "chair-a" });
    });
  });

  describe("fetchCategoryIdsLive", () => {
    it("should return categories from fallback if DB unavailable", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(false);
      const res = await fetchCategoryIdsLive();
      expect(res).toEqual(["chairs", "desks"]);
    });

    it("should return categories from live db", async () => {
      vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
      vi.mocked(fetchCatalogCategoryIdsLive).mockResolvedValue(["chairs", "desks"]);

      const res = await fetchCategoryIdsLive();
      expect(res).toEqual(["chairs", "desks"]);
    });
  });
});
