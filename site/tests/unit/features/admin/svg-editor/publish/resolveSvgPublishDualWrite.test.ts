// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const isProductsDatabaseConfigured = vi.fn();
const isR2CatalogReady = vi.fn();

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: () => isProductsDatabaseConfigured(),
}));

vi.mock("@/lib/storage/r2Catalog", () => ({
  isR2CatalogReady: (opts?: { force?: boolean }) => isR2CatalogReady(opts),
  writeR2ObjectText: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/storage/drizzleSvgPersistence.server", () => ({
  DrizzleSvgRevisionPersistence: class DrizzleSvgRevisionPersistence {},
}));

vi.mock("@/features/admin/svg-editor/svgRevisionRepository.server", () => ({
  ImmutableSvgRevisionRepository: class ImmutableSvgRevisionRepository {
    constructor(public readonly persistence: unknown) {}
  },
}));

describe("resolveSvgPublishDualWriteDeps", () => {
  beforeEach(() => {
    vi.resetModules();
    isProductsDatabaseConfigured.mockReset();
    isR2CatalogReady.mockReset();
  });

  it("skips dual-write when Products DB is not configured", async () => {
    isProductsDatabaseConfigured.mockReturnValue(false);
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).toBe("skipped_no_db");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
    expect(isR2CatalogReady).not.toHaveBeenCalled();
  });

  it("skips dual-write when R2 is unreachable so disk publish can succeed", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    isR2CatalogReady.mockResolvedValue(false);
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).toBe("skipped_r2_unavailable");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
  });

  it("enables dual-write when Products DB and R2 are ready", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    isR2CatalogReady.mockResolvedValue(true);
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).toBe("enabled");
    expect(deps.dbRepository).toBeDefined();
    expect(deps.artifactStore).toBeDefined();
    expect(deps.artifactStore?.putText).toBeTypeOf("function");
  });
});
