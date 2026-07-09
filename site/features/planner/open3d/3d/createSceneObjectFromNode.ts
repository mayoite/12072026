/**
 * Pure scene-object factory for Open3dSceneNode → THREE Object3D.
 * Modular furniture uses generateCabinetV0Mesh / generateWorkstationV0Mesh
 * (no designer GLB, no THREE on document).
 * Non-modular furniture box uses ParametricBuilder.generate3DMesh when W/D/H are available.
 * System-generated GLB is loaded asynchronously by the viewer (see loadGeneratedGlbObject);
 * this factory always builds the procedural fallback immediately.
 */

import type * as THREE from "three";
import {
  defaultCabinetV0Options,
  generateCabinetV0Mesh,
} from "../catalog/modularCabinetV0";
import {
  generateWorkstationV0Mesh,
  workstationConfigFromOptions,
} from "../catalog/workstationMeshV0";
import {
  createWorkstationConfigV0,
  parseWorkstationConfigKey,
} from "../catalog/workstationSystemV0";
import { ParametricBuilder } from "../catalog/parametricBuilder";
import { resolvePaintColor } from "../shared/readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../shared/themeColorTokens";
import { mmToMeters, type Open3dSceneNode } from "./buildOpen3dSceneNodes";

type ThreeModule = typeof THREE;

/** True when paint is a CSS custom-property ref (not a THREE-parseable color). */
function isCssThemeRef(color: string | undefined): boolean {
  if (!color) return false;
  const t = color.trim();
  return t.startsWith("var(") || t.startsWith("--");
}

/**
 * THREE.Color cannot parse CSS custom properties (`var(--token)`).
 * Model walls/furniture store theme refs via themeColorRef — resolve before materials.
 * Never returns an unresolved var()/--token string (avoids THREE.Color console spam + gray fail).
 */
function resolveThreeMaterialColor(
  color: string | undefined,
  fallbackToken: string,
  hexFallback: string,
): string {
  try {
    if (typeof document !== "undefined") {
      const resolved = resolvePaintColor(color, fallbackToken).trim();
      // Reject unresolved or nested-var leftovers; THREE only accepts #hex/rgb/hsl/named.
      if (resolved && !isCssThemeRef(resolved) && !resolved.includes("var(")) {
        return resolved;
      }
    }
  } catch {
    /* fall through to literal / hex fallback */
  }
  if (color && !isCssThemeRef(color) && !color.includes("var(")) {
    return color;
  }
  return hexFallback;
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

function hasPositiveDimensions(node: Open3dSceneNode): boolean {
  return (
    Number.isFinite(node.widthMm) &&
    Number.isFinite(node.depthMm) &&
    Number.isFinite(node.heightMm) &&
    node.widthMm > 0 &&
    node.depthMm > 0 &&
    node.heightMm > 0
  );
}

/**
 * Build a wall box or furniture object (parametric / modular-cabinet-v0 /
 * workstation-v0 group). Pose matches plan mm → world metres (Y-up, plan Y → world Z).
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

  if (
    node.kind === "furniture" &&
    node.geometryMode === "workstation-v0"
  ) {
    const config = node.workstationOptions
      ? workstationConfigFromOptions(node.workstationOptions)
      : parseWorkstationConfigKey(node.catalogId ?? "") ??
        createWorkstationConfigV0({
          shape: "linear",
          size: { lengthMm: node.widthMm, depthMm: node.depthMm },
          modules: ["desk"],
          heightMm: node.heightMm,
        });
    // Prefer stamped height / size when options missing height only
    const resolved = createWorkstationConfigV0({
      shape: config.shape,
      size: config.size,
      modules: config.modules,
      heightMm: node.workstationOptions?.heightMm ?? node.heightMm ?? config.heightMm,
    });
    const meshGroup = generateWorkstationV0Mesh(resolved);
    meshGroup.name = node.id;
    meshGroup.userData = {
      ...meshGroup.userData,
      entityId: node.id,
      kind: node.kind,
      geometryMode: "workstation-v0",
      meshSource: "procedural",
    };
    meshGroup.position.set(
      mmToMeters(node.xMm),
      0,
      mmToMeters(node.yMm),
    );
    meshGroup.rotation.y = -node.rotation;
    applyShadowFlags(meshGroup, THREE, castShadow);
    return meshGroup;
  }

  // Non-modular furniture: ParametricBuilder box mesh (entitySource parametric-box).
  if (node.kind === "furniture" && hasPositiveDimensions(node)) {
    const mesh = ParametricBuilder.generate3DMesh({
      geometry: {
        widthMm: node.widthMm,
        heightMm: node.heightMm,
        depthMm: node.depthMm,
      },
    });
    mesh.name = node.id;
    mesh.userData = {
      ...mesh.userData,
      entityId: node.id,
      kind: node.kind,
      meshSource: "procedural",
    };
    // generate3DMesh sets y = h/2; place plan x/y → world x/z and rotation.
    mesh.position.set(
      mmToMeters(node.xMm),
      mesh.position.y,
      mmToMeters(node.yMm),
    );
    mesh.rotation.y = -node.rotation;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = castShadow;
    return mesh;
  }

  // Walls (and any furniture missing dimensions): local BoxGeometry fallback.
  const w = mmToMeters(node.widthMm);
  const d = mmToMeters(node.depthMm);
  const h = mmToMeters(node.heightMm);
  const isWall = node.kind === "wall";
  // Model walls default to wallDefault (--text-inverse-body) for 2D plan paint.
  // In 3D that reads as washed inverse-text gray — use wallStroke (block wall) for mass.
  // Explicit user hex/rgb still wins; theme refs remap to intentional wall token.
  const paintInput =
    isWall && isCssThemeRef(node.color) ? undefined : node.color;
  const color = resolveThreeMaterialColor(
    paintInput,
    isWall
      ? PLANNER_COLOR_TOKENS.wallStroke
      : PLANNER_COLOR_TOKENS.furnitureDefault,
    // Match theme.css --color-dark-midnight-blue-600 (wall block family)
    isWall ? "#182A40" : "#e5e7eb",
  );
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
