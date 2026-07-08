/**
 * Pure scene-object factory for Open3dSceneNode → THREE Object3D.
 * Modular furniture uses generateCabinetV0Mesh (no designer GLB, no THREE on document).
 * System-generated GLB is loaded asynchronously by the viewer (see loadGeneratedGlbObject);
 * this factory always builds the procedural fallback immediately.
 */

import type * as THREE from "three";
import {
  defaultCabinetV0Options,
  generateCabinetV0Mesh,
} from "../catalog/modularCabinetV0";
import { mmToMeters, type Open3dSceneNode } from "./buildOpen3dSceneNodes";

type ThreeModule = typeof THREE;

function applyShadowFlags(
  object: THREE.Object3D,
  THREE: ThreeModule,
  castShadow: boolean,
): void {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = castShadow;
    child.receiveShadow = castShadow;
  });
}

/**
 * Build a wall box or furniture object (box / modular-cabinet-v0 group).
 * Pose matches plan mm → world metres (Y-up, plan Y → world Z).
 * Does not load GLB (sync path); use loadGeneratedGlbObject for async replace.
 */
export function createSceneObjectFromNode(
  THREE: ThreeModule,
  node: Open3dSceneNode,
  castShadow: boolean,
): THREE.Object3D {
  if (
    node.kind === "furniture" &&
    node.geometryMode === "modular-cabinet-v0"
  ) {
    const options =
      node.modularOptions ??
      defaultCabinetV0Options({
        widthMm: node.widthMm,
        depthMm: node.depthMm,
        heightMm: node.heightMm,
      });
    const meshGroup = generateCabinetV0Mesh(options);
    meshGroup.name = node.id;
    meshGroup.userData = {
      ...meshGroup.userData,
      entityId: node.id,
      kind: node.kind,
      geometryMode: "modular-cabinet-v0",
      meshSource: "procedural",
    };
    // Group origin is floor (carcass already at h/2); box path uses centered mesh at h/2.
    meshGroup.position.set(
      mmToMeters(node.xMm),
      0,
      mmToMeters(node.yMm),
    );
    meshGroup.rotation.y = -node.rotation;
    applyShadowFlags(meshGroup, THREE, castShadow);
    return meshGroup;
  }

  const w = mmToMeters(node.widthMm);
  const d = mmToMeters(node.depthMm);
  const h = mmToMeters(node.heightMm);
  const color = node.color ?? (node.kind === "wall" ? "#9ca3af" : "#e5e7eb");
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = node.id;
  mesh.userData.entityId = node.id;
  mesh.userData.kind = node.kind;
  mesh.userData.meshSource = "procedural";
  mesh.position.set(mmToMeters(node.xMm), h / 2, mmToMeters(node.yMm));
  mesh.rotation.y = -node.rotation;
  mesh.castShadow = castShadow;
  mesh.receiveShadow = castShadow;
  return mesh;
}

/** Add all nodes into a content group (replaces prior children when called after clear). */
export function addNodesToGroup(
  THREE: ThreeModule,
  group: THREE.Group,
  nodes: Open3dSceneNode[],
  castShadow: boolean,
): void {
  for (const node of nodes) {
    group.add(createSceneObjectFromNode(THREE, node, castShadow));
  }
}

/**
 * Dispose geometries/materials under an object and remove from parent if present.
 */
export function disposeAndRemoveObject(
  THREE: ThreeModule,
  object: THREE.Object3D,
): void {
  if (object.parent) {
    object.parent.remove(object);
  }
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    materials.forEach((material) => material.dispose());
  });
}
