import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { buildOpen3dSceneNodes } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import { createSceneObjectFromNode } from "@/features/planner/open3d/3d/createSceneObjectFromNode";
import {
  loadGeneratedGlbObject,
  type GltfUrlLoader,
} from "@/features/planner/open3d/3d/loadGeneratedGlbObject";
import type { Open3dProject } from "@/features/planner/open3d/model/types";
import type { Open3dSceneNode } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";

function furnitureNode(
  overrides: Partial<Open3dSceneNode> & Pick<Open3dSceneNode, "id">,
): Open3dSceneNode {
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

function projectWithFurniture(
  furniture: Open3dProject["floors"][number]["furniture"],
): Open3dProject {
  return {
    id: "proj-g8",
    name: "G8",
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z",
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        level: 0,
        walls: [],
        rooms: [],
        doors: [],
        windows: [],
        furniture,
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
  };
}

describe("buildOpen3dSceneNodes generatedGlbUrl pass-through", () => {
  it("passes policy-allowed generatedGlbUrl onto furniture node", () => {
    const project = projectWithFurniture([
      {
        id: "f1",
        catalogId: "cabinet-v0",
        position: { x: 100, y: 200 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 580,
        height: 720,
        generatedGlbUrl: "catalog-assets/generated/cab.glb",
      },
    ]);
    const node = buildOpen3dSceneNodes(project).find((n) => n.id === "f1");
    expect(node?.generatedGlbUrl).toBe("catalog-assets/generated/cab.glb");
  });

  it("drops designer static meshUrl (policy reject — not on node)", () => {
    const project = projectWithFurniture([
      {
        id: "f2",
        catalogId: "desk",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        meshUrl: "https://cdn.example.com/models/sofa-hero.glb",
      },
    ]);
    const node = buildOpen3dSceneNodes(project).find((n) => n.id === "f2");
    expect(node?.generatedGlbUrl).toBeUndefined();
  });

  it("prefers generatedGlbUrl over meshUrl when both present", () => {
    const project = projectWithFurniture([
      {
        id: "f3",
        catalogId: "cab",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        generatedGlbUrl: "catalog-assets/generated/a.glb",
        meshUrl: "catalog-assets/generated/b.glb",
      },
    ]);
    const node = buildOpen3dSceneNodes(project).find((n) => n.id === "f3");
    expect(node?.generatedGlbUrl).toBe("catalog-assets/generated/a.glb");
  });
});

describe("loadGeneratedGlbObject (mock loader)", () => {
  it("returns null when URL fails policy (designer static never loads)", async () => {
    const loader = vi.fn<GltfUrlLoader>();
    const result = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({
        id: "bad",
        // Policy would reject; scene builder also strips, but loader must be safe.
        generatedGlbUrl: "https://cdn.example.com/models/sofa.glb",
      }),
      false,
      loader,
    );
    expect(result).toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });

  it("returns null when no URL (procedural remains default)", async () => {
    const loader = vi.fn<GltfUrlLoader>();
    const result = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({ id: "plain" }),
      false,
      loader,
    );
    expect(result).toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });

  it("loads policy-allowed URL and tags meshSource generated-glb", async () => {
    const scene = new THREE.Group();
    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial(),
      ),
    );
    const loader: GltfUrlLoader = async (url) => {
      expect(url).toBe("catalog-assets/generated/ok.glb");
      return { scene };
    };

    const node = furnitureNode({
      id: "ok-entity",
      xMm: 2000,
      yMm: 1000,
      generatedGlbUrl: "catalog-assets/generated/ok.glb",
      geometryMode: "modular-cabinet-v0",
    });
    const object = await loadGeneratedGlbObject(THREE, node, false, loader);
    expect(object).not.toBeNull();
    if (!object) throw new Error("expected glb object");
    expect(object.userData.entityId).toBe("ok-entity");
    expect(object.userData.meshSource).toBe("generated-glb");
    expect(object.userData.generatedGlbUrl).toBe(
      "catalog-assets/generated/ok.glb",
    );
    expect(object.position.x).toBeCloseTo(2);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(1);
    expect(object.children.length).toBeGreaterThanOrEqual(1);
  });

  it("returns null on loader failure (caller keeps procedural mesh)", async () => {
    const loader: GltfUrlLoader = async () => {
      throw new Error("network fail");
    };
    const result = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({
        id: "fail",
        generatedGlbUrl: "catalog-assets/generated/missing.glb",
      }),
      false,
      loader,
    );
    expect(result).toBeNull();

    // Procedural path still works for same node without URL
    const procedural = createSceneObjectFromNode(
      THREE,
      furnitureNode({
        id: "fail",
        geometryMode: "modular-cabinet-v0",
        modularOptions: {
          widthMm: 600,
          depthMm: 580,
          heightMm: 720,
          doorStyle: "slab",
          material: "white",
        },
      }),
      false,
    );
    expect(procedural.userData.meshSource).toBe("procedural");
    expect(procedural.userData.entityId).toBe("fail");
  });
});
