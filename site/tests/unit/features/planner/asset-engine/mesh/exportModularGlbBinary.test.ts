import { describe, expect, it } from "vitest";
import { exportModularCabinetV0GlbBinary } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { defaultCabinetV0Options } from "@/features/planner/catalog/modularCabinetV0";

describe("exportModularGlbBinary", () => {
  it("exports binary GLB under catalog-assets/generated/", async () => {
    const options = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    const result = await exportModularCabinetV0GlbBinary(options);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.byteLength).toBeGreaterThan(32);
    expect(result.relativePath).toMatch(/^catalog-assets\/generated\//);
    expect(result.validation.valid).toBe(true);
    expect(result.stages).toEqual(
      expect.arrayContaining([
        "mesh-g1-options",
        "mesh-g5-binary-glb",
        "mesh-g6-validate-glb",
      ]),
    );
  }, 30_000);
});
