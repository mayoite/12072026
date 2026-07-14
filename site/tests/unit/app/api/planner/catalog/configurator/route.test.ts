import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@/platform/supabase/server";
import { productToCatalogItem } from "@/features/planner/catalog-api/configuratorProductCatalogBridge";
import { rowToProduct } from "@/lib/catalog/configuratorCatalog";
import { isMissingTableError } from "@/platform/supabase/adminServer";

vi.mock("@/platform/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/platform/supabase/adminServer", () => ({
  isMissingTableError: vi.fn((msg: string) => msg.includes("does not exist")),
}));

vi.mock("@/features/planner/catalog-api/configuratorProductCatalogBridge", () => ({
  productToCatalogItem: vi.fn((product) => ({
    id: product.slug,
    name: product.name,
  })),
}));

vi.mock("@/lib/catalog/configuratorCatalog", () => ({
  rowToProduct: vi.fn((row) => row),
}));

vi.mock("@/features/shared/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res) => res),
}));

import { GET } from "@/app/api/planner/catalog/configurator/route";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

describe("app/api/planner/catalog/configurator/route.ts", () => {
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: [{ slug: "desk-1", name: "Desk", active: true }],
        error: null,
      }),
    };
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as never);
  });

  it("returns empty payload when public client is unavailable", async () => {
    vi.mocked(createServerClient).mockRejectedValue(new Error("no client"));
    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/configurator"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
  });

  it("returns rate-limit response when public limit is exceeded", async () => {
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(
      Response.json({ error: "Too many requests" }, { status: 429 }) as never,
    );
    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/configurator"),
    );
    expect(res.status).toBe(429);
  });

  it("returns active configurator catalog items", async () => {
    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/configurator"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([{ id: "desk-1", name: "Desk" }]);
    expect(body.total).toBe(1);
    expect(body.source).toBe("configurator_products");
    expect(mockSupabase.from).toHaveBeenCalledWith("configurator_products");
    expect(rowToProduct).toHaveBeenCalled();
    expect(productToCatalogItem).toHaveBeenCalled();
  });

  it("returns empty items when configurator table is missing", async () => {
    mockSupabase.limit.mockResolvedValue({
      data: null,
      error: { message: "relation does not exist" },
    });
    vi.mocked(isMissingTableError).mockReturnValue(true);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/configurator"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([]);
    expect(body.source).toBe("configurator_products");
  });
});
