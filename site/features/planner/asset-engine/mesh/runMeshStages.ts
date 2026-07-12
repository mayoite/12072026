/**
 * Ordered mesh/GLB stage runner for modular cabinet-v0 (P0 skeleton).
 * Documents the full chain; executes what is implemented without claiming viewer GLB load.
 */

import {
  resolveFurniture2DFootprint,
} from "@/features/planner/project/catalog/parametricBuilder";
import {
  defaultCabinetV0Options,
  generateCabinetV0Mesh,
  type ModularCabinetV0Options,
} from "@/features/planner/project/catalog/modularCabinetV0";
import { buildModularCabinetV0GlbPlan } from "@/features/planner/project/catalog/modularCabinetV0GlbExport";
import { exportModularCabinetV0GlbBinary } from "./exportModularGlbBinary";

export interface MeshStagesOk {
  readonly ok: true;
  readonly stages: readonly string[];
  readonly options: ModularCabinetV0Options;
  readonly footprint: string;
  readonly partCount: number;
  readonly relativePath: string;
  readonly binaryByteLength: number;
  readonly validationNodeCount: number;
  /** Runtime mesh child count (not serializable). */
  readonly runtimeMeshChildren: number;
}

export interface MeshStagesErr {
  readonly ok: false;
  readonly stages: readonly string[];
  readonly failedAt: string;
  readonly error: string;
}

export type MeshStagesResult = MeshStagesOk | MeshStagesErr;

/**
 * G1→G6 for modular-cabinet-v0. Does not place furniture or load GLB in viewer (G8 planned).
 */
export async function runModularMeshStages(
  partial?: Partial<ModularCabinetV0Options>,
): Promise<MeshStagesResult> {
  const stages: string[] = [];

  try {
    stages.push("mesh-g1-options");
    const options = defaultCabinetV0Options(partial);

    stages.push("mesh-g2-footprint-2d");
    const footprint = resolveFurniture2DFootprint({
      geometryMode: "modular-cabinet-v0",
      modularOptions: options,
      width: options.widthMm,
      depth: options.depthMm,
    });

    stages.push("mesh-g3-runtime-mesh");
    const group = generateCabinetV0Mesh(options);
    const runtimeMeshChildren = group.children.length;

    stages.push("mesh-g4-part-plan");
    const plan = buildModularCabinetV0GlbPlan(options);

    const binary = await exportModularCabinetV0GlbBinary(options);
    if (!binary.ok) {
      return {
        ok: false,
        stages: [...stages, ...binary.stages],
        failedAt: binary.failedAt,
        error: binary.error,
      };
    }
    stages.push(...binary.stages.filter((s) => !stages.includes(s)));

    return {
      ok: true,
      stages,
      options,
      footprint,
      partCount: plan.partCount,
      relativePath: binary.relativePath,
      binaryByteLength: binary.byteLength,
      validationNodeCount: binary.validation.nodeCount,
      runtimeMeshChildren,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      stages,
      failedAt: stages[stages.length - 1] ?? "mesh-g1-options",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
