import { beforeEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const mocks = vi.hoisted(() => ({
  publish: vi.fn(),
  dualWrite: vi.fn(),
  lifecycle: vi.fn(),
  auth: vi.fn(),
  tryLoad: vi.fn(),
  svgPath: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/publish/publishDescriptorWithPipeline", () => ({ publishDescriptorWithPipeline: mocks.publish }));
vi.mock("@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite", () => ({ resolveSvgPublishDualWriteDeps: mocks.dualWrite }));
vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({ setCatalogLifecycle: mocks.lifecycle }));
vi.mock("@/features/shared/api/withAuth", () => ({ resolveAuthContext: mocks.auth }));
vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", () => ({ tryLoad: mocks.tryLoad }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/features/admin/svg-editor/publish/svgPipelineRunner", () => ({ resolvePublishedSvgPath: mocks.svgPath }));

import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { PARAMETRIC_PRODUCT_TYPE_IDS } from "@/features/planner/asset-engine/svg/parametric/parametricProductManifest";
import { PARAMETRIC_PUBLISH_REGISTRY } from "@/features/admin/svg-editor/parametric/parametricPublishRegistry.server";
import { publishParametricProductAction } from "@/features/admin/svg-editor/parametric/publishParametricProductAction";

describe("publishParametricProductAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "admin-test" } });
    mocks.dualWrite.mockResolvedValue({ mode: "skipped_no_db" });
    mocks.tryLoad.mockReturnValue({ ok: false, error: { kind: "notFound" } });
    mocks.svgPath.mockReturnValue(path.resolve(process.cwd(), "../.e2e-runtime/parametric-collision.svg"));
    mocks.publish.mockImplementation(async (descriptor: object) => ({ success: true, descriptor }));
  });

  it("fails unknown types without invoking publish", async () => {
    await expect(publishParametricProductAction({ type: "unknown" })).resolves.toMatchObject({ success: false, error: "Unknown parametric product type" });
    expect(mocks.publish).not.toHaveBeenCalled();
  });

  it("publishes the exact sanitized desk assembly with manifest parity", async () => {
    expect(PARAMETRIC_PUBLISH_REGISTRY.list().map((entry) => entry.type)).toEqual(PARAMETRIC_PRODUCT_TYPE_IDS);
    const raw = { ...deskAssemblyDrawer.defaults(), layout: "u", workstationCount: 12, runLengthMm: 9600, returnLengthMm: 3200, aisleMm: 1200 };
    const result = await publishParametricProductAction(raw);
    expect(result).toMatchObject({ success: true, descriptor: { slug: "oando-desk-assembly-12", sku: "OANDO-DSK-ASM-12" } });
    const deps = mocks.publish.mock.calls[0]?.[1];
    const compiled = await deps.compileSvg(result.success ? result.descriptor : {});
    expect(compiled.svg).toContain('data-product-type="desk-assembly"');
    expect(compiled.svg).toContain('id="workstation-12"');
    expect(compiled.svg).not.toMatch(/currentColor|var\s*\(/i);
    expect(mocks.lifecycle).toHaveBeenCalledWith("oando-desk-assembly-12", "live", undefined);
  });

  it("rejects a slug already used by a different exact configuration", async () => {
    mocks.tryLoad.mockReturnValue({ ok: true, value: { id: "existing-id" } });
    const collisionPath = mocks.svgPath();
    mkdirSync(path.dirname(collisionPath), { recursive: true });
    writeFileSync(collisionPath, "<svg>different configuration</svg>", "utf8");

    try {
      await expect(
        publishParametricProductAction(deskAssemblyDrawer.defaults()),
      ).resolves.toEqual({
        success: false,
        error: "Slug already belongs to a different exact configuration. Change the SKU and slug before publishing.",
      });
      expect(mocks.publish).not.toHaveBeenCalled();
    } finally {
      rmSync(collisionPath, { force: true });
    }
  });

  it("fails closed when an existing descriptor has no SVG artifact", async () => {
    mocks.tryLoad.mockReturnValue({ ok: true, value: { id: "existing-id" } });

    await expect(
      publishParametricProductAction(deskAssemblyDrawer.defaults()),
    ).resolves.toEqual({
      success: false,
      error: "Existing descriptor has no released SVG. Repair the catalog artifact before republishing.",
    });
    expect(mocks.publish).not.toHaveBeenCalled();
  });
});
