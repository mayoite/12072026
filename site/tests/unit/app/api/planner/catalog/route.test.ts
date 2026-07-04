import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { managedProductRowToCatalogItem } from "@/features/planner/catalog/managedProductCatalogBridge";
import { normalizePlannerManagedProductRow } from "@/features/planner/catalog/plannerManagedProductsShared";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/app/api/admin/_lib/server", () => ({
  isMissingTableError: vi.fn((msg: string) => msg.includes("does not exist")),
}));

vi.mock("@/features/planner/catalog/managedProductCatalogBridge", () => ({
  managedProductRowToCatalogItem: vi.fn((row) => ({ id: row.id, name: row.name })),
}));

vi.mock("@/features/planner/catalog/plannerManagedProductsShared", () => ({
  normalizePlannerManagedProductRow: vi.fn((row) => row),
}));

vi.mock("@/lib/api/routeObservability", () => ({
  applyPlannerRouteTelemetry: vi.fn((res) => res),
}));

import { GET } from "@/app/api/planner/catalog/route";

describe("app/api/planner/catalog/route.ts", () => {
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: [{ id: "prod-1", name: "Desk", active: true }],
        error: null,
      }),
    };
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as never);
  });

  it("returns empty payload when public client is unavailable", async () => {
    vi.mocked(createServerClient).mockRejectedValue(new Error("no client"));
    const res = await GET(new NextRequest("http://localhost/api/planner/catalog"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
  });

  it("returns active planner catalog items", async () => {
    const res = await GET(new NextRequest("http://localhost/api/planner/catalog"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([{ id: "prod-1", name: "Desk" }]);
    expect(body.total).toBe(1);
    expect(mockSupabase.from).toHaveBeenCalledWith("planner_managed_products");
    expect(managedProductRowToCatalogItem).toHaveBeenCalled();
    expect(normalizePlannerManagedProductRow).toHaveBeenCalled();
  });
});
