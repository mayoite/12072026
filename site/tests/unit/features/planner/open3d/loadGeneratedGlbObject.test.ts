import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { buildOpen3dSceneNodes } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import { createSceneObjectFromNode } from "@/features/planner/open3d/3d/createSceneObjectFromNode";
import {
  loadGeneratedGlbObject,
  resolveGeneratedGlbFetchUrl,
  type GltfUrlLoader,
} from "@/features/planner/open3d/3d/loadGeneratedGlbObject";
import type { Open3dProject } from "@/features/planner/open3d/model/types";
import type { Open3dSceneNode } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";

const TEST_ORIGIN = "https://viewer.test.example";

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

describe("resolveGeneratedGlbFetchUrl", () => {
  it("pins relative catalog-assets/generated/ to origin root (not page-relative)", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/cab.glb", {
        origin: TEST_ORIGIN,
      }),
    ).toBe(`${TEST_ORIGIN}/catalog-assets/generated/cab.glb`);
  });

  it("resolves root-relative /catalog-assets/generated/ via origin", () => {
    expect(
      resolveGeneratedGlbFetchUrl("/catalog-assets/generated/mod/x.glb", {
        origin: TEST_ORIGIN,
      }),
    ).toBe(`${TEST_ORIGIN}/catalog-assets/generated/mod/x.glb`);
  });

  it("leaves absolute https URLs unchanged", () => {
    const abs =
      "https://cdn.example/storage/catalog-assets/generated/cab-v0.glb";
    expect(resolveGeneratedGlbFetchUrl(abs, { origin: TEST_ORIGIN })).toBe(
      abs,
    );
  });

  it("leaves blob: URLs unchanged", () => {
    const blob = "blob:http://localhost/uuid-here";
    expect(resolveGeneratedGlbFetchUrl(blob, { origin: TEST_ORIGIN })).toBe(
      blob,
    );
  });

  it("strips trailing slash on origin", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/a.glb", {
        origin: "https://app.example/",
      }),
    ).toBe("https://app.example/catalog-assets/generated/a.glb");
  });

  it("falls back to root-relative path when origin missing", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/no-origin.glb", {
        origin: "",
      }),
    ).toBe("/catalog-assets/generated/no-origin.glb");
  });

  it("uses window.location.origin when options.origin omitted (happy-dom)", () => {
    const resolved = resolveGeneratedGlbFetchUrl(
      "catalog-assets/generated/from-window.glb",
    );
    // happy-dom provides location.origin; must be absolute under that origin.
    expect(resolved).toMatch(
      /^https?:\/\/[^/]+\/catalog-assets\/generated\/from-window\.glb$/,
    );
    expect(resolved.endsWith("/catalog-assets/generated/from-window.glb")).toBe(
      true,
    );
    expect(resolved.includes("planner")).toBe(false);
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

  it("loads policy-allowed relative URL via absolute fetch URL for GLTFLoader", async () => {
    const scene = new THREE.Group();
    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial(),
      ),
    );
    const documentUrl = "catalog-assets/generated/ok.glb";
    const expectedFetch = `${TEST_ORIGIN}/catalog-assets/generated/ok.glb`;
    const loader: GltfUrlLoader = async (url) => {
      expect(url).toBe(expectedFetch);
      return { scene };
    };

    const node = furnitureNode({
      id: "ok-entity",
      xMm: 2000,
      yMm: 1000,
      generatedGlbUrl: documentUrl,
      geometryMode: "modular-cabinet-v0",
    });
    const object = await loadGeneratedGlbObject(THREE, node, false, loader, {
      origin: TEST_ORIGIN,
    });
    expect(object).not.toBeNull();
    if (!object) throw new Error("expected glb object");
    expect(object.userData.entityId).toBe("ok-entity");
    expect(object.userData.meshSource).toBe("generated-glb");
    expect(object.userData.generatedGlbUrl).toBe(documentUrl);
    expect(object.userData.generatedGlbFetchUrl).toBe(expectedFetch);
    expect(object.position.x).toBeCloseTo(2);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(1);
    expect(object.children.length).toBeGreaterThanOrEqual(1);
  });

  it("passes absolute catalog-assets CDN URL through unchanged to loader", async () => {
    const scene = new THREE.Group();
    const abs =
      "https://cdn.example/storage/catalog-assets/generated/cab.glb";
    const loader = vi.fn<GltfUrlLoader>(async () => ({ scene }));
    const object = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({ id: "cdn", generatedGlbUrl: abs }),
      false,
      loader,
      { origin: TEST_ORIGIN },
    );
    expect(object).not.toBeNull();
    expect(loader).toHaveBeenCalledWith(abs);
    expect(object?.userData.generatedGlbUrl).toBe(abs);
    expect(object?.userData.generatedGlbFetchUrl).toBe(abs);
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
      { origin: TEST_ORIGIN },
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
