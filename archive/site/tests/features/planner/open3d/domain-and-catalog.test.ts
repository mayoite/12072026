import { describe, expect, it } from "vitest";

import {
  applyOpen3dProjectAction,
  catalogItemToOpen3dFurnitureDefinition,
  createFurnitureItemFromDefinition,
  createOpen3dHistory,
  createOpen3dProject,
  createOpen3dSceneEnvelope,
  dispatchOpen3dAction,
  formatFeetAndInches,
  open3dProjectToPlannerDocument,
  parseFeetAndInches,
  plannerDocumentToOpen3dProject,
  redoOpen3dAction,
  undoOpen3dAction,
} from "@/features/planner/open3d";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";

function ids(...values: string[]): () => string {
  let index = 0;
  return () => values[index++] ?? `id-${index}`;
}

describe("Open3D domain and document adapters", () => {
  it("preserves display units and canonical millimetres through PlannerDocument", () => {
    const project = {
      ...createOpen3dProject({
        idFactory: ids("floor", "project"),
        now: "2026-07-03T00:00:00.000Z",
      }),
      displayUnit: "ft-in" as const,
    };
    const document = open3dProjectToPlannerDocument(project);
    const result = plannerDocumentToOpen3dProject(document);

    expect(result).toMatchObject({ ok: true, project });
    expect(document.sceneJson).toMatchObject(createOpen3dSceneEnvelope(project));
    expect(document.unitSystem).toBe("imperial");
  });

  it("rejects corrupt scenes without replacing current state", () => {
    const current = createOpen3dProject({ idFactory: ids("floor", "project") });
    const document = open3dProjectToPlannerDocument(current);
    const result = plannerDocumentToOpen3dProject({
      ...document,
      sceneJson: { type: "open3d-floorplan-project", version: 99 },
    });
    expect(result.ok).toBe(false);
    expect(current.floors).toHaveLength(1);
  });

  it("supports immutable entity actions with undo and redo", () => {
    const project = createOpen3dProject({ idFactory: ids("floor", "project") });
    const furniture = {
      id: "chair-1",
      catalogId: "chair",
      position: { x: 1000, y: 1000 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
    };
    const next = applyOpen3dProjectAction(project, {
      type: "add",
      collection: "furniture",
      entity: furniture,
    });
    const history = dispatchOpen3dAction(createOpen3dHistory(project), {
      type: "add",
      collection: "furniture",
      entity: furniture,
    });
    expect(project.floors[0].furniture).toEqual([]);
    expect(next.floors[0].furniture).toEqual([furniture]);
    expect(undoOpen3dAction(history).present).toEqual(project);
    expect(redoOpen3dAction(undoOpen3dAction(history)).present.floors[0].furniture).toEqual([furniture]);
  });

  it("parses and formats feet-and-inches without changing physical size", () => {
    const millimetres = parseFeetAndInches("5' 6\"");
    expect(millimetres).toBeCloseTo(1676.4);
    expect(formatFeetAndInches(millimetres)).toBe("5' 6\"");
  });
});

describe("Open3D catalog identity mapping", () => {
  const catalogItem: CatalogItem = {
    id: "product-123",
    name: "Task Chair",
    category: "equipment",
    shapeType: "chair",
    widthMm: 60,
    heightMm: 65,
    depthMm: 95,
    description: "Ergonomic task chair",
    tags: ["chair"],
    sku: "CHAIR-123",
  };

  it("normalizes catalog centimetres to canonical millimetres and retains identity", () => {
    const definition = catalogItemToOpen3dFurnitureDefinition(catalogItem);
    const placed = createFurnitureItemFromDefinition(definition, {
      id: "placed-1",
      position: { x: 2000, y: 1500 },
    });
    expect(definition.dimensionsMm).toEqual({ width: 600, depth: 650, height: 950 });
    expect(placed).toMatchObject({
      catalogId: "product-123",
      sourceCatalogId: "product-123",
      sourceSku: "CHAIR-123",
    });
  });

  it("declares safe fallback geometry when image and mesh assets are missing", () => {
    const definition = catalogItemToOpen3dFurnitureDefinition(catalogItem, "configurator");
    expect(definition).toMatchObject({
      source: "configurator",
      fallbackGeometry: "box",
    });
    expect(definition.previewImageUrl).toBeUndefined();
    expect(definition.meshUrl).toBeUndefined();
  });
});
