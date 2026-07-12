import { describe, expect, it } from "vitest";

import { placeCatalogItemInProject } from "@/features/planner/project/catalog/placementAction";
import {
  expandWorkstationV0CatalogItems,
  workstationConfigToCatalogItem,
  WORKSTATION_V0_DEMO_CATALOG_ITEMS,
} from "@/features/planner/project/catalog/workstationCatalogV0";
import {
  createWorkstationConfigV0,
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
} from "@/features/planner/project/catalog/workstationSystemV0";
import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type { PlannerProject } from "@/features/planner/project/model/types";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFloor(project: PlannerProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error(`Active floor not found: ${project.activeFloorId}`);
  return floor;
}

describe("parseWorkstationConfigKey", () => {
  it("round-trips workstationConfigKey", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const key = workstationConfigKey(config);
    const parsed = parseWorkstationConfigKey(key);
    expect(parsed).not.toBeNull();
    expect(workstationConfigKey(parsed!)).toBe(key);
    expect(parsed!.shape).toBe("linear");
    expect(parsed!.size).toEqual({ lengthMm: 1500, depthMm: 600 });
  });

  it("parses l-shape keys", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel"],
    });
    const parsed = parseWorkstationConfigKey(workstationConfigKey(config));
    expect(parsed?.shape).toBe("l-shape");
    expect(parsed?.modules).toContain("return");
  });

  it("returns null for non-ws keys", () => {
    expect(parseWorkstationConfigKey("cabinet-v0")).toBeNull();
    expect(parseWorkstationConfigKey("ws-v0-bad")).toBeNull();
  });
});

describe("workstationConfigToCatalogItem", () => {
  it("builds catalog item with footprint dimensions and stable id", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const item = workstationConfigToCatalogItem(config);
    const fp = workstationFootprintMm(config);
    expect(item.id).toBe(workstationConfigKey(config));
    expect(item.dimensions.widthMm).toBe(fp.widthMm);
    expect(item.dimensions.depthMm).toBe(fp.depthMm);
    expect(item.tags).toContain("systems-v0");
    expect(item.geometryMode).toBe("workstation-v0");
  });

  it("matrix expands to 8 demo catalog items", () => {
    const items = expandWorkstationV0CatalogItems();
    expect(items).toHaveLength(8);
    expect(WORKSTATION_V0_DEMO_CATALOG_ITEMS).toHaveLength(8);
    const ids = new Set(items.map((i) => i.id));
    expect(ids.size).toBe(8);
  });

  it("demo catalog includes workstation items", () => {
    const ws = PLANNER_DEMO_CATALOG_ITEMS.filter((i) =>
      i.tags.includes("systems-v0"),
    );
    expect(ws.length).toBeGreaterThanOrEqual(8);
  });
});

describe("placeCatalogItemInProject systems v0 route", () => {
  it("places linear 1500×600 from catalog item via PLACE_WORKSTATION_V0", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const item = workstationConfigToCatalogItem(config);
    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "WS Catalog Place",
      now: "2026-07-09T17:00:00.000Z",
    });

    const { result, snapshot } = placeCatalogItemInProject(project, item, null, {
      placedFrom: "click",
      position: { x: 2000, y: 1000 },
    });
    project = result.project;

    expect(result.action.type).toBe("PLACE_WORKSTATION_V0");
    expect(snapshot.productIdentity.catalogId).toBe(item.id);

    const furniture = activeFloor(project).furniture;
    expect(furniture).toHaveLength(1);
    expect(furniture[0].width).toBe(1500);
    expect(furniture[0].depth).toBe(600);
    expect(furniture[0].geometryMode).toBe("workstation-v0");
    expect(furniture[0].workstationOptions?.lengthMm).toBe(1500);
    expect(furniture[0].catalogId).toBe(item.id);
    expect(furniture[0].position).toEqual({ x: 2000, y: 1000 });
  });
});
