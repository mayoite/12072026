/**
 * Smallest modular furniture slice: cabinet-v0 options → 2D path + 3D mesh group.
 * Must-do path: component choices without designer GLB.
 * W7 bar: readable toe → carcass → door(s); height integrity (toe not additive).
 */

import * as THREE from "three";

export type CabinetDoorStyle = "none" | "slab" | "pair";
export type CabinetMaterialId = "oak" | "white";

export interface ModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: CabinetDoorStyle;
  material: CabinetMaterialId;
}

const MATERIAL_COLOR: Record<CabinetMaterialId, string> = {
  oak: "#c4a574",
  white: "#f3f4f6",
};

/** Slightly darker band so toe reads against carcass (same family). */
const TOE_MATERIAL_COLOR: Record<CabinetMaterialId, string> = {
  oak: "#a88858",
  white: "#d1d5db",
};

/** Locked W7 geometry constants — import in GlbExport (no duplicate magic). */
export const TOE_HEIGHT_MM = 100;
export const TOE_INSET_MM = 50;
export const DOOR_THICKNESS_MM = 18;

const MM = 0.001;

export function defaultCabinetV0Options(
  partial?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0Options {
  return {
    widthMm: partial?.widthMm ?? 600,
    depthMm: partial?.depthMm ?? 580,
    heightMm: partial?.heightMm ?? 720,
    doorStyle: partial?.doorStyle ?? "slab",
    material: partial?.material ?? "white",
  };
}

/** Top-down SVG path (plan mm, centered). */
export function generateCabinetV0Footprint(
  options: ModularCabinetV0Options,
): string {
  const halfW = options.widthMm / 2;
  const halfD = options.depthMm / 2;
  return `M -${halfW} -${halfD} L ${halfW} -${halfD} L ${halfW} ${halfD} L -${halfW} ${halfD} Z`;
}

/**
 * Build a Three group in metres (Y-up). Toe + carcass + optional door panel(s).
 * Child order: toe → carcass → door(s).
 * Child count: 2 (none) | 3 (slab) | 4 (pair).
 * Height integrity: total Y span ≈ heightMm (toe replaces bottom of carcass).
 */
export function generateCabinetV0Mesh(
  options: ModularCabinetV0Options,
): THREE.Group {
  const group = new THREE.Group();
  group.name = "modular-cabinet-v0";
  group.userData = {
    modular: "cabinet-v0",
    options: { ...options },
  };

  const color = MATERIAL_COLOR[options.material];
  const toeColor = TOE_MATERIAL_COLOR[options.material];
  const carcassMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.75,
    metalness: 0.05,
  });
  const toeMat = new THREE.MeshStandardMaterial({
    color: toeColor,
    roughness: 0.85,
    metalness: 0.04,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
    metalness: 0.08,
  });

  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;
  const toeH = TOE_HEIGHT_MM * MM;
  const inset = TOE_INSET_MM * MM;
  const carcassH = h - toeH;
  const doorT = DOOR_THICKNESS_MM * MM;
  const carcassY = toeH + carcassH / 2;

  const toe = new THREE.Mesh(
    new THREE.BoxGeometry(w, toeH, d - inset),
    toeMat,
  );
  toe.name = "toe";
  toe.position.set(0, toeH / 2, -inset / 2);
  group.add(toe);

  const carcass = new THREE.Mesh(
    new THREE.BoxGeometry(w, carcassH, d),
    carcassMat,
  );
  carcass.name = "carcass";
  carcass.position.set(0, carcassY, 0);
  group.add(carcass);

  if (options.doorStyle === "slab") {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.96, carcassH * 0.92, doorT),
      doorMat,
    );
    door.name = "door-slab";
    door.position.set(0, carcassY, d / 2 + doorT / 2);
    group.add(door);
  } else if (options.doorStyle === "pair") {
    const leafW = w * 0.47;
    const leafH = carcassH * 0.92;
    const z = d / 2 + doorT / 2;
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, doorT),
      doorMat,
    );
    left.name = "door-left";
    left.position.set(-leafW / 2 - 0.005, carcassY, z);
    const right = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, doorT),
      doorMat,
    );
    right.name = "door-right";
    right.position.set(leafW / 2 + 0.005, carcassY, z);
    group.add(left, right);
  }

  return group;
}

/** Mesh/group child count for tests (excludes non-mesh). Always includes toe. */
export function countCabinetV0Parts(options: ModularCabinetV0Options): number {
  if (options.doorStyle === "none") return 2;
  if (options.doorStyle === "slab") return 3;
  return 4;
}
