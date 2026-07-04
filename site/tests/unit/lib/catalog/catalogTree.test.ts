import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as catalogDrizzleType2 from "@/lib/catalog/catalogDrizzle";
import type * as catalogTreeType0 from "@/lib/catalog/catalogTree";
import { resolveCatalogFallbackProducts } from "@/lib/catalog/catalogFallbackResolver";

vi.mock("@/lib/catalog/catalogDrizzle", () => ({
  canQueryCatalogDatabase: vi.fn(() => true),
  fetchCatalogCategoriesLive: vi.fn(),
  fetchCatalogProductsLive: vi.fn(),
}));

vi.mock("@/lib/catalog/catalogFallbackResolver", () => ({
  resolveCatalogFallbackProducts: vi.fn(),
}));

vi.mock("@/lib/catalog/adapters", () => ({
  normalizeProducts: vi.fn((p) => p),
  toCompatProduct: vi.fn((p) => p),
}));

describe("catalogTree buildCatalogLive", () => {
  let buildCatalogLive: typeof catalogTreeType0.buildCatalogLive;
  let canQueryCatalogDatabase: typeof catalogDrizzleType2.canQueryCatalogDatabase;
  let fetchCatalogCategoriesLive: typeof catalogDrizzleType2.fetchCatalogCategoriesLive;
  let fetchCatalogProductsLive: typeof catalogDrizzleType2.fetchCatalogProductsLive;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    ({ buildCatalogLive } = await import("@/lib/catalog/catalogTree"));
    ({ canQueryCatalogDatabase, fetchCatalogCategoriesLive, fetchCatalogProductsLive } = await import(
      "@/lib/catalog/catalogDrizzle"
    ));
    vi.mocked(canQueryCatalogDatabase).mockReturnValue(true);
    vi.mocked(fetchCatalogCategoriesLive).mockResolvedValue(null);
    vi.mocked(fetchCatalogProductsLive).mockResolvedValue(null);
    vi.mocked(resolveCatalogFallbackProducts).mockResolvedValue([]);
  });

  it("returns empty if both db and fallback are empty", async () => {
    const res = await buildCatalogLive();
    expect(res).toEqual([]);
  });

  it("builds compat catalog from fallback if db query fails/returns empty", async () => {
    const mockProduct = {
      id: "prod-123",
      category_id: "desks",
      series_id: "series-123",
      series_name: "Desk Series",
      name: "Smart Desk",
    };
    vi.mocked(resolveCatalogFallbackProducts).mockResolvedValueOnce([mockProduct] as any);

    const res = await buildCatalogLive();
    expect(res.length).toBe(1);
    expect(res[0].id).toBe("desks");
    expect(res[0].series[0].products[0].id).toBe("prod-123");
  });
});
