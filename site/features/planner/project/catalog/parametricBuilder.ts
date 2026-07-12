import * as THREE from "three";
import type {
  Open3dFurnitureGeometryMode,
  Open3dModularCabinetV0Options,
} from "../model/types";
import type { BlockDescriptorParametric } from "./svg/svgTypes";
import {
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
  type ModularCabinetV0Options,
} from "./modularCabinetV0";

const MM = 0.001;
const DEFAULT_FOOTPRINT_MM = 600;

/** Placed furniture fields needed to pick box vs modular 2D footprint. */
export type FurnitureFootprintSource = {
  width?: number;
  depth?: number;
  geometryMode?: Open3dFurnitureGeometryMode;
  modularOptions?: Open3dModularCabinetV0Options;
};

function boxFootprintPath(widthMm: number, depthMm: number): string {
  const halfW = widthMm / 2;
  const halfD = depthMm / 2;
  return `M -${halfW} -${halfD} L ${halfW} -${halfD} L ${halfW} ${halfD} L -${halfW} ${halfD} Z`;
}

/**
 * Plan SVG path (mm, centered) for a placed furniture item.
 * modular-cabinet-v0 + modularOptions → generateCabinetV0Footprint;
 * otherwise box footprint from width/depth (default 600mm).
 */
export function resolveFurniture2DFootprint(
  item: FurnitureFootprintSource,
): string {
  if (
    item.geometryMode === "modular-cabinet-v0" &&
    item.modularOptions !== undefined
  ) {
    return generateCabinetV0Footprint(item.modularOptions);
  }
  return boxFootprintPath(
    item.width ?? DEFAULT_FOOTPRINT_MM,
    item.depth ?? DEFAULT_FOOTPRINT_MM,
  );
}

/**
 * Client-side parametric / modular geometry.
 * Box footprint+mesh + cabinet-v0 modular path (component choices → good mesh).
 */
export const ParametricBuilder = {
  generate2DFootprint(descriptor: BlockDescriptorParametric): string {
    const { widthMm, depthMm } = descriptor.geometry;
    return boxFootprintPath(widthMm, depthMm);
  },

  /**
   * Box mesh in metres (Y-up). Prefer modularCabinetV0 for multi-part products.
   * Accepts full parametric descriptors or geometry-only input from scene nodes.
   */
  generate3DMesh(descriptor: {
    geometry: Pick<
      BlockDescriptorParametric["geometry"],
      "widthMm" | "heightMm" | "depthMm"
    >;
  }): THREE.Mesh {
    const { widthMm, heightMm, depthMm } = descriptor.geometry;
    const geometry = new THREE.BoxGeometry(
      widthMm * MM,
      heightMm * MM,
      depthMm * MM,
    );
    const material = new THREE.MeshStandardMaterial({
      color: "#f9fafb",
      roughness: 0.8,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = (heightMm * MM) / 2;
    mesh.userData.entitySource = "parametric-box";
    return mesh;
  },

  /** Modular cabinet-v0: doors/material options without designer GLB. */
  generateModularCabinetV0(options?: Partial<ModularCabinetV0Options>): {
    footprint: string;
    group: THREE.Group;
  } {
    const opts = defaultCabinetV0Options(options);
    return {
      footprint: generateCabinetV0Footprint(opts),
      group: generateCabinetV0Mesh(opts),
    };
  },
};
