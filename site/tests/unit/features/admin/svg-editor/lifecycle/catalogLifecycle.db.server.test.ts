import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const loadBuyerVisibleDescriptors = vi.fn(() => [{ slug: "disk-only" }]);
const isProductsDatabaseConfigured = vi.fn(() => false);
const execute = vi.fn();

function mockDbChain() {
  return {
    productsDb: {
      select: () => ({
        from: () => ({
          leftJoin: () => ({ execute }),
          execute,
        }),
      }),
    },
  };
}

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  loadBuyerVisibleDescriptors,
  readLifecycleManifest: () => ({}),
  isBuyerVisibleSlug: () => true,
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured,
}));

vi.mock("@/platform/drizzle/productsDb", () => mockDbChain());

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  blockDescriptors: { slug: "slug", descriptor: "descriptor" },
  plannerManagedProducts: {
    plannerSourceSlug: "planner_source_slug",
    publishedSvgRevisionId: "published_svg_revision_id",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ a, b })),
}));

async function loadModule() {
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
  vi.doMock("@/platform/drizzle/productsDb", () => mockDbChain());
  vi.doMock("@/platform/drizzle/schema/catalog", () => ({
    blockDescriptors: { slug: "slug", descriptor: "descriptor" },
    plannerManagedProducts: {
      plannerSourceSlug: "planner_source_slug",
      publishedSvgRevisionId: "published_svg_revision_id",
    },
  }));
  vi.doMock("drizzle-orm", () => ({
    eq: vi.fn((a, b) => ({ a, b })),
  }));
  return import(
    "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server"
  );
}

const legacyDeskDefinition = {
  schemaVersion: 1 as const,
  typeId: "legacy-desk",
  name: "Legacy Desk",
  sku: "LEGACY-1",
  category: "workstations",
  tags: ["legacy"],
  lifecycle: { status: "published" as const, ownerId: "admin-1" },
  viewBox: { x: 0, y: 0, width: 1200, height: 600 },
  physicalDimensionsMm: { width: 1200, depth: 600, height: 750 },
  parts: [],
  parameters: [],
  actions: [],
  constraints: [],
  variants: [],
  mounting: [
    { plane: "floor" as const, anchor: { x: 0, y: 0 }, rotationDegrees: 0 },
  ],
  accessibility: { title: "Legacy Desk" },
};

describe("loadBuyerVisibleDescriptorsWithDb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SVG_RELEASE_AUTHORITY;
    isProductsDatabaseConfigured.mockReturnValue(false);
    loadBuyerVisibleDescriptors.mockReturnValue([{ slug: "disk-only" }]);
    execute.mockReset();
  });

  it("falls back to disk when products DB is not configured", async () => {
    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([{ slug: "disk-only" }]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db: no disk when Products DB is not configured", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(false);
    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db: empty DB table does not fall back to disk", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([]);
    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db: corrupt DB rows stay empty (no disk override)", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(true);
    execute.mockResolvedValue([
      {
        slug: "broken",
        descriptor: { not: "valid" },
        publishedSvgRevisionId: null,
      },
    ]);
    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([]);
    expect(loadBuyerVisibleDescriptors).not.toHaveBeenCalled();
  });

  it("disk authority merges DB revision pointer with disk inventory (partial dual-write)", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    loadBuyerVisibleDescriptors.mockReturnValue([
      {
        id: "disk-desk",
        slug: "desk-linear-1200-001",
        geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
      },
      { slug: "disk-only" },
    ]);
    const dbDescriptor = {
      id: "db-desk-id",
      slug: "desk-linear-1200-001",
      geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    };
    execute.mockResolvedValue([
      {
        slug: "desk-linear-1200-001",
        descriptor: dbDescriptor,
        publishedSvgRevisionId: "desk-linear-1200-001-r-abc123def4567890ab",
      },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();

    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
    const desk = rows.find(
      (r) => "slug" in r && r.slug === "desk-linear-1200-001",
    ) as { publishedSvgRevisionId?: string; slug: string };
    expect(desk?.publishedSvgRevisionId).toBe(
      "desk-linear-1200-001-r-abc123def4567890ab",
    );
    expect(rows.some((r) => "slug" in r && r.slug === "disk-only")).toBe(true);
  });

  it("awaits and returns configured Products DB descriptors with revision pointer", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    loadBuyerVisibleDescriptors.mockReturnValue([]);
    const dbDescriptor = {
      id: "db-only-id",
      slug: "db-only",
      geometry: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    };
    execute.mockResolvedValue([
      {
        slug: "db-only",
        descriptor: dbDescriptor,
        publishedSvgRevisionId: "db-only-r-abc123def4567890ab",
      },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();

    expect(rows).toEqual([
      {
        ...dbDescriptor,
        publishedSvgRevisionId: "db-only-r-abc123def4567890ab",
      },
    ]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });

  it("strictly adapts legacy SVG definitions written before the descriptor cutover", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    loadBuyerVisibleDescriptors.mockReturnValue([]);
    execute.mockResolvedValue([
      {
        slug: "legacy-desk",
        descriptor: legacyDeskDefinition,
        publishedSvgRevisionId: null,
      },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
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

  it("rejects a legacy definition whose identity differs from the DB row (disk authority keeps disk)", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    loadBuyerVisibleDescriptors.mockReturnValue([{ slug: "disk-kept" }]);
    execute.mockResolvedValue([
      {
        slug: "trusted-row",
        descriptor: {
          ...legacyDeskDefinition,
          typeId: "different-row",
          name: "Mismatch",
          accessibility: { title: "Mismatch" },
        },
        publishedSvgRevisionId: null,
      },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    await expect(loadBuyerVisibleDescriptorsWithDb()).resolves.toEqual([
      { slug: "disk-kept" },
    ]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });

  it("disk authority: corrupt DB rows still keep disk inventory (merge)", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    loadBuyerVisibleDescriptors.mockReturnValue([{ slug: "disk-only" }]);
    execute.mockResolvedValue([
      {
        slug: "broken",
        descriptor: { not: "valid" },
        publishedSvgRevisionId: null,
      },
    ]);

    const { loadBuyerVisibleDescriptorsWithDb } = await loadModule();
    const rows = await loadBuyerVisibleDescriptorsWithDb();
    expect(rows).toEqual([{ slug: "disk-only" }]);
    expect(loadBuyerVisibleDescriptors).toHaveBeenCalled();
  });
});
