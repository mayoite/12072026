import * as THREE from "three";
import type { BlockDescriptorParametric } from "./svg/svgTypes";
import {
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
  type ModularCabinetV0Options,
} from "./modularCabinetV0";

const MM = 0.001;

/**
 * Client-side parametric / modular geometry.
 * Box footprint+mesh + cabinet-v0 modular path (component choices → good mesh).
 */
export const ParametricBuilder = {
  generate2DFootprint(descriptor: BlockDescriptorParametric): string {
    const { widthMm, depthMm } = descriptor.geometry;
    const halfW = widthMm / 2;
    const halfD = depthMm / 2;
    return `M -${halfW} -${halfD} L ${halfW} -${halfD} L ${halfW} ${halfD} L -${halfW} ${halfD} Z`;
  },

  /**
   * Box mesh in metres (Y-up). Prefer modularCabinetV0 for multi-part products.
   */
  generate3DMesh(descriptor: BlockDescriptorParametric): THREE.Mesh {
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
