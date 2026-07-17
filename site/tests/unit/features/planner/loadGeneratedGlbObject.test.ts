import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";
import { createSceneObjectFromNode } from "@/features/planner/3d/createSceneObjectFromNode";
import {
  loadGeneratedGlbObject,
  resolveGeneratedGlbFetchUrl,
  type GltfUrlLoader,
} from "@/features/planner/3d/loadGeneratedGlbObject";
import type { PlannerProject } from "@/features/planner/model/types";
import type { PlannerSceneNode } from "@/features/planner/3d/buildPlannerSceneNodes";

const TEST_ORIGIN = "https://viewer.test.example";

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

function projectWithFurniture(
  furniture: PlannerProject["floors"][number]["furniture"],
): PlannerProject {
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

describe("buildPlannerSceneNodes generatedGlbUrl pass-through", () => {
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
    const node = buildPlannerSceneNodes(project).find((n) => n.id === "f1");
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
    const node = buildPlannerSceneNodes(project).find((n) => n.id === "f2");
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
    const node = buildPlannerSceneNodes(project).find((n) => n.id === "f3");
    expect(node?.generatedGlbUrl).toBe("catalog-assets/generated/a.glb");
  });
});

describe("resolveGeneratedGlbFetchUrl", () => {
  it("1. relative catalog-assets/generated → absolute with origin", () => {
    expect(
      resolveGeneratedGlbFetchUrl("catalog-assets/generated/cab.glb", {
        origin: TEST_ORIGIN,
      }),
    ).toBe(`${TEST_ORIGIN}/catalog-assets/generated/cab.glb`);
  });

  it("2. leading slash path → absolute with origin", () => {
    expect(
      resolveGeneratedGlbFetchUrl("/catalog-assets/generated/mod/x.glb", {
        origin: TEST_ORIGIN,
      }),
    ).toBe(`${TEST_ORIGIN}/catalog-assets/generated/mod/x.glb`);
  });

  it("3a. https absolute URL unchanged", () => {
    const abs =
      "https://cdn.example/storage/catalog-assets/generated/cab-v0.glb";
    expect(resolveGeneratedGlbFetchUrl(abs, { origin: TEST_ORIGIN })).toBe(
      abs,
    );
  });

  it("3b. http absolute URL unchanged", () => {
    const abs =
      "http://cdn.example/storage/catalog-assets/generated/cab-v0.glb";
    expect(resolveGeneratedGlbFetchUrl(abs, { origin: TEST_ORIGIN })).toBe(
      abs,
    );
  });

  it("3c. blob: URL unchanged", () => {
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
  it("4. shouldLoadGlb false (designer static) → no load / null", async () => {
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

  it("4b. shouldLoadGlb false (empty URL) → no load / null", async () => {
    const loader = vi.fn<GltfUrlLoader>();
    const result = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({ id: "empty-url", generatedGlbUrl: "   " }),
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

  it("5. mock loader: fetch URL is absolute when origin provided", async () => {
    const scene = new THREE.Group();
    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial(),
      ),
    );
    const documentUrl = "catalog-assets/generated/ok.glb";
    const expectedFetch = `${TEST_ORIGIN}/catalog-assets/generated/ok.glb`;
    const loader = vi.fn<GltfUrlLoader>(async (url) => {
      expect(url).toBe(expectedFetch);
      expect(url.startsWith("https://")).toBe(true);
      return { scene };
    });

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
    expect(loader).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledWith(expectedFetch);
    expect(object.userData.entityId).toBe("ok-entity");
    expect(object.userData.meshSource).toBe("generated-glb");
    expect(object.userData.generatedGlbUrl).toBe(documentUrl);
    expect(object.userData.generatedGlbFetchUrl).toBe(expectedFetch);
    expect(object.position.x).toBeCloseTo(2);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(1);
    expect(object.children.length).toBeGreaterThanOrEqual(1);
  });

  it("5b. mock loader: leading-slash document path becomes absolute fetch URL", async () => {
    const scene = new THREE.Group();
    const documentUrl = "/catalog-assets/generated/slash.glb";
    const expectedFetch = `${TEST_ORIGIN}/catalog-assets/generated/slash.glb`;
    const loader = vi.fn<GltfUrlLoader>(async () => ({ scene }));
    const object = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({ id: "slash", generatedGlbUrl: documentUrl }),
      false,
      loader,
      { origin: TEST_ORIGIN },
    );
    expect(object).not.toBeNull();
    expect(loader).toHaveBeenCalledWith(expectedFetch);
    expect(object?.userData.generatedGlbUrl).toBe(documentUrl);
    expect(object?.userData.generatedGlbFetchUrl).toBe(expectedFetch);
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

  it("6a. loader failure returns null (caller keeps procedural mesh)", async () => {
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

  it("6b. cancel/abort returns null", async () => {
    const loader: GltfUrlLoader = async () => {
      const err = new Error("The operation was aborted");
      err.name = "AbortError";
      throw err;
    };
    const result = await loadGeneratedGlbObject(
      THREE,
      furnitureNode({
        id: "cancel",
        generatedGlbUrl: "catalog-assets/generated/cancel.glb",
      }),
      false,
      loader,
      { origin: TEST_ORIGIN },
    );
    expect(result).toBeNull();
  });
});
