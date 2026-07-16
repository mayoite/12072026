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

  it("falls back to disk when DB rows lack usable geometry", async () => {
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
    expect(rows).toEqual([{ slug: "disk-only" }]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });
});
