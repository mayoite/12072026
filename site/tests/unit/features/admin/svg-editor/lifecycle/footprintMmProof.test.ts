import { describe, expect, it } from "vitest";

import { proveDescriptorFootprintMm } from "@/features/admin/svg-editor/lifecycle/footprintMmProof";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

function syntheticDescriptor(
  geometry: { widthMm: number; depthMm: number; heightMm: number },
  viewBox: { x: number; y: number; width: number; height: number },
): BlockDescriptor {
  return {
    slug: "synthetic-footprint",
    geometry,
    viewBox,
  } as BlockDescriptor;
}

describe("footprintMmProof", () => {
  it("desk-linear-1200-001 viewBox matches geometry mm", () => {
    const loaded = tryLoad("desk-linear-1200-001");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    const proof = proveDescriptorFootprintMm(loaded.value);
    expect(proof.aligned).toBe(true);
    expect(proof.slug).toBe("desk-linear-1200-001");
    expect(proof.widthMm).toBe(1200);
    expect(proof.depthMm).toBe(600);
    expect(proof.viewBoxWidth).toBe(1200);
    expect(proof.viewBoxHeight).toBe(600);
  });

  it("side-table-001 viewBox matches geometry mm", () => {
    const loaded = tryLoad("side-table-001");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    expect(proveDescriptorFootprintMm(loaded.value).aligned).toBe(true);
  });

  it("reports misalignment when viewBox differs from geometry mm", () => {
    const proof = proveDescriptorFootprintMm(
      syntheticDescriptor(
        { widthMm: 1200, depthMm: 600, heightMm: 750 },
        { x: 0, y: 0, width: 1000, height: 500 },
      ),
    );
    expect(proof.aligned).toBe(false);
    expect(proof.widthMm).toBe(1200);
    expect(proof.depthMm).toBe(600);
    expect(proof.viewBoxWidth).toBe(1000);
    expect(proof.viewBoxHeight).toBe(500);
  });

  it("aligns when viewBox width/height equal widthMm/depthMm", () => {
    const proof = proveDescriptorFootprintMm(
      syntheticDescriptor(
        { widthMm: 800, depthMm: 400, heightMm: 100 },
        { x: 0, y: 0, width: 800, height: 400 },
      ),
    );
    expect(proof.aligned).toBe(true);
    expect(proof.slug).toBe("synthetic-footprint");
  });
});
