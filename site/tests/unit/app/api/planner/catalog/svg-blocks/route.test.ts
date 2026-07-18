import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock(
  "@/features/planner/catalog/svg/descriptorCatalogBridge.server",
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
    delete process.env.SVG_RELEASE_AUTHORITY;
    vi.mocked(enforcePublicApiRateLimit).mockResolvedValue(null);
    vi.mocked(readSvgArtifactStatus).mockReturnValue({ state: "published" } as never);
  });

  afterEach(() => {
    delete process.env.SVG_RELEASE_AUTHORITY;
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

  it("returns mapped brand-hero svg-block catalog items", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "oando-fluid-desk-1600" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "oando-fluid-desk-1600",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
        name: "Fluid Desk 1600",
        tags: [],
        provenance: { source: "descriptor-loader" },
      },
    ] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe("oando-fluid-desk-1600");
    expect(body.source).toBe("svg-blocks");
    expect(body.total).toBe(1);
  });

  it("drops non-brand demo/OFL pollution from guest inventory (P10/BQ4)", async () => {
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "sample-sofa-1" },
      { slug: "oando-fluid-desk-1600" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "sample-sofa-1",
        slug: "sample-sofa-1",
        sku: "SOFA-001",
        name: "Modern 3-Seater Sofa",
        tags: ["sofa"],
        roomTags: ["Living Room"],
        provenance: { source: "sample_data" },
      },
      {
        id: "oando-fluid-desk-1600",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
        name: "Fluid Desk 1600",
        tags: ["desk"],
        provenance: { source: "descriptor-loader" },
      },
    ] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    const body = await res.json();
    expect(body.items.map((i: { id: string }) => i.id)).toEqual([
      "oando-fluid-desk-1600",
    ]);
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

  it("SVG_RELEASE_AUTHORITY=db: disk artifact status is not enough (no silent disk override)", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      { slug: "disk-only-block" },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "disk-only-block",
        slug: "disk-only-block",
        name: "Disk Only",
        assets: { previewImageUrl: "/svg-catalog/disk-only-block.svg" },
      },
    ] as never);
    vi.mocked(readSvgArtifactStatus).mockReturnValue({ state: "published" } as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    const body = await res.json();

    expect(body.items).toEqual([]);
    expect(body.source).toBe("none");
    expect(body.total).toBe(0);
    // Disk status must not be consulted as release authority under db mode.
    expect(readSvgArtifactStatus).not.toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db: immutable revision API URLs remain buyer-visible", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    vi.mocked(loadBuyerVisibleDescriptorsWithDb).mockResolvedValue([
      {
        slug: "oando-fluid-desk-1600",
        publishedSvgRevisionId: "oando-fluid-desk-1600-r-abc123def4567890",
      },
    ] as never);
    vi.mocked(mapDescriptorsToCatalogItems).mockReturnValue([
      {
        id: "oando-fluid-desk-1600",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
        name: "Fluid Desk 1600",
        tags: [],
        provenance: { source: "descriptor-loader" },
        assets: {
          previewImageUrl:
            "/api/planner/catalog/svg/oando-fluid-desk-1600-r-abc123def4567890",
        },
      },
    ] as never);

    const res = await GET(
      new NextRequest("http://localhost/api/planner/catalog/svg-blocks"),
    );
    const body = await res.json();

    expect(body.success).toBe(true);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].slug).toBe("oando-fluid-desk-1600");
    expect(body.source).toBe("svg-blocks");
    expect(readSvgArtifactStatus).not.toHaveBeenCalled();
  });
});
