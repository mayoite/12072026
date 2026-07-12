import { describe, expect, it } from "vitest";

import { summarizeFloorMetrics } from "@/features/planner/editor/workspacePlanMetrics";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
} from "@/features/planner/project/catalog/workstationSystemV0";
import type { PlannerFloor } from "@/features/planner/project/model/types";

function floorWithFurniture(
  furniture: PlannerFloor["furniture"],
): PlannerFloor {
  return {
    id: "f1",
    name: "Level 1",
    level: 0,
    rooms: [],
    walls: [],
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
  };
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
});
