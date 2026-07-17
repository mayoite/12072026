/**
 * Unit tests for publishSvgEditorAction (admin SVG editor server action).
 *
 * Covers:
 *   - slug "new" → default descriptor → pipeline
 *   - missing slug → { success:false, error:"not found" }, no pipeline
 *   - valid side-table-001 → tryLoad → pipeline (mocked)
 *   - stale-draft gate fail-closed before pipeline
 *   - Supabase catalog mirror failure does not roll back disk success
 *
 * Pipeline is mocked so this seat does not re-test compile/persist.
 * Canonical inventory is read-only via tryLoad; no descriptor/svg-catalog writes.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";

const {
  publishDescriptorWithPipeline,
  revalidatePath,
  publishSymbolToSupabaseCatalog,
  appendDescriptorAudit,
  setCatalogLifecycle,
} = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
  revalidatePath: vi.fn(),
  publishSymbolToSupabaseCatalog: vi.fn(),
  appendDescriptorAudit: vi.fn(),
  setCatalogLifecycle: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("@/features/admin/svg-editor/publish/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline,
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock("@/platform/drizzle/productsDb", () => {
  const proxy = new Proxy({}, { get: () => vi.fn() });
  return { productsDb: proxy, default: proxy };
});

vi.mock("@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite", () => ({
  resolveSvgPublishDualWriteDeps: vi.fn(async () => ({
    dbRepository: undefined,
    artifactStore: undefined,
    mode: "skipped_no_db",
  })),
}));

vi.mock("@/features/shared/catalog/catalogAssetStorage.server", () => ({
  publishSymbolToSupabaseCatalog,
}));

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(async () => "<svg xmlns='http://www.w3.org/2000/svg'/>"),
  },
  readFile: vi.fn(async () => "<svg xmlns='http://www.w3.org/2000/svg'/>"),
}));

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  setCatalogLifecycle,
}));

vi.mock("@/features/admin/svg-editor/storage/descriptorAuditLog", () => ({
  appendDescriptorAudit,
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  resolveAuthContext: vi.fn().mockResolvedValue({
    user: {
      id: "00000000-0000-4000-8000-0000000000d1",
      email: "dev-bypass@localhost",
      role: "admin",
    },
    isAdmin: true,
    requiredRole: "admin",
  }),
}));

import { publishSvgEditorAction } from "@/features/admin/svg-editor/publish/publishSvgEditorAction";

function newFormState(slug: string): SvgEditorFormState {
  const descriptor = makeNewBlockDescriptorStub();
  return {
    ...descriptorToFormState(descriptor),
    slug,
  };
}

function existingFormState(slug: string): SvgEditorFormState {
  const result = tryLoad(slug);
  if (!result.ok) {
    throw new Error(`Fixture descriptor missing: ${slug}`);
  }
  return {
    ...descriptorToFormState(result.value),
    openedBaselineGeneratedAt: result.value.generatedAt,
  };
}

describe("publishSvgEditorAction", () => {
  beforeEach(() => {
    publishDescriptorWithPipeline.mockReset();
    revalidatePath.mockReset();
    publishSymbolToSupabaseCatalog.mockReset();
    appendDescriptorAudit.mockReset();
    setCatalogLifecycle.mockReset();
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: {
        slug: "mock-published",
      },
    });
    publishSymbolToSupabaseCatalog.mockResolvedValue({
      svg: { ok: true, path: "planner-symbols/x/symbol.svg", publicUrl: "https://x/svg" },
      descriptor: {
        ok: true,
        path: "planner-symbols/x/descriptor.json",
        publicUrl: "https://x/json",
      },
    });
  });

  it('slug "new" builds a default descriptor and calls publishDescriptorWithPipeline', async () => {
    const data = newFormState("new-block");
    const result = await publishSvgEditorAction("new", data);

    expect(result).toEqual({
      success: true,
      descriptor: { slug: "mock-published" },
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);

    const input = publishDescriptorWithPipeline.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(input).toBeDefined();
    expect(input.slug).toBe("new-block");
    expect(input.schemaVersion).toBe("2026-07-04.v2");
    expect(input.variant).toBe("fixed");
    expect(input.sourceProvenance).toBe("native");
    // freeze/persist recomputes checksum — action strips it via puck merge
    expect(input.checksum).toBeUndefined();
    // action passes deps with optional dbRepository for dual-write
    const deps = publishDescriptorWithPipeline.mock.calls[0]?.[1] as Record<string, unknown> | undefined;
    expect(deps).toBeDefined();
    if (deps) {
      expect(deps).toHaveProperty("dbRepository");
    }
    expect(revalidatePath).toHaveBeenCalledWith("/admin/svg-editor");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/admin/svg-editor/mock-published",
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      "/api/planner/catalog/svg-blocks",
    );
  });

  it("missing slug returns not found and does not call the pipeline", async () => {
    const missingSlug = "missing-block-xyz-999";
    const result = await publishSvgEditorAction(
      missingSlug,
      newFormState(missingSlug),
    );

    expect(result).toEqual({ success: false, error: "not found" });
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("valid side-table-001 loads the descriptor and publishes via pipeline", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: { slug: "side-table-001" },
    });

    const result = await publishSvgEditorAction(
      "side-table-001",
      existingFormState("side-table-001"),
    );

    expect(result).toEqual({
      success: true,
      descriptor: { slug: "side-table-001" },
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);

    const input = publishDescriptorWithPipeline.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(input).toBeDefined();
    expect(input.slug).toBe("side-table-001");
    expect(input.id).toBe("f81e3a1b-16f4-4000-8000-000000000003");
    expect(input.sku).toBe("OFL-TBL-001");
    expect(input.variant).toBe("fixed");
    expect(input.checksum).toBeUndefined();
  });

  it("propagates pipeline failure for a valid existing slug", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: false,
      error: "compiler_failed: empty blocks",
    });

    const result = await publishSvgEditorAction(
      "side-table-001",
      existingFormState("side-table-001"),
    );

    expect(result).toEqual({
      success: false,
      error: "compiler_failed: empty blocks",
    });
    expect(publishDescriptorWithPipeline).toHaveBeenCalledTimes(1);
    expect(publishSymbolToSupabaseCatalog).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("blocks stale drafts before pipeline (DB-SVG-09 disk path)", async () => {
    const form = existingFormState("side-table-001");
    const baseline = form.openedBaselineGeneratedAt;
    expect(typeof baseline).toBe("number");
    if (typeof baseline !== "number") throw new Error("expected baseline stamp");

    const result = await publishSvgEditorAction("side-table-001", {
      ...form,
      openedBaselineGeneratedAt: baseline - 1,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/baseline changed|reload/i);
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
    expect(publishSymbolToSupabaseCatalog).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("keeps disk publish success when Supabase catalog mirror fails", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: { slug: "side-table-001", checksum: "c".repeat(64) },
    });
    publishSymbolToSupabaseCatalog.mockResolvedValue({
      svg: { ok: false, reason: "bucket unavailable" },
      descriptor: { ok: false, reason: "bucket unavailable" },
    });

    const result = await publishSvgEditorAction(
      "side-table-001",
      existingFormState("side-table-001"),
    );

    expect(result).toEqual({
      success: true,
      descriptor: { slug: "side-table-001", checksum: "c".repeat(64) },
    });
    expect(setCatalogLifecycle).toHaveBeenCalledWith("side-table-001", "draft");
    expect(publishSymbolToSupabaseCatalog).toHaveBeenCalledTimes(1);
    expect(appendDescriptorAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "side-table-001",
        action: "publish",
        detail: expect.objectContaining({
          supabaseSvgOk: false,
          supabaseDescriptorOk: false,
          supabaseMirrorReason: "bucket unavailable",
        }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/svg-editor");
    expect(revalidatePath).toHaveBeenCalledWith(
      "/admin/svg-editor/side-table-001",
    );
  });

  it("keeps disk publish success when Supabase mirror throws", async () => {
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: { slug: "side-table-001", checksum: "d".repeat(64) },
    });
    publishSymbolToSupabaseCatalog.mockRejectedValue(new Error("network down"));

    const result = await publishSvgEditorAction(
      "side-table-001",
      existingFormState("side-table-001"),
    );

    expect(result.success).toBe(true);
    expect(appendDescriptorAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          supabaseSvgOk: false,
          supabaseDescriptorOk: false,
          supabaseMirrorReason: "network down",
        }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalled();
  });
});
