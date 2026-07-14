/**
 * Unit tests for previewSvgEditorAction (live preview, no disk I/O).
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/newBlockDescriptorStub";
import { descriptorToFormState } from "@/features/admin/svg-editor/svgEditorFormAdapters";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/svgEditorFormState";

const { resolveAuthContext, compileSvgForPublish } = vi.hoisted(() => ({
  resolveAuthContext: vi.fn(),
  compileSvgForPublish: vi.fn(),
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  resolveAuthContext,
}));

vi.mock("@/features/planner/asset-engine/svg/compileSvgForPublish", () => ({
  compileSvgForPublish,
}));

import { previewSvgEditorAction } from "@/features/admin/svg-editor/previewSvgEditorAction";

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

describe("previewSvgEditorAction", () => {
  beforeEach(() => {
    resolveAuthContext.mockReset();
    compileSvgForPublish.mockReset();
    resolveAuthContext.mockResolvedValue({
      user: {
        id: "00000000-0000-4000-8000-0000000000d1",
        email: "dev-bypass@localhost",
        role: "admin",
      },
      isAdmin: true,
      requiredRole: "admin",
    });
    compileSvgForPublish.mockResolvedValue({
      ok: true,
      svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    });
  });

  it("returns auth failure when resolveAuthContext throws", async () => {
    resolveAuthContext.mockRejectedValue(new Error("forbidden"));
    const result = await previewSvgEditorAction("new", newFormState("new-block"));
    expect(result).toEqual({
      ok: false,
      phase: "auth",
      error: "Admin access required",
      issues: [],
    });
    expect(compileSvgForPublish).not.toHaveBeenCalled();
  });

  it("returns notFound for a missing slug", async () => {
    const result = await previewSvgEditorAction(
      "missing-block-xyz-999",
      newFormState("missing-block-xyz-999"),
    );
    expect(result).toEqual({
      ok: false,
      phase: "notFound",
      error: "Descriptor not found: missing-block-xyz-999",
      issues: [],
    });
    expect(compileSvgForPublish).not.toHaveBeenCalled();
  });

  it('slug "new" compiles via stub base without disk write', async () => {
    const result = await previewSvgEditorAction("new", newFormState("new-block"));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.phase).toBe("ok");
    expect(result.svg).toContain("<svg");
    expect(result.issues).toEqual([]);
    expect(compileSvgForPublish).toHaveBeenCalledTimes(1);
  });

  it("compiles an existing catalog slug through the real form adapter", async () => {
    const result = await previewSvgEditorAction(
      "side-table-001",
      existingFormState("side-table-001"),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");
    expect(result.phase).toBe("ok");
    expect(compileSvgForPublish).toHaveBeenCalledTimes(1);
    const input = compileSvgForPublish.mock.calls[0]?.[0] as { slug: string };
    expect(input.slug).toBe("side-table-001");
  });

  it("returns validate phase with field issues for invalid form data", async () => {
    const form = newFormState("new-block");
    form.geometry = { widthMm: -1, depthMm: -1, heightMm: -1 };

    const result = await previewSvgEditorAction("new", form);
    expect(result.ok).toBe(false);
    expect(result.phase).toBe("validate");
    expect(result.error).toBeTruthy();
    expect(Array.isArray(result.issues)).toBe(true);
    expect(compileSvgForPublish).not.toHaveBeenCalled();
  });

  it("returns compile phase when compileSvgForPublish fails", async () => {
    compileSvgForPublish.mockResolvedValue({
      ok: false,
      error: "empty blocks",
      failedAt: "svg-s2-compile",
    });

    const result = await previewSvgEditorAction("new", newFormState("new-block"));
    expect(result).toEqual({
      ok: false,
      phase: "compile",
      error: "empty blocks",
      issues: [],
      failedAt: "svg-s2-compile",
    });
  });
});
