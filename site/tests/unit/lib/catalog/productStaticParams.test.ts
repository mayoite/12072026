import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildProductStaticParams, deriveSourceSlug } from "@/lib/catalog/productStaticParams";
import { fetchCatalogProductsLive } from "@/lib/catalog/catalogDrizzle";
import { buildLocalCatalogFallbackProducts } from "@/lib/catalog/fallback";

vi.mock("@/lib/catalog/catalogDrizzle", () => ({
  fetchCatalogProductsLive: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/lib/catalog/fallback", () => ({
  buildLocalCatalogFallbackProducts: vi.fn(() => []),
}));

vi.mock("@/lib/catalog/site/categories", () => ({
  normalizeRequestedCategoryId: vi.fn((c) => c),
  classifyToRequestedCategory: vi.fn(() => "seating"),
}));

describe("productStaticParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("derives source slug correctly", () => {
    expect(deriveSourceSlug({ slug: "oando-seating--sway" })).toBe("sway");
    expect(deriveSourceSlug({ slug: "simple-slug" })).toBe("simple-slug");
    expect(deriveSourceSlug({ metadata: { sourceSlug: "meta-slug" } })).toBe("meta-slug");
  });

  it("builds static params successfully", async () => {
    const mockProduct = {
      id: "prod-1",
      slug: "oando-seating--sway",
      category_id: "seating",
      name: "Sway Chair",
      images: ["img1.jpg"],
      flagship_image: "img1.jpg",
      series_name: "Sway",
      metadata: { sourceSlug: "sway" },
    };

    vi.mocked(buildLocalCatalogFallbackProducts).mockReturnValueOnce([mockProduct] as any);
    vi.mocked(fetchCatalogProductsLive).mockResolvedValueOnce([]);

    const params = await buildProductStaticParams();
    expect(params.length).toBe(1);
    expect(params[0]).toEqual({ category: "seating", product: "oando-seating--sway" });
  });
});
