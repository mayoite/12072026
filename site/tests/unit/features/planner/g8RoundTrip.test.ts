/**
 * G8 round-trip + dispose/cancel safety.
 *
 * Covers:
 * 1. furniture generatedGlbUrl under catalog-assets/generated/ survives projectParser
 * 2. buildPlannerSceneNodes propagates URL after reload
 * 3. shouldLoadGlb rejects designer static
 * 4. disposeAndRemoveObject + cancel-safe commit gate (ThreeViewerInner pattern)
 */

import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";

import { stampFurnitureGeneratedGlb } from "@/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb";
import {
  shouldLoadGlb,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";
import {
  createSceneObjectFromNode,
  disposeAndRemoveObject,
} from "@/features/planner/3d/createSceneObjectFromNode";
import {
  loadGeneratedGlbObject,
  type GltfUrlLoader,
} from "@/features/planner/3d/loadGeneratedGlbObject";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/project/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/project/catalog/modularCabinetV0";
import {
  addFurniture,
  updateFurniture,
} from "@/features/planner/project/model/operations/pureActions";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type {
  PlannerFurnitureItem,
  PlannerProject,
} from "@/features/planner/project/model/types";
import {
  exportPlannerProjectJson,
  importPlannerProjectJson,
} from "@/features/planner/project/persistence/projectJson";
import { parsePlannerProject } from "@/features/planner/project/shared/document/projectParser";
import type { PlannerSceneNode } from "@/features/planner/3d/buildPlannerSceneNodes";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: PlannerProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) {
    throw new Error(`Active floor not found: ${project.activeFloorId}`);
  }
  return floor;
}

/**
 * Mirrors ThreeViewerInner async GLB replace gate:
 * `if (cancelled || glbObject == null) continue;`
 */
function shouldCommitGlbReplace(
  cancelled: boolean,
  glbObject: THREE.Object3D | null,
): glbObject is THREE.Object3D {
  return !cancelled && glbObject !== null;
}

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

describe("G8 round-trip: generatedGlbUrl save/reload continuity", () => {
  it("furniture with generatedGlbUrl under catalog-assets/generated/ survives projectParser", () => {
    const modularOptions = defaultCabinetV0Options({
      widthMm: 800,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "pair",
      material: "oak",
    });
    const relativePath = modularCabinetV0GeneratedRelativePath(modularOptions);
    expect(relativePath).toContain("catalog-assets/generated/");

    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "G8 Round Trip",
      now: "2026-07-09T18:00:00.000Z",
    });

    ({ project } = addFurniture(project, "cabinet-v0", { x: 1200, y: 800 }, {
      idFactory: ids("furn-1"),
    }));
    ({ project } = updateFurniture(project, "furn-1", {
      geometryMode: "modular-cabinet-v0",
      modularOptions,
      width: modularOptions.widthMm,
      depth: modularOptions.depthMm,
      height: modularOptions.heightMm,
    }));

    const before = activeFloor(project).furniture[0];
    expect(before).toBeDefined();
    const stamped = stampFurnitureGeneratedGlb(before!, relativePath);
    ({ project } = updateFurniture(project, "furn-1", {
      generatedGlbUrl: stamped.generatedGlbUrl,
    }));

    expect(activeFloor(project).furniture[0]?.generatedGlbUrl).toBe(relativePath);

    // JSON clone + parsePlannerProject (projectParser path)
    const reparsed = parsePlannerProject(JSON.parse(JSON.stringify(project)));
    expect(reparsed.floors[0]?.furniture[0]?.generatedGlbUrl).toBe(relativePath);
    expect(reparsed.floors[0]?.furniture[0]?.id).toBe("furn-1");
    expect(reparsed.floors[0]?.furniture[0]?.geometryMode).toBe(
      "modular-cabinet-v0",
    );

    // exportPlannerProjectJson → importPlannerProjectJson also routes through parser
    const json = exportPlannerProjectJson(project);
    expect(json).toContain("generatedGlbUrl");
    expect(json).toContain("catalog-assets/generated/");
    const reloaded = importPlannerProjectJson(json);
    const reloadedFurniture = activeFloor(reloaded).furniture[0];
    expect(reloadedFurniture?.id).toBe("furn-1");
    expect(reloadedFurniture?.generatedGlbUrl).toBe(relativePath);
  });

  it("projectParser rejects designer static generatedGlbUrl", () => {
    let project = createPlannerProject({
      idFactory: ids("floor-r", "project-r"),
      name: "Reject static",
      now: "2026-07-09T18:01:00.000Z",
    });
    ({ project } = addFurniture(project, "desk", { x: 0, y: 0 }, {
      idFactory: ids("furn-r"),
    }));

    const raw = JSON.parse(JSON.stringify(project)) as {
      floors: Array<{ furniture: Array<Record<string, unknown>> }>;
    };
    raw.floors[0]!.furniture[0]!.generatedGlbUrl =
      "https://cdn.example.com/models/sofa-hero.glb";

    expect(() => parsePlannerProject(raw)).toThrow(/not allowed|Static designer/i);
  });
});

describe("G8 round-trip: buildPlannerSceneNodes propagates URL", () => {
  it("propagates catalog-assets/generated generatedGlbUrl onto furniture node after reload", () => {
    const url = "catalog-assets/generated/modular/cab-v0.glb";
    const furniture: PlannerFurnitureItem = {
      id: "furn-node",
      catalogId: "cabinet-v0",
      position: { x: 500, y: 600 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 600,
      depth: 580,
      height: 720,
      generatedGlbUrl: url,
    };

    const project: PlannerProject = {
      id: "proj-nodes",
      name: "Nodes",
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
          furniture: [furniture],
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

    const reloaded = parsePlannerProject(JSON.parse(JSON.stringify(project)));
    const nodes = buildPlannerSceneNodes(reloaded);
    const node = nodes.find((n) => n.id === "furn-node");
    expect(node?.kind).toBe("furniture");
    expect(node?.generatedGlbUrl).toBe(url);
    expect(shouldLoadGlb(node?.generatedGlbUrl)).toBe(true);
  });

  it("does not attach designer static meshUrl as generatedGlbUrl on node", () => {
    const project: PlannerProject = {
      id: "proj-static",
      name: "Static reject",
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
          furniture: [
            {
              id: "furn-static",
              catalogId: "sofa",
              position: { x: 0, y: 0 },
              rotation: 0,
              scale: { x: 1, y: 1, z: 1 },
              meshUrl: "https://cdn.example.com/models/sofa-hero.glb",
            },
          ],
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

    const node = buildPlannerSceneNodes(project).find((n) => n.id === "furn-static");
    expect(node?.generatedGlbUrl).toBeUndefined();
  });
});

describe("G8 round-trip: shouldLoadGlb rejects designer static", () => {
  it("allows generated paths and blob; rejects designer static URLs", () => {
    expect(shouldLoadGlb("catalog-assets/generated/x.glb")).toBe(true);
    expect(
      shouldLoadGlb(
        "https://cdn.example/storage/catalog-assets/generated/cab.glb",
      ),
    ).toBe(true);
    expect(shouldLoadGlb("blob:http://localhost/uuid")).toBe(true);

    expect(shouldLoadGlb("https://cdn.example.com/models/sofa-hero.glb")).toBe(
      false,
    );
    expect(shouldLoadGlb("/models/kenney/chair.glb")).toBe(false);
    expect(shouldLoadGlb("catalog-assets/static/x.glb")).toBe(false);
    expect(
      rejectDesignerStaticGlbUrl("https://cdn.example.com/models/sofa-hero.glb"),
    ).toMatch(/not allowed/i);
  });
});

describe("G8 dispose / cancel safety", () => {
  it("disposeAndRemoveObject removes from parent and disposes mesh resources", () => {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshStandardMaterial();
    const geomDispose = vi.spyOn(geometry, "dispose");
    const matDispose = vi.spyOn(material, "dispose");
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { entityId: "furn-dispose", kind: "furniture" };
    group.add(mesh);
    expect(group.children).toHaveLength(1);

    disposeAndRemoveObject(THREE, mesh);

    expect(group.children).toHaveLength(0);
    expect(mesh.parent).toBeNull();
    expect(geomDispose).toHaveBeenCalled();
    expect(matDispose).toHaveBeenCalled();
  });

  it("cancel-safe: late GLB load does not commit replace when cancelled", async () => {
    let resolveLoad!: (value: { scene: THREE.Object3D }) => void;
    const pending = new Promise<{ scene: THREE.Object3D }>((resolve) => {
      resolveLoad = resolve;
    });
    const loader: GltfUrlLoader = vi.fn(async () => pending);

    let cancelled = false;
    const loadPromise = loadGeneratedGlbObject(
      THREE,
      furnitureNode({
        id: "furn-cancel",
        generatedGlbUrl: "catalog-assets/generated/cancel.glb",
      }),
      false,
      loader,
    );

    // Effect cleanup (project change / unmount) before load settles
    cancelled = true;

    const scene = new THREE.Group();
    scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.05),
        new THREE.MeshBasicMaterial(),
      ),
    );
    resolveLoad({ scene });

    const glbObject = await loadPromise;
    // Loader still returns an object; ThreeViewerInner must not add it when cancelled
    expect(glbObject).not.toBeNull();
    expect(shouldCommitGlbReplace(cancelled, glbObject)).toBe(false);

    // When not cancelled, commit is allowed
    expect(shouldCommitGlbReplace(false, glbObject)).toBe(true);
    expect(shouldCommitGlbReplace(false, null)).toBe(false);
  });

  it("procedural mesh remains available when GLB load is skipped after cancel", () => {
    const procedural = createSceneObjectFromNode(
      THREE,
      furnitureNode({
        id: "furn-procedural",
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
    expect(procedural.userData.entityId).toBe("furn-procedural");
  });
});
