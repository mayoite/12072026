import { describe, expect, it } from "vitest";

import {
  executePlannerCommand,
  type PlannerCommand,
} from "@/features/planner/lib/commands/plannerCommand";
import { rankCatalogItems, toPlannerCatalogCollection } from "@/features/planner/catalog/catalogSearch";
import {
  clickToPlace,
  dragToPlace,
  validatePlannerPlacementPayload,
} from "@/features/planner/catalog/placementAction";
import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";
import { createPlannerHistory } from "@/features/planner/store/history";
import { createPlannerSelection } from "@/features/planner/store/selection";
import { exportPlannerProjectJson, importPlannerProjectJson } from "@/features/planner/persistence/projectJson";
import { createPlannerProject } from "@/features/planner/model/project";
import type { PlannerProject } from "@/features/planner/model/types";

function projectWithFurniture(locked: boolean): PlannerProject {
  const project = createPlannerProject({
    idFactory: (() => {
      const ids = ["floor", "project"];
      return () => ids.shift() ?? "generated";
    })(),
    now: "2026-07-05T00:00:00.000Z",
  });
  project.floors[0].furniture.push({
    id: "chair",
    catalogId: "catalog-chair",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    locked,
  });
  return project;
}

describe("Phase 1 command and state contracts", () => {
  it("records only successful document commands in history", () => {
    const initial = createPlannerHistory(projectWithFurniture(false));
    const command: PlannerCommand = {
      type: "document.apply",
      action: {
        type: "update",
        collection: "furniture",
        id: "chair",
        updates: { rotation: 90 },
      },
      now: "2026-07-05T01:00:00.000Z",
    };
    const applied = executePlannerCommand(initial, command);
    expect(applied.status).toBe("applied");
    expect(applied.history.past).toHaveLength(1);
    expect(executePlannerCommand(applied.history, { type: "history.undo" }).history.present)
      .toEqual(initial.present);

    const missing = executePlannerCommand(initial, {
      type: "document.apply",
      action: { type: "delete", collection: "furniture", id: "missing" },
    });
    expect(missing.status).toBe("noop");
    expect(missing.history).toBe(initial);
  });

  it("rejects every mutation targeting a locked item", () => {
    const initial = createPlannerHistory(projectWithFurniture(true));
    for (const action of [
      { type: "update", collection: "furniture", id: "chair", updates: { rotation: 45 } },
      { type: "delete", collection: "furniture", id: "chair" },
      { type: "duplicate", collection: "furniture", id: "chair", newId: "copy" },
    ] as const) {
      const result = executePlannerCommand(initial, { type: "document.apply", action });
      expect(result).toMatchObject({ status: "rejected", reason: "locked-item", entityId: "chair" });
      expect(result.history).toBe(initial);
    }
  });

  it("normalizes empty, duplicate, and multi-selection contracts", () => {
    expect(createPlannerSelection("wall", [])).toEqual({ type: "none", ids: [] });
    expect(createPlannerSelection("wall", ["a", "a", "b"])).toEqual({
      type: "wall",
      ids: ["a", "b"],
    });
  });
});

describe("Phase 1 catalogue contracts", () => {
  it("ranks with Fuse and produces React Aria collection records", () => {
    const items = PLANNER_DEMO_CATALOG_ITEMS;
    const ranked = rankCatalogItems(items, items[0].sku);
    expect(ranked[0].id).toBe(items[0].id);
    expect(toPlannerCatalogCollection(ranked)[0]).toMatchObject({
      key: items[0].id,
      item: items[0],
    });
    expect(toPlannerCatalogCollection(ranked)[0].textValue).toContain(items[0].name);
  });

  it("uses one validated payload for click and drag placement", () => {
    const item = PLANNER_DEMO_CATALOG_ITEMS[0];
    expect(clickToPlace(item, null, { x: 10, y: 20 }).position)
      .toEqual(dragToPlace(item, null, { x: 10, y: 20 }).position);
    expect(() => validatePlannerPlacementPayload({
      placedFrom: "drag",
      position: { x: Number.NaN, y: 0 },
    })).toThrow("position.x must be finite");
    expect(() => validatePlannerPlacementPayload({
      placedFrom: "click",
      scale: { x: 0, y: 1, z: 1 },
    })).toThrow("scale.x must be greater than zero");
  });
});

describe("Phase 1 deterministic persistence", () => {
  it("serializes deterministically and reloads locked placement data", () => {
    const project = projectWithFurniture(true);
    const reordered = {
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
      displayUnit: project.displayUnit,
      activeFloorId: project.activeFloorId,
      floors: project.floors,
      name: project.name,
      id: project.id,
    } as PlannerProject;
    const json = exportPlannerProjectJson(project);
    expect(exportPlannerProjectJson(reordered)).toBe(json);
    expect(importPlannerProjectJson(json)).toEqual(project);
  });
});
