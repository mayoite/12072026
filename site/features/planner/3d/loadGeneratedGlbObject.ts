/**
 * Load a system-generated GLB into a THREE object for the open3d viewer.
 * Policy-gated: designer static URLs are rejected; failures return null
 * so the caller can keep the procedural mesh.
 *
 * Relative document paths (`catalog-assets/generated/*`) are resolved to
 * absolute fetch URLs (site origin root) before GLTFLoader — page-relative
 * resolution under /planner/open3d would 404 even when the file is served.
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

/** Options for resolveGeneratedGlbFetchUrl / loadGeneratedGlbObject. */
export interface ResolveGeneratedGlbFetchUrlOptions {
  /**
   * Origin used for relative / root-relative paths (e.g. https://example.com).
   * Defaults to `window.location.origin` in the browser.
   */
  readonly origin?: string;
}

function defaultBrowserOrigin(): string | undefined {
  if (typeof globalThis === "undefined") return undefined;
  const loc = (globalThis as { location?: { origin?: string } }).location;
  const origin = loc?.origin;
  if (
    typeof origin === "string" &&
    origin.length > 0 &&
    origin !== "null"
  ) {
    return origin.replace(/\/+$/, "");
  }
  return undefined;
}

/**
 * Resolve a policy-stored generated GLB URL into a fetchable URL for GLTFLoader.
 *
 * - `blob:` / `data:` — unchanged (opaque)
 * - absolute `http(s):` — unchanged
 * - root-relative `/catalog-assets/generated/…` → `{origin}/catalog-assets/generated/…`
 * - relative `catalog-assets/generated/…` → same, pinned to **site root**
 *   (never page-relative under `/planner/open3d`)
 *
 * When no origin is available (SSR / headless without location), returns a
 * root-relative path so the request still targets site root, not the route dir.
 */
export function resolveGeneratedGlbFetchUrl(
  url: string,
  options?: ResolveGeneratedGlbFetchUrlOptions,
): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Protocol-relative CDN URLs — leave for the browser / loader.
  if (trimmed.startsWith("//")) {
    return trimmed;
  }

  const origin = (
    options?.origin ?? defaultBrowserOrigin() ?? ""
  ).replace(/\/+$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (!origin) {
    return path;
  }
  return `${origin}${path}`;
}

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
 *
 * Document URL stays on `userData.generatedGlbUrl`; fetch uses
 * {@link resolveGeneratedGlbFetchUrl} so relative catalog paths hit site root.
 */
export async function loadGeneratedGlbObject(
  THREE: ThreeModule,
  node: Open3dSceneNode,
  castShadow: boolean,
  loadGltf: GltfUrlLoader,
  options?: ResolveGeneratedGlbFetchUrlOptions,
): Promise<THREE.Object3D | null> {
  if (node.kind !== "furniture") return null;
  const url = node.generatedGlbUrl;
  if (!shouldLoadGlb(url)) return null;
  if (url === null || url === undefined) return null;

  try {
    const fetchUrl = resolveGeneratedGlbFetchUrl(url, options);
    const { scene } = await loadGltf(fetchUrl);
    const root = new THREE.Group();
    root.name = node.id;
    root.userData = {
      entityId: node.id,
      kind: node.kind,
      geometryMode: node.geometryMode,
      meshSource: "generated-glb",
      /** Document / policy path (may be relative). */
      generatedGlbUrl: url,
      /** Absolute (or root-relative) URL actually passed to the loader. */
      generatedGlbFetchUrl: fetchUrl,
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
