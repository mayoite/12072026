import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/products/filter/route";
import { getCatalog } from "@/features/catalog/getProducts";
import { buildRequestedCategoryCatalog } from "@/features/catalog/categories";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn(),
}));

vi.mock("@/features/catalog/getProducts", () => ({
  getCatalog: vi.fn(),
}));

vi.mock("@/features/catalog/categories", () => ({
  buildRequestedCategoryCatalog: vi.fn(),
}));

describe("app/api/products/filter/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
    vi.mocked(getCatalog).mockResolvedValue([] as never);
    vi.mocked(buildRequestedCategoryCatalog).mockReturnValue([
      {
        id: "seating",
        name: "Seating",
        series: [
          {
            id: "exec",
            name: "Executive",
            products: [
              {
                id: "p1",
                slug: "chair-a",
                name: "Chair A",
                description: "Ergonomic",
                images: ["/img/a.jpg"],
                metadata: { subcategory: "Executive", priceRange: "mid" },
              },
            ],
          },
        ],
      },
    ] as never);
  });

  it("returns 400 when category query param is missing", async () => {
    const res = await GET(new NextRequest("http://localhost/api/products/filter"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.total).toBe(0);
    expect(body.meta.categoryId).toBe("");
  });

  it("returns 404 when category is unknown", async () => {
    const res = await GET(
      new NextRequest("http://localhost/api/products/filter?category=unknown"),
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.meta.categoryId).toBe("unknown");
  });

  it("returns filtered products for valid category", async () => {
    const res = await GET(
      new NextRequest("http://localhost/api/products/filter?category=seating&q=chair"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(1);
    expect(body.products[0].name).toBe("Chair A");
    expect(body.meta.catalogTotal).toBe(1);
  });
});
