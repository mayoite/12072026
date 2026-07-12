import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  modularOptionsFromCatalogItem,
  placeCatalogItemInProject,
  resolveFurnitureGeometryMode,
} from "@/features/planner/project/catalog/placementAction";
import { countCabinetV0Parts } from "@/features/planner/project/catalog/modularCabinetV0";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import type { PlannerProject } from "@/features/planner/project/model/types";
import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";
import { createSceneObjectFromNode } from "@/features/planner/3d/createSceneObjectFromNode";
import { getDemoCatalogItemById } from "@/features/planner/editor/demoCatalogItems";
import { parsePlannerProject } from "@/features/planner/project/shared/document/projectParser";

function emptyProject(): PlannerProject {
  return {
    id: "project-modular",
    name: "Modular place",
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
        furniture: [],
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

function makeCatalogItem(
  overrides: Partial<PlannerCatalogItem> = {},
): PlannerCatalogItem {
  return {
    id: "sample-desk-1",
    slug: "sample-desk-1",
    sku: "DESK-001",
    name: "Desk",
    shortName: "Desk",
    description: "Desk",
    category: "Furniture",
    subCategory: "Desks",
    taxonomyPath: "Furniture > Desks",
    dimensions: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: {
      marketingMaterial: "Oak",
      normalizedMaterial: "oak",
    },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    tags: ["desk"],
    variants: [],
    provenance: { source: "sample_data" },
    symbolOnly: false,
    ...overrides,
  };
}

describe("modular place → furniture geometry fields", () => {
  it("stamps geometryMode + modularOptions for cabinet-v0 catalog", () => {
    const item = getDemoCatalogItemById("cabinet-v0");
    expect(item).toBeDefined();
    if (!item) throw new Error("cabinet-v0 missing from demo catalog");

    expect(resolveFurnitureGeometryMode(item)).toBe("modular-cabinet-v0");
    expect(item.geometryMode).toBe("modular-cabinet-v0");

    const placement = placeCatalogItemInProject(emptyProject(), item, null, {
      placedFrom: "click",
      position: { x: 100, y: 200 },
    });
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture).toBeDefined();
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.modularOptions).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    expect(furniture?.width).toBe(600);
    expect(furniture?.catalogId).toBe("cabinet-v0");
  });

  it("detects modular by id/slug without explicit geometryMode", () => {
    const item = makeCatalogItem({
      id: "cabinet-v0",
      slug: "cabinet-v0",
      dimensions: { widthMm: 800, depthMm: 500, heightMm: 900 },
      material: {
        marketingMaterial: "Oak",
        normalizedMaterial: "oak",
      },
    });
    delete (item as { geometryMode?: string }).geometryMode;

    const placement = placeCatalogItemInProject(emptyProject(), item, null, {
      placedFrom: "api",
    });
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.modularOptions?.material).toBe("oak");
    expect(furniture?.modularOptions?.widthMm).toBe(800);
  });

  it("leaves non-modular catalog furniture without geometryMode", () => {
    const item = makeCatalogItem();
    const placement = placeCatalogItemInProject(emptyProject(), item, null, {
      placedFrom: "click",
    });
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture?.geometryMode).toBeUndefined();
    expect(furniture?.modularOptions).toBeUndefined();
    expect(furniture?.width).toBe(1600);
  });

  it("maps material override oak for modular options helper", () => {
    const item = makeCatalogItem({
      id: "cabinet-v0",
      slug: "cabinet-v0",
      geometryMode: "modular-cabinet-v0",
      material: {
        marketingMaterial: "White",
        normalizedMaterial: "white",
      },
    });
    expect(modularOptionsFromCatalogItem(item, "oak").material).toBe("oak");
  });
});

describe("buildPlannerSceneNodes propagates modular fields", () => {
  it("passes geometryMode + modularOptions on furniture nodes", () => {
    const project = emptyProject();
    project.floors[0].furniture = [
      {
        id: "furn-mod",
        catalogId: "cabinet-v0",
        position: { x: 1000, y: 500 },
        rotation: 0.5,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 580,
        height: 720,
        geometryMode: "modular-cabinet-v0",
        modularOptions: {
          widthMm: 600,
          depthMm: 580,
          heightMm: 720,
          doorStyle: "pair",
          material: "oak",
        },
      },
      {
        id: "furn-box",
        catalogId: "sample-desk-1",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1600,
        depth: 800,
        height: 750,
      },
    ];

    const nodes = buildPlannerSceneNodes(project);
    const mod = nodes.find((n) => n.id === "furn-mod");
    const box = nodes.find((n) => n.id === "furn-box");

    expect(mod?.geometryMode).toBe("modular-cabinet-v0");
    expect(mod?.modularOptions).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "pair",
      material: "oak",
    });
    expect(box?.geometryMode).toBeUndefined();
    expect(box?.modularOptions).toBeUndefined();
  });
});

describe("createSceneObjectFromNode mesh paths", () => {
  it("builds multi-part modular group with entityId", () => {
    const options = {
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab" as const,
      material: "white" as const,
    };
    const object = createSceneObjectFromNode(
      THREE,
      {
        id: "entity-cab",
        kind: "furniture",
        xMm: 1000,
        yMm: 500,
        widthMm: 600,
        depthMm: 580,
        heightMm: 720,
        rotation: 0,
        geometryMode: "modular-cabinet-v0",
        modularOptions: options,
      },
      false,
    );

    expect(object.userData.entityId).toBe("entity-cab");
    expect(object.userData.geometryMode).toBe("modular-cabinet-v0");
    expect(object.children).toHaveLength(countCabinetV0Parts(options));
    expect(object.position.x).toBeCloseTo(1);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(0.5);
    // Must not be a single BoxGeometry mesh root for modular path
    expect(object.type).toBe("Group");
  });

  it("routes non-modular furniture through ParametricBuilder box mesh", () => {
    const object = createSceneObjectFromNode(
      THREE,
      {
        id: "entity-box",
        kind: "furniture",
        xMm: 2000,
        yMm: 0,
        widthMm: 1600,
        depthMm: 800,
        heightMm: 750,
        rotation: 0,
        color: "#abcdef",
      },
      false,
    );

    expect(object.type).toBe("Mesh");
    expect(object.userData.entityId).toBe("entity-box");
    expect(object.userData.entitySource).toBe("parametric-box");
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.children).toHaveLength(0);
    expect(object.position.y).toBeCloseTo(0.375);
    expect(object.position.x).toBeCloseTo(2);
  });
});

/**
 * Full pipeline smoke: demo cabinet-v0 place → scene nodes → mesh factory.
 * Proves modular multi-part Group vs box Mesh child counts on the live path.
 */
describe("modular place → scene node → mesh factory (integration)", () => {
  it("cabinet-v0 multi-part Group; box catalog single Mesh", () => {
    const cabinetItem = getDemoCatalogItemById("cabinet-v0");
    expect(cabinetItem).toBeDefined();
    if (!cabinetItem) throw new Error("cabinet-v0 missing from demo catalog");

    const boxItem = makeCatalogItem({
      id: "sample-desk-1",
      slug: "sample-desk-1",
      dimensions: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    });

    let project = emptyProject();
    const cabinetPlace = placeCatalogItemInProject(project, cabinetItem, null, {
      placedFrom: "click",
      position: { x: 1200, y: 800 },
    });
    project = cabinetPlace.result.project;

    const boxPlace = placeCatalogItemInProject(project, boxItem, null, {
      placedFrom: "click",
      position: { x: 0, y: 0 },
    });
    project = boxPlace.result.project;

    const furniture = project.floors[0]?.furniture ?? [];
    const placedCabinet = furniture.find((f) => f.catalogId === "cabinet-v0");
    const placedBox = furniture.find((f) => f.catalogId === "sample-desk-1");
    expect(placedCabinet).toBeDefined();
    expect(placedBox).toBeDefined();
    if (!placedCabinet || !placedBox) {
      throw new Error("expected both cabinet-v0 and box furniture after place");
    }

    expect(placedCabinet.geometryMode).toBe("modular-cabinet-v0");
    expect(placedCabinet.modularOptions).toBeDefined();
    expect(placedBox.geometryMode).toBeUndefined();

    const nodes = buildPlannerSceneNodes(project);
    const cabinetNode = nodes.find((n) => n.id === placedCabinet.id);
    const boxNode = nodes.find((n) => n.id === placedBox.id);
    expect(cabinetNode).toBeDefined();
    expect(boxNode).toBeDefined();
    if (!cabinetNode || !boxNode) {
      throw new Error("scene nodes missing for placed furniture");
    }

    expect(cabinetNode.kind).toBe("furniture");
    expect(cabinetNode.geometryMode).toBe("modular-cabinet-v0");
    expect(cabinetNode.modularOptions).toEqual(placedCabinet.modularOptions);
    expect(cabinetNode.xMm).toBe(1200);
    expect(cabinetNode.yMm).toBe(800);
    expect(boxNode.geometryMode).toBeUndefined();
    expect(boxNode.modularOptions).toBeUndefined();

    const cabinetObject = createSceneObjectFromNode(THREE, cabinetNode, false);
    const boxObject = createSceneObjectFromNode(THREE, boxNode, false);

    const modularOptions = placedCabinet.modularOptions;
    expect(modularOptions).toBeDefined();
    if (!modularOptions) throw new Error("modularOptions required for part count");

    expect(cabinetObject.type).toBe("Group");
    expect(cabinetObject.userData.geometryMode).toBe("modular-cabinet-v0");
    expect(cabinetObject.userData.entityId).toBe(placedCabinet.id);
    expect(cabinetObject.children.length).toBeGreaterThan(1);
    expect(cabinetObject.children).toHaveLength(
      countCabinetV0Parts(modularOptions),
    );

    expect(boxObject.type).toBe("Mesh");
    expect(boxObject.userData.entityId).toBe(placedBox.id);
    expect(boxObject.userData.entitySource).toBe("parametric-box");
    expect(boxObject.children).toHaveLength(0);
    expect(boxObject.userData.geometryMode).toBeUndefined();
  });
});

describe("projectParser furniture modular fields", () => {
  it("round-trips geometryMode + modularOptions", () => {
    const project = emptyProject();
    project.floors[0].furniture = [
      {
        id: "f1",
        catalogId: "cabinet-v0",
        position: { x: 1, y: 2 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 580,
        height: 720,
        geometryMode: "modular-cabinet-v0",
        modularOptions: {
          widthMm: 600,
          depthMm: 580,
          heightMm: 720,
          doorStyle: "none",
          material: "oak",
        },
      },
    ];

    const parsed = parsePlannerProject(JSON.parse(JSON.stringify(project)));
    expect(parsed.floors[0].furniture[0]?.geometryMode).toBe(
      "modular-cabinet-v0",
    );
    expect(parsed.floors[0].furniture[0]?.modularOptions).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "none",
      material: "oak",
    });
  });

  it("rejects invalid modularOptions.doorStyle", () => {
    const raw = JSON.parse(JSON.stringify(emptyProject())) as {
      floors: Array<{ furniture: Array<Record<string, unknown>> }>;
    };
    raw.floors[0].furniture = [
      {
        id: "f-bad",
        catalogId: "cabinet-v0",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        geometryMode: "modular-cabinet-v0",
        modularOptions: {
          widthMm: 600,
          depthMm: 580,
          heightMm: 720,
          doorStyle: "hinged",
          material: "white",
        },
      },
    ];
    expect(() => parsePlannerProject(raw)).toThrow("unsupported value");
  });
});
