/**
 * Unit tests for publishSvgEditorAction (admin SVG editor server action).
 *
 * Covers:
 *   - slug "new" → default descriptor → pipeline
 *   - missing slug → { success:false, error:"not found" }, no pipeline
 *   - valid side-table-001 → tryLoad → pipeline (mocked)
 *
 * Pipeline is mocked so this seat does not re-test compile/persist.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";
import { descriptorToFormState } from "@/features/planner/admin/svg-editor/svgEditorFormAdapters";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import type { SvgEditorFormState } from "@/features/planner/admin/svg-editor/svgEditorFormState";

const { publishDescriptorWithPipeline } = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
}));

vi.mock("@/features/planner/admin/svg-editor/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline,
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock("@/platform/drizzle/productsDb", () => {
  const proxy = new Proxy({}, { get: () => vi.fn() });
  return { productsDb: proxy, default: proxy };
});

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

import { publishSvgEditorAction } from "@/features/planner/admin/svg-editor/publishSvgEditorAction";

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
  return descriptorToFormState(result.value);
}

describe("publishSvgEditorAction", () => {
  beforeEach(() => {
    publishDescriptorWithPipeline.mockReset();
    publishDescriptorWithPipeline.mockResolvedValue({
      success: true,
      descriptor: {
        slug: "mock-published",
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
  });

  it("missing slug returns not found and does not call the pipeline", async () => {
    const missingSlug = "missing-block-xyz-999";
    const result = await publishSvgEditorAction(
      missingSlug,
      newFormState(missingSlug),
    );

    expect(result).toEqual({ success: false, error: "not found" });
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
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
  });
});
