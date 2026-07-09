/**
 * G5 binary export + write under site/public/catalog-assets/generated/.
 *
 * Does not place furniture or stamp a document. For place+write+stamp use
 * placeModularWithGeneratedGlbPlan.
 */

import { exportModularCabinetV0GlbBinary } from "./exportModularGlbBinary";
import {
  writeGeneratedGlbToPublic,
  type WriteGeneratedGlbToPublicOptions,
  type WriteGeneratedGlbToPublicResult,
} from "./writeGeneratedGlbToPublic";
import type { ModularCabinetV0Options } from "@/features/planner/open3d/catalog/modularCabinetV0";
import type { ModularCabinetV0GlbPlan } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";

export type ExportModularAndWriteOk = {
  readonly ok: true;
  readonly relativePath: string;
  readonly buffer: ArrayBuffer;
  readonly byteLength: number;
  readonly plan: ModularCabinetV0GlbPlan;
  readonly absolutePath: string;
  readonly publicUrlPath: string;
  readonly validation: {
    valid: boolean;
    errors: string[];
    nodeCount: number;
    triangleCount: number;
  };
  readonly stages: readonly string[];
  readonly write: WriteGeneratedGlbToPublicResult;
};

export type ExportModularAndWriteErr = {
  readonly ok: false;
  readonly error: string;
  readonly failedAt: string;
  readonly stages: readonly string[];
};

export type ExportModularAndWriteResult =
  | ExportModularAndWriteOk
  | ExportModularAndWriteErr;

/**
 * Export modular cabinet-v0 GLB bytes, validate, write under publicRoot.
 * On write failure returns ok:false with failedAt write-public.
 */
export async function exportModularAndWrite(
  partialOptions?: Partial<ModularCabinetV0Options>,
  writeOptions?: WriteGeneratedGlbToPublicOptions,
): Promise<ExportModularAndWriteResult> {
  const binary = await exportModularCabinetV0GlbBinary(partialOptions);
  if (!binary.ok) {
    return {
      ok: false,
      error: binary.error,
      failedAt: binary.failedAt,
      stages: binary.stages,
    };
  }

  const stages = [...binary.stages, "write-public"];
  try {
    const write = writeGeneratedGlbToPublic(
      binary.buffer,
      binary.relativePath,
      writeOptions,
    );
    return {
      ok: true,
      stages,
      relativePath: binary.relativePath,
      buffer: binary.buffer,
      byteLength: binary.byteLength,
      plan: binary.plan,
      validation: binary.validation,
      absolutePath: write.absolutePath,
      publicUrlPath: write.publicUrlPath,
      write,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      stages,
      failedAt: "write-public",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
