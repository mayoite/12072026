import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  publishDescriptorWithPipeline,
  resolveSvgPublishDualWriteDeps,
  setCatalogLifecycle,
  resolveAuthContext,
  tryLoad,
} = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
  resolveSvgPublishDualWriteDeps: vi.fn(),
  setCatalogLifecycle: vi.fn(),
  resolveAuthContext: vi.fn(),
  tryLoad: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/publish/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline,
}));

vi.mock("@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite", () => ({
  resolveSvgPublishDualWriteDeps,
}));

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  setCatalogLifecycle,
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  resolveAuthContext,
}));

vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { publishLinearDeskAction } from "@/features/admin/svg-editor/parametric/publishLinearDeskAction";
import { defaultLinearDeskSlug } from "@/features/admin/svg-editor/parametric/linearDeskGuestIdentity";

describe("publishLinearDeskAction (order factory)", () => {
  beforeEach(() => {
    publishDescriptorWithPipeline.mockReset();
    resolveSvgPublishDualWriteDeps.mockReset();
    setCatalogLifecycle.mockReset();
    resolveAuthContext.mockReset();
    tryLoad.mockReset();
    resolveAuthContext.mockResolvedValue({
      user: { id: "admin-test" },
    });
    resolveSvgPublishDualWriteDeps.mockResolvedValue({ mode: "skipped_no_db" });
    // First publish: no prior product for slug
    tryLoad.mockReturnValue({
      ok: false,
      error: {
        kind: "notFound",
        code: "404.not_found",
        fieldPath: "slug",
        message: "missing",
      },
    });
  });

  it("publishes Maker SVG with guest-visible slug, SKU, widthMm 1600, live lifecycle", async () => {
    publishDescriptorWithPipeline.mockImplementation(
      async (desc: { slug: string; sku?: string }) => ({
        success: true as const,
        descriptor: desc,
      }),
    );

    const result = await publishLinearDeskAction({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      slug: "linear-desk",
      sku: "", // empty → treated as omit; publish fills commercial SKU
      name: "Client desk",
    });

    expect(result).toEqual(expect.objectContaining({ success: true }));
    if (!result.success) {
      throw new Error(`publish failed: ${result.error}`);
    }

    expect(result.descriptor.slug.startsWith("oando-")).toBe(true);
    expect(result.descriptor.sku).toMatch(/OANDO-LINEAR-DSK-1600/);
    expect(setCatalogLifecycle).toHaveBeenCalledWith(
      result.descriptor.slug,
      "live",
    );

    const pipelineArgs = publishDescriptorWithPipeline.mock.calls[0];
    const descArg = pipelineArgs?.[0] as {
      slug: string;
      sku?: string;
      geometry: { widthMm: number };
    };
    expect(descArg.geometry.widthMm).toBe(1600);
    expect(descArg.slug).toMatch(/^oando-/);
    expect(descArg.sku).toMatch(/OANDO-LINEAR-DSK-1600/);

    const compileSvg = pipelineArgs?.[1]?.compileSvg as (
      d: unknown,
    ) => Promise<{ ok: boolean; svg: string }>;
    expect(typeof compileSvg).toBe("function");
    const compiled = await compileSvg(result.descriptor);
    expect(compiled.ok).toBe(true);
    expect(compiled.svg).toContain('id="desk-top"');
    expect(compiled.svg).toContain('id="pedestal-l"');
    expect(compiled.svg).not.toContain('id="frame"');
    expect(compiled.svg).not.toMatch(/currentColor/i);
  });

  it("reuses existing product id when republishing the same guest slug", async () => {
    const existingId = "11111111-2222-4333-8444-555555555555";
    const generatedAt = 1_720_000_000;
    const guestSlug = defaultLinearDeskSlug(1600);
    tryLoad.mockReturnValue({
      ok: true,
      value: {
        id: existingId,
        slug: guestSlug,
        generatedAt,
      },
    });
    publishDescriptorWithPipeline.mockImplementation(
      async (desc: { id: string; slug: string; generatedAt?: number }) => ({
        success: true as const,
        descriptor: desc,
      }),
    );

    const first = await publishLinearDeskAction({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      slug: guestSlug,
      sku: "OANDO-LINEAR-DSK-1600",
    });
    const second = await publishLinearDeskAction({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 780,
      slug: guestSlug,
      sku: "OANDO-LINEAR-DSK-1600",
    });

    expect(first.success && second.success).toBe(true);
    if (!first.success || !second.success) return;

    expect(tryLoad).toHaveBeenCalledWith(guestSlug);
    expect(first.descriptor.id).toBe(existingId);
    expect(second.descriptor.id).toBe(existingId);
    expect(first.descriptor.generatedAt).toBe(generatedAt);
    expect(second.descriptor.generatedAt).toBe(generatedAt);

    const ids = publishDescriptorWithPipeline.mock.calls.map(
      (call: unknown[]) => (call[0] as { id: string }).id,
    );
    expect(ids).toEqual([existingId, existingId]);
  });

  it("returns error when admin auth fails", async () => {
    resolveAuthContext.mockRejectedValue(new Error("nope"));
    const result = await publishLinearDeskAction({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/Admin access/i);
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
  });
});
