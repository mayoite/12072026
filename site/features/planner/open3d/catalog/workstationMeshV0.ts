/**
 * Systems v0 — multi-part workstation mesh (desk/return/pedestal/panel/overhead).
 * Pure plan (mm) + Three group of role-colored boxes. Not photoreal GLB.
 */

import * as THREE from "three";
import type {
  WorkstationConfigV0,
  WorkstationFootprintMm,
  WorkstationModuleKindV0,
  WorkstationPlanPrimV0,
} from "./workstationSystemV0";
import {
  createWorkstationConfigV0,
  workstationFootprintMm,
  workstationPlanPrims,
} from "./workstationSystemV0";

/** Work surface slab thickness (mm). */
export const WORKTOP_THICKNESS_MM = 30;
/** Privacy / screen panel height (mm). */
export const PANEL_HEIGHT_MM = 1100;
/** Overhead bin height (mm). */
export const OVERHEAD_HEIGHT_MM = 350;
/** Gap between worktop top and overhead bottom (mm). */
export const OVERHEAD_GAP_MM = 200;
/** Square leg post cross-section (mm) — readable modular, not photoreal. */
export const LEG_SECTION_MM = 50;
/** Inset from worktop plan edges to leg centers (mm). */
export const LEG_INSET_MM = 40;

const MM = 0.001;
/** Metal-ish leg posts (distinct from worktop / pedestal). */
const LEG_COLOR = "#57534e";

/** Serializable options stamped on furniture for save/rebuild. */
export type WorkstationV0MeshOptions = {
  shape: WorkstationConfigV0["shape"];
  lengthMm: number;
  depthMm: number;
  heightMm: number;
  modules: WorkstationModuleKindV0[];
};

export type WorkstationV0MeshPartPlan = {
  name: string;
  role: WorkstationModuleKindV0;
  /** Box size mm: x = plan width, y = vertical, z = plan depth. */
  sizeMm: { x: number; y: number; z: number };
  /** Box center mm; group origin = footprint AABB center, floor Y=0. */
  positionMm: { x: number; y: number; z: number };
  color: string;
};

export type WorkstationV0MeshPlan = {
  footprint: WorkstationFootprintMm;
  parts: WorkstationV0MeshPartPlan[];
  options: WorkstationV0MeshOptions;
};

const ROLE_COLOR: Record<WorkstationModuleKindV0, string> = {
  desk: "#c4a574",
  return: "#b8956a",
  pedestal: "#6b7280",
  panel: "#94a3b8",
  overhead: "#a8a29e",
};

export function workstationOptionsFromConfig(
  config: WorkstationConfigV0,
): WorkstationV0MeshOptions {
  return {
    shape: config.shape,
    lengthMm: config.size.lengthMm,
    depthMm: config.size.depthMm,
    heightMm: config.heightMm,
    modules: [...config.modules],
  };
}

export function workstationConfigFromOptions(
  options: WorkstationV0MeshOptions,
): WorkstationConfigV0 {
  return createWorkstationConfigV0({
    shape: options.shape,
    size: { lengthMm: options.lengthMm, depthMm: options.depthMm },
    modules: options.modules,
    heightMm: options.heightMm,
  });
}

function heightForRole(
  role: WorkstationModuleKindV0,
  heightMm: number,
): number {
  if (role === "desk" || role === "return") return WORKTOP_THICKNESS_MM;
  if (role === "panel") return PANEL_HEIGHT_MM;
  if (role === "overhead") return OVERHEAD_HEIGHT_MM;
  // pedestal: under worktop with small clearance
  return Math.max(1, heightMm - WORKTOP_THICKNESS_MM - 20);
}

function centerYForRole(
  role: WorkstationModuleKindV0,
  heightMm: number,
  sizeY: number,
): number {
  if (role === "desk" || role === "return") {
    // Top face at heightMm
    return heightMm - sizeY / 2;
  }
  if (role === "panel") {
    return sizeY / 2;
  }
  if (role === "overhead") {
    const bottom = heightMm + OVERHEAD_GAP_MM;
    return bottom + sizeY / 2;
  }
  // pedestal from floor
  return sizeY / 2;
}

/**
 * Convert a plan prim (top-left footprint AABB mm) into a centered mesh part.
 * Plan X → world X, plan Y → world Z; origin = footprint center.
 */
function partFromPlanPrim(
  prim: WorkstationPlanPrimV0,
  footprint: WorkstationFootprintMm,
  heightMm: number,
): WorkstationV0MeshPartPlan {
  const role = prim.role as WorkstationModuleKindV0;
  const sizeY = heightForRole(role, heightMm);
  const cx = prim.x + prim.w / 2 - footprint.widthMm / 2;
  const cz = prim.y + prim.h / 2 - footprint.depthMm / 2;
  return {
    name: role,
    role,
    sizeMm: { x: Math.max(1, prim.w), y: sizeY, z: Math.max(1, prim.h) },
    positionMm: {
      x: cx,
      y: centerYForRole(role, heightMm, sizeY),
      z: cz,
    },
    color: ROLE_COLOR[role],
  };
}

/**
 * Four corner posts under a desk/return plan prim.
 * Names: `leg-desk-0..3` / `leg-return-0..3`. Height fills floor → worktop bottom.
 * role stays parent module so save/rebuild still knows the run; name is the identity.
 */
function legsForWorktopPrim(
  prim: WorkstationPlanPrimV0,
  footprint: WorkstationFootprintMm,
  heightMm: number,
  runKey: "desk" | "return",
): WorkstationV0MeshPartPlan[] {
  const section = LEG_SECTION_MM;
  const legH = Math.max(1, heightMm - WORKTOP_THICKNESS_MM);
  const inset = Math.min(
    LEG_INSET_MM,
    Math.max(0, prim.w / 4 - section / 2),
    Math.max(0, prim.h / 4 - section / 2),
  );
  const half = section / 2;
  const corners: ReadonlyArray<{ readonly x: number; readonly y: number }> = [
    { x: prim.x + inset + half, y: prim.y + inset + half },
    { x: prim.x + prim.w - inset - half, y: prim.y + inset + half },
    { x: prim.x + inset + half, y: prim.y + prim.h - inset - half },
    { x: prim.x + prim.w - inset - half, y: prim.y + prim.h - inset - half },
  ];

  return corners.map((c, i) => ({
    name: `leg-${runKey}-${i}`,
    role: runKey,
    sizeMm: { x: section, y: legH, z: section },
    positionMm: {
      x: c.x - footprint.widthMm / 2,
      y: legH / 2,
      z: c.y - footprint.depthMm / 2,
    },
    color: LEG_COLOR,
  }));
}

/**
 * Pure multi-part mesh plan from workstation config (mm).
 * Plan prims drive horizontal layout; heights/colors by module role.
 * Desk/return runs get four named leg posts (floor → worktop bottom).
 * Overhead (not in plan prims) is placed above the main desk run when present.
 */
export function generateWorkstationV0MeshPlan(
  config: WorkstationConfigV0,
): WorkstationV0MeshPlan {
  const footprint = workstationFootprintMm(config);
  const { prims } = workstationPlanPrims(config);
  const parts: WorkstationV0MeshPartPlan[] = [];

  for (const prim of prims) {
    parts.push(partFromPlanPrim(prim, footprint, config.heightMm));
    if (prim.role === "desk" || prim.role === "return") {
      parts.push(
        ...legsForWorktopPrim(
          prim,
          footprint,
          config.heightMm,
          prim.role,
        ),
      );
    }
  }

  if (config.modules.includes("overhead")) {
    const L = config.size.lengthMm;
    const D = config.size.depthMm;
    const sizeY = OVERHEAD_HEIGHT_MM;
    // Slightly inset bin over main run (not full depth)
    const binW = Math.max(1, L * 0.7);
    const binD = Math.max(1, Math.min(400, D * 0.55));
    parts.push({
      name: "overhead",
      role: "overhead",
      sizeMm: { x: binW, y: sizeY, z: binD },
      positionMm: {
        x: 0,
        y: centerYForRole("overhead", config.heightMm, sizeY),
        z: -footprint.depthMm / 2 + D / 2,
      },
      color: ROLE_COLOR.overhead,
    });
  }

  return {
    footprint,
    parts,
    options: workstationOptionsFromConfig(config),
  };
}

export function countWorkstationV0Parts(config: WorkstationConfigV0): number {
  return generateWorkstationV0MeshPlan(config).parts.length;
}

/**
 * Build a Three group in metres (Y-up). One box mesh per role part.
 * Group origin = footprint center on floor.
 */
export function generateWorkstationV0Mesh(
  config: WorkstationConfigV0,
): THREE.Group {
  const plan = generateWorkstationV0MeshPlan(config);
  const group = new THREE.Group();
  group.name = "workstation-v0";
  group.userData = {
    modular: "workstation-v0",
    options: { ...plan.options },
  };

  for (const part of plan.parts) {
    const mat = new THREE.MeshStandardMaterial({
      color: part.color,
      roughness: 0.75,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        part.sizeMm.x * MM,
        part.sizeMm.y * MM,
        part.sizeMm.z * MM,
      ),
      mat,
    );
    mesh.name = part.name;
    mesh.userData.role = part.role;
    mesh.position.set(
      part.positionMm.x * MM,
      part.positionMm.y * MM,
      part.positionMm.z * MM,
    );
    group.add(mesh);
  }

  return group;
}
