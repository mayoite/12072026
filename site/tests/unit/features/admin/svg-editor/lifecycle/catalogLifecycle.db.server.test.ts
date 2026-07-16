import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const loadBuyerVisibleDescriptors = vi.fn(() => [
  { slug: "disk-only" },
]);
const isProductsDatabaseConfigured = vi.fn(() => false);
const execute = vi.fn();

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  loadBuyerVisibleDescriptors,
  readLifecycleManifest: () => ({}),
  isBuyerVisibleSlug: () => true,
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured,
}));

vi.mock("@/platform/drizzle/productsDb", () => ({
  productsDb: {
    select: () => ({
      from: () => ({ execute }),
    }),
  },
}));

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  blockDescriptors: {},
}));

describe("loadBuyerVisibleDescriptorsWithDb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isProductsDatabaseConfigured.mockReturnValue(false);
    loadBuyerVisibleDescriptors.mockReturnValue([{ slug: "disk-only" }]);
    execute.mockReset();
  });

  it("falls back to disk when products DB is not configured", async () => {
    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([{ slug: "disk-only" }]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });

  it("awaits and returns configured Products DB descriptors", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    const dbDescriptor = {
      id: "db-only-id",
      slug: "db-only",
      geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    };
    execute.mockResolvedValue([
      { slug: "db-only", descriptor: dbDescriptor },
    ]);

    // Fresh module so mocks from this case bind after first import cache if needed.
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
      loadBuyerVisibleDescriptors,
      readLifecycleManifest: () => ({}),
      isBuyerVisibleSlug: () => true,
    }));
    vi.doMock("@/platform/drizzle/databaseUrls", () => ({
      isProductsDatabaseConfigured,
    }));
    vi.doMock("@/platform/drizzle/productsDb", () => ({
      productsDb: {
        select: () => ({
          from: () => ({ execute }),
        }),
      },
    }));
    vi.doMock("@/platform/drizzle/schema/catalog", () => ({
      blockDescriptors: {},
    }));

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();

    expect(rows).toEqual([dbDescriptor]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });

  it("strictly adapts legacy SVG definitions written before the descriptor cutover", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([
      {
        slug: "legacy-desk",
        descriptor: {
          schemaVersion: 1,
          typeId: "legacy-desk",
          name: "Legacy Desk",
          sku: "LEGACY-1",
          category: "workstations",
          tags: ["legacy"],
          lifecycle: { status: "published", ownerId: "admin-1" },
          viewBox: { x: 0, y: 0, width: 1200, height: 600 },
          physicalDimensionsMm: { width: 1200, depth: 600, height: 750 },
          parts: [],
          parameters: [],
          actions: [],
          constraints: [],
          variants: [],
          mounting: [
            { plane: "floor", anchor: { x: 0, y: 0 }, rotationDegrees: 0 },
          ],
          accessibility: { title: "Legacy Desk" },
        },
      },
    ]);
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
      loadBuyerVisibleDescriptors,
      readLifecycleManifest: () => ({}),
      isBuyerVisibleSlug: () => true,
    }));
    vi.doMock("@/platform/drizzle/databaseUrls", () => ({
      isProductsDatabaseConfigured,
    }));
    vi.doMock("@/platform/drizzle/productsDb", () => ({
      productsDb: { select: () => ({ from: () => ({ execute }) }) },
    }));
    vi.doMock("@/platform/drizzle/schema/catalog", () => ({
      blockDescriptors: {},
    }));

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    await expect(loadBuyerVisibleDescriptorsWithDb()).resolves.toEqual([
      {
        id: "legacy-desk",
        slug: "legacy-desk",
        sku: "LEGACY-1",
        name: "Legacy Desk",
        tags: ["legacy"],
        geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
      },
    ]);
  });

  it("rejects a legacy definition whose identity differs from the DB row", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([
      {
        slug: "trusted-row",
        descriptor: {
          schemaVersion: 1,
          typeId: "different-row",
          name: "Mismatch",
          category: "symbols",
          tags: [],
          lifecycle: { status: "published", ownerId: "admin-1" },
          viewBox: { x: 0, y: 0, width: 10, height: 10 },
          physicalDimensionsMm: { width: 10, depth: 10, height: 10 },
          parts: [],
          parameters: [],
          actions: [],
          constraints: [],
          variants: [],
          mounting: [],
          accessibility: { title: "Mismatch" },
        },
      },
    ]);
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
      loadBuyerVisibleDescriptors,
      readLifecycleManifest: () => ({}),
      isBuyerVisibleSlug: () => true,
    }));
    vi.doMock("@/platform/drizzle/databaseUrls", () => ({
      isProductsDatabaseConfigured,
    }));
    vi.doMock("@/platform/drizzle/productsDb", () => ({
      productsDb: { select: () => ({ from: () => ({ execute }) }) },
    }));
    vi.doMock("@/platform/drizzle/schema/catalog", () => ({
      blockDescriptors: {},
    }));

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    await expect(loadBuyerVisibleDescriptorsWithDb()).resolves.toEqual([]);
  });

  it("returns empty when DB rows lack usable geometry in DB-authority mode", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([
      { slug: "stub", descriptor: { slug: "stub" } },
    ]);
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
      loadBuyerVisibleDescriptors,
      readLifecycleManifest: () => ({}),
      isBuyerVisibleSlug: () => true,
    }));
    vi.doMock("@/platform/drizzle/databaseUrls", () => ({
      isProductsDatabaseConfigured,
    }));
    vi.doMock("@/platform/drizzle/productsDb", () => ({
      productsDb: {
        select: () => ({
          from: () => ({ execute }),
        }),
      },
    }));
    vi.doMock("@/platform/drizzle/schema/catalog", () => ({
      blockDescriptors: {},
    }));

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });

  it("returns empty when DB read throws in DB-authority mode", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockRejectedValue(new Error("db unavailable"));
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
      loadBuyerVisibleDescriptors,
      readLifecycleManifest: () => ({}),
      isBuyerVisibleSlug: () => true,
    }));
    vi.doMock("@/platform/drizzle/databaseUrls", () => ({
      isProductsDatabaseConfigured,
    }));
    vi.doMock("@/platform/drizzle/productsDb", () => ({
      productsDb: {
        select: () => ({
          from: () => ({ execute }),
        }),
      },
    }));
    vi.doMock("@/platform/drizzle/schema/catalog", () => ({
      blockDescriptors: {},
    }));

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });
});
