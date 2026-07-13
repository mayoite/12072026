import { describe, expect, it } from "vitest";

import { summarizeFloorMetrics } from "@/features/planner/editor/workspacePlanMetrics";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
} from "@/features/planner/project/catalog/workstationSystemV0";
import type { PlannerFloor } from "@/features/planner/project/model/types";

function emptyFloor(overrides: Partial<PlannerFloor> = {}): PlannerFloor {
  return {
    id: "f1",
    name: "Level 1",
    level: 0,
    rooms: [],
    walls: [],
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
    ...overrides,
  };
}

function floorWithFurniture(
  furniture: PlannerFloor["furniture"],
): PlannerFloor {
  return emptyFloor({ furniture });
}

describe("summarizeFloorMetrics workstation seats", () => {
  it("counts only ws-v0 furniture as seats", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    const key = workstationConfigKey(config);
    const metrics = summarizeFloorMetrics(
      floorWithFurniture([
        {
          id: "1",
          catalogId: key,
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 1500,
          depth: 600,
          height: 750,
        },
        {
          id: "2",
          catalogId: "cabinet-v0",
          position: { x: 1, y: 1 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
        },
        {
          id: "3",
          catalogId: key,
          position: { x: 2, y: 2 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 1500,
          depth: 600,
          height: 750,
        },
      ]),
    );
    expect(metrics.furniture).toBe(3);
    expect(metrics.workstationSeats).toBe(2);
  });

  it("returns zero seats when empty", () => {
    expect(summarizeFloorMetrics(undefined).workstationSeats).toBe(0);
    expect(summarizeFloorMetrics(floorWithFurniture([])).workstationSeats).toBe(
      0,
    );
  });

  it("counts seats via sourceCatalogId when catalogId is not ws-v0", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    const key = workstationConfigKey(config);
    const metrics = summarizeFloorMetrics(
      floorWithFurniture([
        {
          id: "src-1",
          catalogId: "placed-alias",
          sourceCatalogId: key,
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 1500,
          depth: 600,
          height: 750,
        },
      ]),
    );
    expect(metrics.furniture).toBe(1);
    expect(metrics.workstationSeats).toBe(1);
  });
});

describe("summarizeFloorMetrics walls / objects / label (status honesty)", () => {
  it("undefined floor returns zeroed defaults with Floor 1 label", () => {
    expect(summarizeFloorMetrics(undefined)).toEqual({
      objects: 0,
      walls: 0,
      furniture: 0,
      workstationSeats: 0,
      floorLabel: "Floor 1",
      boqReady: false,
    });
  });

  it("reports wall and furniture counts from the floor arrays", () => {
    const floor = emptyFloor({
      name: "Mezzanine",
      walls: [
        {
          id: "w1",
          start: { x: 0, y: 0 },
          end: { x: 1000, y: 0 },
          thickness: 100,
          height: 2700,
          color: "#ccc",
        },
        {
          id: "w2",
          start: { x: 1000, y: 0 },
          end: { x: 1000, y: 1000 },
          thickness: 100,
          height: 2700,
          color: "#ccc",
        },
      ],
      furniture: [
        {
          id: "cab",
          catalogId: "cabinet-v0",
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
        },
      ],
    });
    const metrics = summarizeFloorMetrics(floor);
    expect(metrics.walls).toBe(2);
    expect(metrics.furniture).toBe(1);
    expect(metrics.floorLabel).toBe("Mezzanine");
    expect(metrics.workstationSeats).toBe(0);
  });

  it("objects sum is walls+rooms+doors+windows+furniture+stairs+columns", () => {
    const floor = emptyFloor({
      name: "L2",
      rooms: [
        {
          id: "r1",
          name: "Open",
          walls: ["w1"],
          floorTexture: "default",
          area: 1,
        },
      ],
      walls: [
        {
          id: "w1",
          start: { x: 0, y: 0 },
          end: { x: 100, y: 0 },
          thickness: 100,
          height: 2700,
          color: "#ccc",
        },
      ],
      doors: [
        {
          id: "d1",
          wallId: "w1",
          position: 10,
          width: 900,
          height: 2100,
          type: "single",
          swingDirection: "left",
          flipSide: false,
        },
      ],
      windows: [
        {
          id: "win1",
          wallId: "w1",
          position: 40,
          width: 1200,
          height: 1200,
          sillHeight: 900,
          type: "standard",
        },
      ],
      furniture: [
        {
          id: "f1",
          catalogId: "cabinet-v0",
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
        },
        {
          id: "f2",
          catalogId: "cabinet-v0",
          position: { x: 1, y: 1 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
        },
      ],
      stairs: [
        {
          id: "s1",
          position: { x: 0, y: 0 },
          rotation: 0,
          width: 1000,
          depth: 2000,
          riserCount: 12,
          direction: "up",
          stairType: "straight",
        },
      ],
      columns: [
        {
          id: "c1",
          position: { x: 0, y: 0 },
          rotation: 0,
          shape: "square",
          diameter: 300,
          height: 2700,
          color: "#888",
        },
      ],
      // Guides / measurements / annotations are NOT part of objects — honesty.
      guides: [
        {
          id: "g1",
          orientation: "horizontal",
          position: 500,
        },
      ],
    });

    const metrics = summarizeFloorMetrics(floor);
    // 1 wall + 1 room + 1 door + 1 window + 2 furniture + 1 stair + 1 column
    expect(metrics.objects).toBe(8);
    expect(metrics.walls).toBe(1);
    expect(metrics.furniture).toBe(2);
    expect(metrics.floorLabel).toBe("L2");
  });
});
