/**
 * G5 — Binary GLB from modular cabinet-v0 mesh (system-generated only).
 *
 * Uses runtime mesh (generateCabinetV0Mesh) + GLTFExporter.
 * Path is always under catalog-assets/generated/. Validates with validateGlbAsset.
 */

import * as THREE from "three";
import { GLTFExporter } from "three-stdlib";

import { assertNoDesignerStaticGlb } from "@/features/planner/lib/glbAssetPolicy";
import {
  defaultCabinetV0Options,
  generateCabinetV0Mesh,
  type ModularCabinetV0Options,
} from "@/features/planner/open3d/catalog/modularCabinetV0";
import {
  buildModularCabinetV0GlbPlan,
  modularCabinetV0GeneratedRelativePath,
  type ModularCabinetV0GlbPlan,
} from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";

export type ModularGlbBinaryExportResult = {
  readonly ok: true;
  readonly relativePath: string;
  readonly buffer: ArrayBuffer;
  readonly byteLength: number;
  readonly plan: ModularCabinetV0GlbPlan;
  readonly validation: {
    valid: boolean;
    errors: string[];
    nodeCount: number;
    triangleCount: number;
  };
  readonly stages: readonly string[];
};

export type ModularGlbBinaryExportError = {
  readonly ok: false;
  readonly error: string;
  readonly failedAt: string;
  readonly stages: readonly string[];
};

export type ModularGlbBinaryResult =
  | ModularGlbBinaryExportResult
  | ModularGlbBinaryExportError;

function exportGroupToGlbArrayBuffer(group: THREE.Object3D): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const scene = new THREE.Scene();
    scene.add(group);

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(result);
          return;
        }
        // JSON glTF fallback — encode as UTF-8 (should not happen with binary:true)
        const json = JSON.stringify(result);
        const encoded = new TextEncoder().encode(json);
        resolve(encoded.buffer.slice(
          encoded.byteOffset,
          encoded.byteOffset + encoded.byteLength,
        ));
      },
      (err) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      },
      { binary: true },
    );
  });
}

/**
 * Ordered mesh export: options → plan → runtime mesh → binary GLB → validate.
 * Does not write disk or upload; caller owns storage upload.
 * To attach the policy path on furniture for G8, call
 * `stampFurnitureGeneratedGlb(item, result.relativePath)` after a successful export.
 */
export async function exportModularCabinetV0GlbBinary(
  partialOptions?: Partial<ModularCabinetV0Options>,
): Promise<ModularGlbBinaryResult> {
  const stages: string[] = [];

  try {
    stages.push("mesh-g1-options");
    const options = defaultCabinetV0Options(partialOptions);

    stages.push("mesh-g4-part-plan");
    const plan = buildModularCabinetV0GlbPlan(options);
    const relativePath = modularCabinetV0GeneratedRelativePath(options);
    assertNoDesignerStaticGlb(relativePath);

    stages.push("mesh-g3-runtime-mesh");
    const meshGroup = generateCabinetV0Mesh(options);

    stages.push("mesh-g5-binary-glb");
    const buffer = await exportGroupToGlbArrayBuffer(meshGroup);

    stages.push("mesh-g6-validate-glb");
    // validateGlbAsset → @gltf-transform NodeIO/node:fs — server-only dynamic import.
    // Browser place path skips heavy validate (bytes still written via API when used).
    const validation =
      typeof window === "undefined"
        ? await (
            await import("@/features/planner/lib/assetPipeline")
          ).validateGlbAsset(buffer)
        : {
            valid: true,
            errors: [] as string[],
            nodeCount: 0,
            triangleCount: 0,
          };
    if (!validation.valid) {
      return {
        ok: false,
        stages,
        failedAt: "mesh-g6-validate-glb",
        error: validation.errors.join("; ") || "GLB validation failed",
      };
    }

    return {
      ok: true,
      stages,
      relativePath,
      buffer,
      byteLength: buffer.byteLength,
      plan,
      validation,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      stages,
      failedAt: stages[stages.length - 1] ?? "mesh-g1-options",
      error: message,
    };
  }
}
