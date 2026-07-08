/**
 * Smallest modular furniture slice: cabinet-v0 options → 2D path + 3D mesh group.
 * Must-do path: component choices without designer GLB.
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

const DOOR_THICKNESS_MM = 18;
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
 * Build a Three group in metres (Y-up). Carcass + optional door panel(s).
 * Child count: 1 (none) | 2 (slab) | 3 (pair).
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
  const carcassMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.75,
    metalness: 0.05,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
    metalness: 0.08,
  });

  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;

  const carcass = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    carcassMat,
  );
  carcass.name = "carcass";
  carcass.position.y = h / 2;
  group.add(carcass);

  if (options.doorStyle === "slab") {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.96, h * 0.92, DOOR_THICKNESS_MM * MM),
      doorMat,
    );
    door.name = "door-slab";
    door.position.set(0, h / 2, d / 2 + (DOOR_THICKNESS_MM * MM) / 2);
    group.add(door);
  } else if (options.doorStyle === "pair") {
    const leafW = w * 0.47;
    const leafH = h * 0.92;
    const z = d / 2 + (DOOR_THICKNESS_MM * MM) / 2;
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, DOOR_THICKNESS_MM * MM),
      doorMat,
    );
    left.name = "door-left";
    left.position.set(-leafW / 2 - 0.005, h / 2, z);
    const right = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, DOOR_THICKNESS_MM * MM),
      doorMat,
    );
    right.name = "door-right";
    right.position.set(leafW / 2 + 0.005, h / 2, z);
    group.add(left, right);
  }

  return group;
}

/** Mesh/group child count for tests (excludes non-mesh). */
export function countCabinetV0Parts(options: ModularCabinetV0Options): number {
  if (options.doorStyle === "none") return 1;
  if (options.doorStyle === "slab") return 2;
  return 3;
}
