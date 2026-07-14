import { describe, expect, it } from "vitest";

import { proveDescriptorFootprintMm } from "@/features/admin/svg-editor/footprintMmProof";
import { tryLoad } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

describe("footprintMmProof", () => {
  it("desk-linear-1200-001 viewBox matches geometry mm", () => {
    const loaded = tryLoad("desk-linear-1200-001");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    const proof = proveDescriptorFootprintMm(loaded.value);
    expect(proof.aligned).toBe(true);
    expect(proof.widthMm).toBe(1200);
    expect(proof.depthMm).toBe(600);
  });

  it("side-table-001 viewBox matches geometry mm", () => {
    const loaded = tryLoad("side-table-001");
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error("expected loaded.ok");
    expect(proveDescriptorFootprintMm(loaded.value).aligned).toBe(true);
  });
});