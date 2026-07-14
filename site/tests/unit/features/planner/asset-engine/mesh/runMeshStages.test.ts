import { describe, expect, it } from "vitest";
import { runModularMeshStages } from "@/features/planner/asset-engine/mesh/runMeshStages";

describe("runMeshStages", () => {
  it("runs G1–G6 modular mesh stages", async () => {
    const result = await runModularMeshStages({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.stages).toEqual(
      expect.arrayContaining([
        "mesh-g1-options",
        "mesh-g2-footprint-2d",
        "mesh-g3-runtime-mesh",
        "mesh-g4-part-plan",
        "mesh-g5-binary-glb",
        "mesh-g6-validate-glb",
      ]),
    );
    expect(result.binaryByteLength).toBeGreaterThan(0);
    expect(result.footprint.length).toBeGreaterThan(0);
  }, 30_000);
});
