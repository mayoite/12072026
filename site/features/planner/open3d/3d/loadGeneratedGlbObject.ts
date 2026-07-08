/**
 * Load a system-generated GLB into a THREE object for the open3d viewer.
 * Policy-gated: designer static URLs are rejected; failures return null
 * so the caller can keep the procedural mesh.
 */

import type * as THREE from "three";
import { shouldLoadGlb } from "@/features/planner/lib/glbAssetPolicy";
import { mmToMeters, type Open3dSceneNode } from "./buildOpen3dSceneNodes";

type ThreeModule = typeof THREE;

export interface GltfLoadResult {
  readonly scene: THREE.Object3D;
}

/** Injectable loader for tests (defaults to three GLTFLoader). */
export type GltfUrlLoader = (url: string) => Promise<GltfLoadResult>;

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
 * Pose a root group like modular furniture (floor origin, plan mm → world m).
 */
export function poseFurnitureObjectFromNode(
  object: THREE.Object3D,
  node: Open3dSceneNode,
): void {
  object.position.set(mmToMeters(node.xMm), 0, mmToMeters(node.yMm));
  object.rotation.y = -node.rotation;
}

/**
 * Create a default GLTFLoader-based URL loader (browser / node with fetch).
 */
export async function createDefaultGltfUrlLoader(): Promise<GltfUrlLoader> {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const loader = new GLTFLoader();
  return (url: string) =>
    new Promise<GltfLoadResult>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => resolve({ scene: gltf.scene }),
        undefined,
        (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "GLTF load failed";
          reject(new Error(message));
        },
      );
    });
}

/**
 * Attempt to load a policy-allowed GLB for a furniture node.
 * Returns null when URL is missing, rejected by policy, or load fails.
 */
export async function loadGeneratedGlbObject(
  THREE: ThreeModule,
  node: Open3dSceneNode,
  castShadow: boolean,
  loadGltf: GltfUrlLoader,
): Promise<THREE.Object3D | null> {
  if (node.kind !== "furniture") return null;
  const url = node.generatedGlbUrl;
  if (!shouldLoadGlb(url)) return null;
  if (url == null) return null;

  try {
    const { scene } = await loadGltf(url);
    const root = new THREE.Group();
    root.name = node.id;
    root.userData = {
      entityId: node.id,
      kind: node.kind,
      geometryMode: node.geometryMode,
      meshSource: "generated-glb",
      generatedGlbUrl: url,
    };
    // Clone so cache reuse cannot mutate shared graphs across entities.
    const content =
      typeof scene.clone === "function" ? scene.clone(true) : scene;
    root.add(content);
    poseFurnitureObjectFromNode(root, node);
    applyShadowFlags(root, THREE, castShadow);
    return root;
  } catch {
    return null;
  }
}
