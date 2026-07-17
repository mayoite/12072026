// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const isProductsDatabaseConfigured = vi.fn();
const probeR2CatalogAccess = vi.fn();

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: () => isProductsDatabaseConfigured(),
}));

vi.mock("@/lib/storage/r2Catalog", () => ({
  probeR2CatalogAccess: (opts?: { force?: boolean }) => probeR2CatalogAccess(opts),
  writeR2ObjectText: vi.fn(),
  writeR2ObjectBytes: vi.fn(),
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
    probeR2CatalogAccess.mockReset();
  });

  it("mode skipped_no_db when Products DB is not configured", async () => {
    isProductsDatabaseConfigured.mockReturnValue(false);
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).toBe("skipped_no_db");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
    expect(deps.r2Probe).toBeUndefined();
    expect(probeR2CatalogAccess).not.toHaveBeenCalled();
  });

  it("mode skipped_r2_unavailable when R2 probe fails — no dual-write injection", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    probeR2CatalogAccess.mockResolvedValue({
      ok: false,
      reason: "missing_r2_config",
      source: null,
    });
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).toBe("skipped_r2_unavailable");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
    expect(deps.r2Probe).toEqual({
      ok: false,
      reason: "missing_r2_config",
      source: null,
    });
  });

  it("mode enabled when Products DB configured, R2 ok, and schema pointer present", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    probeR2CatalogAccess.mockResolvedValue({
      ok: true,
      source: "cloudflare-r2",
    });
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps({
      schemaProbe: async () => ({ ok: true }),
    });
    expect(deps.mode).toBe("enabled");
    expect(deps.dbRepository).toBeDefined();
    expect(deps.artifactStore).toBeDefined();
    expect(deps.artifactStore?.putText).toBeTypeOf("function");
    expect(deps.artifactStore?.putBytes).toBeTypeOf("function");
    expect(deps.r2Probe).toEqual({ ok: true, source: "cloudflare-r2" });
  });

  it("mode skipped_schema_missing when pointer column absent — no dual-write injection", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    probeR2CatalogAccess.mockResolvedValue({
      ok: true,
      source: "cloudflare-r2",
    });
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps({
      schemaProbe: async () => ({
        ok: false,
        reason: "published_svg_revision_id_missing",
      }),
    });
    expect(deps.mode).toBe("skipped_schema_missing");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
    expect(deps.r2Probe).toEqual({ ok: true, source: "cloudflare-r2" });
  });

  it("forwards forceR2Probe to the R2 catalog probe", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    probeR2CatalogAccess.mockResolvedValue({
      ok: false,
      reason: "forced_probe",
      source: "cloudflare-r2",
    });
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    await resolveSvgPublishDualWriteDeps({ forceR2Probe: true });
    expect(probeR2CatalogAccess).toHaveBeenCalledWith({ force: true });
  });

  it("never invents R2 success: ok:false probe cannot yield enabled", async () => {
    isProductsDatabaseConfigured.mockReturnValue(true);
    probeR2CatalogAccess.mockResolvedValue({
      ok: false,
      reason: "Unauthorized (401)",
      source: "cloudflare-r2",
    });
    const { resolveSvgPublishDualWriteDeps } = await import(
      "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const deps = await resolveSvgPublishDualWriteDeps();
    expect(deps.mode).not.toBe("enabled");
    expect(deps.mode).toBe("skipped_r2_unavailable");
    expect(deps.dbRepository).toBeUndefined();
    expect(deps.artifactStore).toBeUndefined();
  });
});
