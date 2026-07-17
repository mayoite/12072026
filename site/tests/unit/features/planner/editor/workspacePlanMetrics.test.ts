import { describe, expect, it } from "vitest";
import { summarizeFloorMetrics } from "@/features/planner/editor/workspacePlanMetrics";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
} from "@/features/planner/catalog/workstationSystemV0";
import type { PlannerFloor } from "@/features/planner/model/types";

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

describe("workspacePlanMetrics", () => {
  it("counts walls and furniture; seats only for workstation v0 keys", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    const key = workstationConfigKey(config);
    const metrics = summarizeFloorMetrics(
      emptyFloor({
        walls: [
          { id: "w1", start: { x: 0, y: 0 }, end: { x: 1000, y: 0 }, height: 2700, thickness: 100 },
        ],
        furniture: [
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
            width: 600,
            depth: 400,
            height: 800,
          },
        ],
      }),
    );
    expect(metrics.walls).toBe(1);
    expect(metrics.furniture).toBe(2);
    expect(metrics.workstationSeats).toBe(1);
    expect(metrics.boqReady).toBe(true);
    expect(metrics.floorLabel).toBe("Level 1");
  });

  it("returns zeros for empty or missing floor", () => {
    const m = summarizeFloorMetrics(emptyFloor());
    expect(m.walls).toBe(0);
    expect(m.furniture).toBe(0);
    expect(m.workstationSeats).toBe(0);
    expect(m.boqReady).toBe(false);
    expect(m.closedRoom).toBe(false);
    expect(summarizeFloorMetrics(undefined).objects).toBe(0);
  });

  it("distinguishes a closed room from disconnected wall counts", () => {
    const wall = (id: string, start: { x: number; y: number }, end: { x: number; y: number }) => ({
      id,
      start,
      end,
      height: 2700,
      thickness: 150,
    });
    const closed = summarizeFloorMetrics(emptyFloor({
      walls: [
        wall("a", { x: 0, y: 0 }, { x: 4000, y: 0 }),
        wall("b", { x: 4000, y: 0 }, { x: 4000, y: 3000 }),
        wall("c", { x: 4000, y: 3000 }, { x: 0, y: 3000 }),
        wall("d", { x: 0, y: 3000 }, { x: 0, y: 0 }),
      ],
    }));
    const disconnected = summarizeFloorMetrics(emptyFloor({
      walls: [
        wall("a", { x: 0, y: 0 }, { x: 1000, y: 0 }),
        wall("b", { x: 2000, y: 0 }, { x: 3000, y: 0 }),
        wall("c", { x: 4000, y: 0 }, { x: 5000, y: 0 }),
        wall("d", { x: 6000, y: 0 }, { x: 7000, y: 0 }),
      ],
    }));
    expect(closed.closedRoom).toBe(true);
    expect(disconnected.closedRoom).toBe(false);
  });
});
