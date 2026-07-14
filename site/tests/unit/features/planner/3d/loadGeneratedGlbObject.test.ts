import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import {
  loadGeneratedGlbObject,
  poseFurnitureObjectFromNode,
  resolveGeneratedGlbFetchUrl,
  type GltfUrlLoader,
} from "@/features/planner/3d/loadGeneratedGlbObject";
import type { PlannerSceneNode } from "@/features/planner/3d/buildPlannerSceneNodes";

const ORIGIN = "https://viewer.test.example";

function furnitureNode(
  overrides: Partial<PlannerSceneNode> & Pick<PlannerSceneNode, "id">,
): PlannerSceneNode {
  return {
    kind: "furniture",
    xMm: 1000,
    yMm: 500,
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    rotation: 0,
    ...overrides,
  };
}

describe("resolveGeneratedGlbFetchUrl", () => {
  it("leaves blob/data/absolute URLs unchanged", () => {
    expect(resolveGeneratedGlbFetchUrl("blob:abc")).toBe("blob:abc");
    expect(resolveGeneratedGlbFetchUrl("data:model/gltf-binary;base64,AA")).toBe(
      "data:model/gltf-binary;base64,AA",
    );
    expect(resolveGeneratedGlbFetchUrl("https://cdn.example/a.glb")).toBe(
      "https://cdn.example/a.glb",
    );
  });

  it("pins relative catalog paths to site origin root", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/cab.glb", {
        origin: ORIGIN,
      }),
    ).toBe(`${ORIGIN}/catalog-assets/generated/cab.glb`);
    expect(
      resolveGeneratedGlbFetchUrl("/catalog-assets/generated/cab.glb", {
        origin: ORIGIN,
      }),
    ).toBe(`${ORIGIN}/catalog-assets/generated/cab.glb`);
  });

  it("returns root-relative path when origin is empty string", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/x.glb", {
        origin: "",
      }),
    ).toBe("/catalog-assets/generated/x.glb");
  });
});

describe("poseFurnitureObjectFromNode", () => {
  it("poses floor origin in metres with negated rotation", () => {
    const obj = new THREE.Group();
    poseFurnitureObjectFromNode(
      obj,
      furnitureNode({ id: "p1", xMm: 2000, yMm: 1000, rotation: Math.PI / 4 }),
    );
    expect(obj.position.x).toBeCloseTo(2, 5);
    expect(obj.position.y).toBe(0);
    expect(obj.position.z).toBeCloseTo(1, 5);
    expect(obj.rotation.y).toBeCloseTo(-Math.PI / 4, 5);
  });
});

describe("loadGeneratedGlbObject", () => {
  it("returns null for non-furniture or policy-rejected URLs", async () => {
    const loader: GltfUrlLoader = vi.fn();
    const wall: PlannerSceneNode = {
      id: "w",
      kind: "wall",
      xMm: 0,
      yMm: 0,
      widthMm: 1000,
      depthMm: 100,
      heightMm: 2700,
      rotation: 0,
      generatedGlbUrl: "catalog-assets/generated/x.glb",
    };
    expect(await loadGeneratedGlbObject(THREE, wall, true, loader)).toBeNull();

    const designer = furnitureNode({
      id: "d",
      generatedGlbUrl: "https://cdn.example.com/designer.glb",
    });
    expect(await loadGeneratedGlbObject(THREE, designer, true, loader)).toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });

  it("loads allowed generated GLB and stamps userData", async () => {
    const scene = new THREE.Group();
    scene.name = "gltf-root";
    const loader: GltfUrlLoader = vi.fn(async () => ({ scene }));
    const node = furnitureNode({
      id: "cab",
      generatedGlbUrl: "catalog-assets/generated/cab.glb",
    });
    const root = await loadGeneratedGlbObject(THREE, node, true, loader, {
      origin: ORIGIN,
    });
    expect(root).toBeInstanceOf(THREE.Group);
    expect(root?.userData.meshSource).toBe("generated-glb");
    expect(root?.userData.generatedGlbUrl).toBe("catalog-assets/generated/cab.glb");
    expect(root?.userData.generatedGlbFetchUrl).toBe(
      `${ORIGIN}/catalog-assets/generated/cab.glb`,
    );
    expect(loader).toHaveBeenCalledWith(`${ORIGIN}/catalog-assets/generated/cab.glb`);
  });

  it("returns null when loader throws", async () => {
    const loader: GltfUrlLoader = vi.fn(async () => {
      throw new Error("network");
    });
    const node = furnitureNode({
      id: "cab",
      generatedGlbUrl: "catalog-assets/generated/cab.glb",
    });
    expect(await loadGeneratedGlbObject(THREE, node, false, loader)).toBeNull();
  });
});
