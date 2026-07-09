/**
 * Modular cabinet-v0 GLB export skeleton (generate-first, policy-safe).
 *
 * Returns a plan + generated-path metadata only. Binary GLB write is deferred
 * (GLTFExporter / gltf-transform) so this stays pure and free of designer static GLB.
 *
 * Allowed product URLs remain: empty | blob: | catalog-assets/generated/* only.
 */

import {
  GENERATED_GLB_PATH_MARKER,
  assertNoDesignerStaticGlb,
} from "@/features/planner/lib/glbAssetPolicy";
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  type ModularCabinetV0Options,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "./modularCabinetV0";

const MM = 0.001;

/**
 * plan-only: this pure helper never writes bytes.
 * binary: use asset-engine/mesh/exportModularGlbBinary (GLTFExporter + validate).
 */
export type ModularCabinetV0GlbBinaryStatus = "plan-only";

/** One box part in metres (Y-up), matching generateCabinetV0Mesh layout. */
export interface ModularCabinetV0PartPlan {
  name: string;
  sizeM: { x: number; y: number; z: number };
  positionM: { x: number; y: number; z: number };
}

/**
 * Pure mesh metadata plan (G4). Binary bytes are G5 in asset-engine (exportModularGlbBinary).
 * Does not touch designer static paths.
 */
export interface ModularCabinetV0GlbPlan {
  kind: "modular-cabinet-v0";
  options: ModularCabinetV0Options;
  partCount: number;
  footprint: string;
  parts: ModularCabinetV0PartPlan[];
  /** Policy-safe path under catalog-assets/generated/ (no leading slash). */
  relativePath: string;
  binaryExportStatus: ModularCabinetV0GlbBinaryStatus;
  /**
   * Pure plan never writes GLB. Call exportModularCabinetV0GlbBinary for ArrayBuffer.
   */
  binaryExportNote: string;
}

export interface ModularCabinetV0GeneratedAssetPathResult {
  relativePath: string;
  partCount: number;
  footprint: string;
}

const BINARY_EXPORT_NOTE =
  "This plan is metadata only (G4). Binary export: " +
  "features/planner/asset-engine/mesh/exportModularGlbBinary.ts (G5). " +
  "Upload still must land under catalog-assets/generated/ only.";

/** Stable, filesystem-safe slug for generated modular cabinet GLB names. */
export function modularCabinetV0GeneratedSlug(
  options: ModularCabinetV0Options,
): string {
  return [
    "modular-cabinet-v0",
    `${options.widthMm}x${options.depthMm}x${options.heightMm}`,
    options.doorStyle,
    options.material,
  ].join("-");
}

/**
 * Policy-safe relative path for modular export (catalog-assets/generated/… only).
 */
export function modularCabinetV0GeneratedRelativePath(
  options: ModularCabinetV0Options,
): string {
  return `${GENERATED_GLB_PATH_MARKER}${modularCabinetV0GeneratedSlug(options)}.glb`;
}

/** Pure part list mirroring generateCabinetV0Mesh (no THREE dependency here). */
export function buildModularCabinetV0PartPlans(
  options: ModularCabinetV0Options,
): ModularCabinetV0PartPlan[] {
  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;
  const toeH = TOE_HEIGHT_MM * MM;
  const inset = TOE_INSET_MM * MM;
  const carcassH = h - toeH;
  const doorT = DOOR_THICKNESS_MM * MM;
  const carcassY = toeH + carcassH / 2;

  const parts: ModularCabinetV0PartPlan[] = [
    {
      name: "toe",
      sizeM: { x: w, y: toeH, z: d - inset },
      positionM: { x: 0, y: toeH / 2, z: -inset / 2 },
    },
    {
      name: "carcass",
      sizeM: { x: w, y: carcassH, z: d },
      positionM: { x: 0, y: carcassY, z: 0 },
    },
  ];

  if (options.doorStyle === "slab") {
    parts.push({
      name: "door-slab",
      sizeM: { x: w * 0.96, y: carcassH * 0.92, z: doorT },
      positionM: { x: 0, y: carcassY, z: d / 2 + doorT / 2 },
    });
  } else if (options.doorStyle === "pair") {
    const leafW = w * 0.47;
    const leafH = carcassH * 0.92;
    const z = d / 2 + doorT / 2;
    parts.push(
      {
        name: "door-left",
        sizeM: { x: leafW, y: leafH, z: doorT },
        positionM: { x: -leafW / 2 - 0.005, y: carcassY, z },
      },
      {
        name: "door-right",
        sizeM: { x: leafW, y: leafH, z: doorT },
        positionM: { x: leafW / 2 + 0.005, y: carcassY, z },
      },
    );
  }

  return parts;
}

/**
 * Build a pure GLB export plan for modular cabinet-v0.
 * Prefer this (or generateCabinetV0Mesh for live preview) over any designer GLB.
 */
export function buildModularCabinetV0GlbPlan(
  optionsInput?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0GlbPlan {
  const options = defaultCabinetV0Options(optionsInput);
  const parts = buildModularCabinetV0PartPlans(options);
  const relativePath = modularCabinetV0GeneratedRelativePath(options);

  // Fail closed if path ever drifts off generated marker.
  assertNoDesignerStaticGlb(relativePath, "modular cabinet GLB plan path");

  return {
    kind: "modular-cabinet-v0",
    options,
    partCount: parts.length,
    footprint: generateCabinetV0Footprint(options),
    parts,
    relativePath,
    binaryExportStatus: "plan-only",
    binaryExportNote: BINARY_EXPORT_NOTE,
  };
}

/**
 * Export skeleton: resolves a policy-safe generated asset path + mesh summary.
 * Does not write a binary .glb file.
 */
export function exportModularCabinetV0ToGeneratedAssetPath(
  optionsInput?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0GeneratedAssetPathResult {
  const plan = buildModularCabinetV0GlbPlan(optionsInput);
  return {
    relativePath: plan.relativePath,
    partCount: plan.partCount,
    footprint: plan.footprint,
  };
}

/** Re-export count for callers that only need part tallies. */
export { countCabinetV0Parts };
