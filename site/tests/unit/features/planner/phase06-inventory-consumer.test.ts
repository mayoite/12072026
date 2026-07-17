/**
 * Phase 06 — Planner inventory consumer gate tests
 *
 * Check IDs: 06-INV-01, 06-INV-05, 06-TEST-01
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

import { PlannerCatalogClient } from "@/features/planner/catalog/catalogClient";
import { loadPlannerCatalog } from "@/features/planner/catalog/catalogQuery";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { loadBuyerVisibleDescriptors } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { filterBuyerFacingCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { GET as getSvgBlocks } from "@/app/api/planner/catalog/svg-blocks/route";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn(async () => null),
}));

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server", () => ({
  loadBuyerVisibleDescriptorsWithDb: async () => loadBuyerVisibleDescriptors(),
}));

function descriptorCatalogItem(
  overrides: Partial<PlannerCatalogItem> & Pick<PlannerCatalogItem, "id" | "slug">,
): PlannerCatalogItem {
  return {
    sku: `DESC-${overrides.slug}`,
    name: overrides.slug,
    shortName: overrides.slug.slice(0, 30),
    description: `Symbol descriptor ${overrides.slug}`,
    category: "Symbols",
    subCategory: "SVG Catalog",
    taxonomyPath: `Symbols > SVG Catalog > ${overrides.slug}`,
    dimensions: { widthMm: 100, depthMm: 100, heightMm: 100 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: { marketingMaterial: "SVG", normalizedMaterial: "svg-symbol" },
    roomTags: [],
    styleTags: [],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [overrides.slug, "descriptor"],
    variants: [],
    provenance: { source: "descriptor-loader" },
    symbolOnly: true,
    ...overrides,
  };
}

describe("Phase 06 — 06-INV-01 loader path", () => {
  beforeEach(() => {
    clearLoaderCache();
  });

  it("loadDescriptorsFromLoader hydrates catalog items via svg-blocks API during SSR", async () => {
    const response = await getSvgBlocks(
      new NextRequest("http://localhost:3000/api/planner/catalog/svg-blocks"),
    );
    const body = (await response.json()) as {
      items?: PlannerCatalogItem[];
      data?: { items?: PlannerCatalogItem[] };
    };
    const origWindow = globalThis.window;
    // @ts-expect-error test-only removal of browser global
    delete globalThis.window;

    try {
      const client = new PlannerCatalogClient({
        fetchImpl: vi.fn().mockResolvedValue({
          ok: true,
          json: async () => body,
        }) as unknown as typeof fetch,
      });
      const descriptors = await client.loadDescriptorsFromLoader();
      const apiItems = body.data?.items ?? body.items ?? [];

      expect(descriptors).toEqual([]);
      if (apiItems.length > 0) {
        const items = client.getAll();
        expect(items.some((item) => item.provenance?.source === "descriptor-loader")).toBe(
          true,
        );
      }
    } finally {
      globalThis.window = origWindow;
    }
  });

  it("loadPlannerCatalog prefers descriptor-loader items from svg-blocks API", async () => {
    const descriptorItem = descriptorCatalogItem({
      id: "desc-present-1",
      slug: "desc-present-1",
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [descriptorItem] }),
    });
    const client = new PlannerCatalogClient({
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await loadPlannerCatalog(client);

    expect(result.source).toBe("remote");
    expect(result.items.some((item) => item.id === "desc-present-1")).toBe(true);
    expect(
      result.items.some((item) => item.provenance?.source === "descriptor-loader"),
    ).toBe(true);
  });
});

describe("Phase 06 — 06-INV-05 search facets + cursor pagination (default 50)", () => {
  function seedManyItems(count: number): PlannerCatalogClient {
    const client = new PlannerCatalogClient();
    const items: PlannerCatalogItem[] = Array.from({ length: count }, (_, index) =>
      descriptorCatalogItem({
        id: `item-${index}`,
        slug: `item-${index}`,
        name: `Catalog Item ${index}`,
      }),
    );
    client.load(items, "standard");
    return client;
  }

  it("honours pageSize 50+ without a hard 24 ceiling", () => {
    const client = seedManyItems(80);
    const page = client.search({ pageSize: 50 });
    expect(page.items.length).toBe(50);
    expect(page.hasMore).toBe(true);
    expect(page.nextCursor).not.toBeNull();
  });

  it("supports cursor pagination with facet filters", () => {
    const client = new PlannerCatalogClient();
    client.load(
      [
        descriptorCatalogItem({
          id: "staff-1",
          slug: "staff-1",
          staffPicked: true,
          license: "standard",
        }),
        descriptorCatalogItem({
          id: "staff-2",
          slug: "staff-2",
          staffPicked: true,
          license: "standard",
        }),
        descriptorCatalogItem({
          id: "other",
          slug: "other",
          staffPicked: false,
          license: "cc-by",
        }),
      ],
      "standard",
    );

    const page1 = client.search({ staffPicked: true, pageSize: 1 });
    expect(page1.items).toHaveLength(1);
    const page2 = client.search({
      staffPicked: true,
      pageSize: 1,
      cursor: page1.nextCursor ?? undefined,
    });
    expect(page2.items).toHaveLength(1);
    expect(page2.items[0].id).not.toBe(page1.items[0].id);
  });
});

describe("Phase 06 — 06-TEST-01 corrupt / absent / present fallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("present: svg-blocks response hydrates the catalog client", async () => {
    const present = descriptorCatalogItem({ id: "present-1", slug: "present-1" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [present] }),
      }),
    );

    const client = new PlannerCatalogClient();
    await client.loadDescriptorsFromLoader();

    expect(client.getById("present-1")?.slug).toBe("present-1");
  });

  it("absent: empty svg-blocks and API fall back to demo catalog", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) }),
    );

    const client = new PlannerCatalogClient();
    const result = await loadPlannerCatalog(client);

    expect(result.source).toBe("fallback");
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("corrupt: malformed svg-blocks entries are filtered without throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [null, { id: 42 }, descriptorCatalogItem({ id: "good-1", slug: "good-1" })],
        }),
      }),
    );

    const client = new PlannerCatalogClient();
    await expect(client.loadDescriptorsFromLoader()).resolves.toEqual([]);
    expect(client.getById("good-1")?.slug).toBe("good-1");
  });
});

describe("Phase 06 — portal → planner sync evidence", () => {
  beforeEach(() => {
    clearLoaderCache();
  });

  it("svg-blocks API slugs match on-disk loader slugs", async () => {
    const response = await getSvgBlocks(
      new NextRequest("http://localhost:3000/api/planner/catalog/svg-blocks"),
    );
    const body = (await response.json()) as {
      data?: { items?: Array<{ slug: string }> };
      items?: Array<{ slug: string }>;
    };
    const apiSlugs = (body.data?.items ?? body.items ?? [])
      .map((item) => item.slug)
      .sort();
    const loaderSlugs = filterBuyerFacingCatalogItems(
      mapDescriptorsToCatalogItems(loadBuyerVisibleDescriptors()),
    )
      .map((item) => item.slug)
      .sort();

    expect(apiSlugs).toEqual(loaderSlugs);
  });
});
