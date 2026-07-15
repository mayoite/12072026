import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { mapDescriptorsToCatalogItems } from "@/features/planner/project/catalog/svg/descriptorCatalogBridge.server";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock(
  "@/features/planner/project/catalog/svg/descriptorCatalogBridge.server",
  () => ({
    mapDescriptorsToCatalogItems: vi.fn(),
  }),
);

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server", () => ({
  loadBuyerVisibleDescriptorsWithDb: vi.fn(),
}));

import { GET } from "@/app/api/planner/catalog/svg-blocks/route";

describe("app/api/planner/catalog/svg-blocks/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
  });

  it("returns rate-limit response when public limit is exceeded", async () => {
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(
      Response.json({ error: "Too many requests" }, { status: 429 }) as never,
    );
    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    expect(res.status).toBe(429);
  });

  it("returns empty source when no descriptors map", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([]);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([]);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
    expect(body.total).toBe(0);
  });

  it("returns mapped svg-block catalog items", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "desk-a" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      { id: "desk-a", name: "Desk A" },
    ] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toEqual([{ id: "desk-a", name: "Desk A" }]);
    expect(body.source).toBe("svg-blocks");
    expect(body.total).toBe(1);
  });
});
