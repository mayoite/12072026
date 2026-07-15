import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const loadBuyerVisibleDescriptors = vi.fn(() => [
  { slug: "disk-only" },
]);
const isProductsDatabaseConfigured = vi.fn(() => false);
const execute = vi.fn();

vi.mock("@/features/admin/svg-editor/catalogLifecycle", () => ({
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
      "@/features/admin/svg-editor/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([{ slug: "disk-only" }]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });

  it("awaits and returns configured Products DB descriptors", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([
      { slug: "db-only", descriptor: { slug: "db-only" } },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await import(
      "@/features/admin/svg-editor/catalogLifecycle.db.server"
    );
    const rows = await loadBuyerVisibleDescriptorsWithDb();

    expect(rows).toEqual([{ slug: "db-only" }]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });
});
