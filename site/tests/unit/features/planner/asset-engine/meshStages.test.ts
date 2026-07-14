import { describe, expect, it } from "vitest";
import {
  listMeshGlbStages,
  listSvgStages,
} from "@/features/planner/asset-engine/stages";
import { exportModularCabinetV0GlbBinary } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { runModularMeshStages } from "@/features/planner/asset-engine/mesh/runMeshStages";
import { isSystemGeneratedGlbUrl } from "@/features/planner/lib/glbAssetPolicy";

describe("asset-engine stage registry", () => {
  it("lists SVG and mesh stages in ascending order", () => {
    const svg = listSvgStages();
    const mesh = listMeshGlbStages();
    expect(svg.length).toBeGreaterThanOrEqual(6);
    expect(mesh.length).toBeGreaterThanOrEqual(6);
    for (let i = 1; i < svg.length; i++) {
      expect(svg[i].order).toBeGreaterThan(svg[i - 1].order);
    }
    for (let i = 1; i < mesh.length; i++) {
      expect(mesh[i].order).toBeGreaterThan(mesh[i - 1].order);
    }
  });

  it("marks viewer GLB load as partial (async skeleton)", () => {
    const load = listMeshGlbStages().find((s) => s.id === "mesh-g8-viewer-load-glb");
    expect(load?.status).toBe("partial");
    expect(load?.entry).toMatch(/shouldLoadGlb|loadGeneratedGlbObject/i);
  });
});

describe("exportModularCabinetV0GlbBinary (mesh G5–G6)", () => {
  it("emits GLB bytes under catalog-assets/generated/ (browser-safe; node parse is runMeshStages)", async () => {
    const result = await exportModularCabinetV0GlbBinary({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");

    expect(isSystemGeneratedGlbUrl(result.relativePath)).toBe(true);
    expect(result.byteLength).toBeGreaterThan(100);
    expect(result.validation.valid).toBe(true);
    // nodeCount stays 0 here — full parse only in runModularMeshStages / exportModularAndWrite (Node)
    expect(result.stages).toContain("mesh-g5-binary-glb");
    expect(result.stages).toContain("mesh-g6-validate-glb");
  }, 30_000);
});

describe("runModularMeshStages (G1–G6)", () => {
  it("runs footprint + mesh + binary without claiming G8", async () => {
    const result = await runModularMeshStages({ doorStyle: "pair" });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected result.ok");

    expect(result.footprint.startsWith("M ")).toBe(true);
    expect(result.runtimeMeshChildren).toBe(4);
    expect(result.partCount).toBe(4);
    expect(result.binaryByteLength).toBeGreaterThan(100);
    expect(result.validationNodeCount).toBeGreaterThan(0);
    expect(result.stages).not.toContain("mesh-g8-viewer-load-glb");
  }, 30_000);
});
