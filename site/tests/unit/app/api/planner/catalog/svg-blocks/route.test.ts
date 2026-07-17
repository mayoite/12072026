import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { mapDescriptorsToCatalogItems } from "@/features/planner/project/catalog/svg/descriptorCatalogBridge.server";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";

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

vi.mock("@/features/admin/svg-editor/publish/svgArtifactStatus.server", () => ({
  readSvgArtifactStatus: vi.fn(),
}));

import { GET } from "@/app/api/planner/catalog/svg-blocks/route";

describe("app/api/planner/catalog/svg-blocks/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
    vi.mocked(readSvgArtifactStatus).mockReturnValue({ state: "published" } as never);
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

  it("does not expose internal SVG fixtures through the public catalog", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "test-block" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "test-block",
        slug: "test-block",
        sku: "DESC-test-block",
        name: "test-block",
        shortName: "test-block",
        description: "Internal fixture",
        category: "Symbols",
        subCategory: "SVG Catalog",
        taxonomyPath: "Symbols > SVG Catalog > test-block",
        dimensions: { widthMm: 100, depthMm: 100, heightMm: 100 },
        displayUnit: "mm",
        assets: { imageUrls: [] },
        material: { marketingMaterial: "SVG", normalizedMaterial: "svg" },
        roomTags: [],
        styleTags: [],
        availability: "in-stock",
        assemblyType: "fully-assembled",
        flatPack: false,
        tags: ["test"],
        variants: [],
        provenance: { source: "descriptor-loader" },
        symbolOnly: true,
      },
    ]);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    const body = await res.json();

    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
    expect(body.total).toBe(0);
  });

  it("does not publish a catalog item when its SVG artifact is missing", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "new-block" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "new-block",
        slug: "new-block",
        name: "New block",
      },
    ] as never);
    vi.mocked(readSvgArtifactStatus).mockReturnValue({ state: "missing" } as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    const body = await res.json();

    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
    expect(body.total).toBe(0);
  });
});
