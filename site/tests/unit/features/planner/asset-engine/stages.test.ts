import { describe, expect, it } from "vitest";
import {
  SVG_STAGES,
  MESH_GLB_STAGES,
  listSvgStages,
  listMeshGlbStages,
  stageById,
} from "@/features/planner/asset-engine/stages";

describe("asset-engine stages registry", () => {
  it("lists ordered SVG stages", () => {
    const stages = listSvgStages();
    expect(stages).toBe(SVG_STAGES);
    expect(stages.length).toBeGreaterThan(5);
    const orders = stages.map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("lists ordered mesh/GLB stages", () => {
    const stages = listMeshGlbStages();
    expect(stages).toBe(MESH_GLB_STAGES);
    expect(stages.some((s) => s.id === "mesh-g5-binary-glb")).toBe(true);
  });

  it("looks up stages by id from either registry", () => {
    expect(stageById("svg-s2-compile")?.status).toBe("implemented");
    expect(stageById("mesh-g0-policy")?.status).toBe("policy-only");
    expect(stageById("does-not-exist")).toBeUndefined();
  });
});
