import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  publishDescriptorWithPipeline,
  resolveSvgPublishDualWriteDeps,
  setCatalogLifecycle,
  resolveAuthContext,
} = vi.hoisted(() => ({
  publishDescriptorWithPipeline: vi.fn(),
  resolveSvgPublishDualWriteDeps: vi.fn(),
  setCatalogLifecycle: vi.fn(),
  resolveAuthContext: vi.fn(),
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

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { publishLinearDeskAction } from "@/features/admin/svg-editor/parametric/publishLinearDeskAction";

describe("publishLinearDeskAction (order factory)", () => {
  beforeEach(() => {
    publishDescriptorWithPipeline.mockReset();
    resolveSvgPublishDualWriteDeps.mockReset();
    setCatalogLifecycle.mockReset();
    resolveAuthContext.mockReset();
    resolveAuthContext.mockResolvedValue({
      user: { id: "admin-test" },
    });
    resolveSvgPublishDualWriteDeps.mockResolvedValue({ mode: "skipped_no_db" });
  });

  it("publishes Maker SVG with guest-visible slug, SKU, and live lifecycle", async () => {
    publishDescriptorWithPipeline.mockImplementation(async (desc: { slug: string; sku?: string }) => ({
      success: true as const,
      descriptor: desc,
    }));

    const result = await publishLinearDeskAction({
      type: "linear-desk",
      widthMm: 1600,
      depthMm: 800,
      slug: "linear-desk",
      sku: "", // empty → treated as omit; publish fills commercial SKU
      name: "Client desk",
    });

    expect(result).toEqual(
      expect.objectContaining({ success: true }),
    );
    if (!result.success) {
      throw new Error(`publish failed: ${result.error}`);
    }

    expect(result.descriptor.slug.startsWith("oando-")).toBe(true);
    expect(result.descriptor.sku).toMatch(/OANDO-LINEAR-DSK-1600/);
    expect(setCatalogLifecycle).toHaveBeenCalledWith(
      result.descriptor.slug,
      "live",
    );

    const compileSvg = publishDescriptorWithPipeline.mock.calls[0]?.[1]
      ?.compileSvg as (d: unknown) => Promise<{ ok: boolean; svg: string }>;
    expect(typeof compileSvg).toBe("function");
    const compiled = await compileSvg(result.descriptor);
    expect(compiled.ok).toBe(true);
    expect(compiled.svg).toContain('id="desk-top"');
    expect(compiled.svg).toContain('id="pedestal-l"');
    expect(compiled.svg).not.toContain('id="frame"');
    expect(compiled.svg).not.toMatch(/currentColor/i);
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
