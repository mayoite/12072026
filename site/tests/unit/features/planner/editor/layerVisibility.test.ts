import { describe, expect, it } from "vitest";
import {
  DEFAULT_LAYER_VISIBILITY,
  toggleLayerVisibility,
  summarizeFloorLayers,
} from "@/features/planner/editor/layerVisibility";
import type { PlannerProject, PlannerFloor } from "@/features/planner/project/model/types";

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


describe("layerVisibility", () => {
  it("defaults every layer to visible", () => {
    const keys = Object.keys(DEFAULT_LAYER_VISIBILITY);
    expect(keys.length).toBe(10);
    for (const k of keys) {
      expect(DEFAULT_LAYER_VISIBILITY[k as keyof typeof DEFAULT_LAYER_VISIBILITY]).toBe(true);
    }
  });

  it("toggles a single category immutably", () => {
    const next = toggleLayerVisibility(DEFAULT_LAYER_VISIBILITY, "walls");
    expect(next.walls).toBe(false);
    expect(DEFAULT_LAYER_VISIBILITY.walls).toBe(true);
    expect(next.furniture).toBe(true);
  });

  it("summarizes floor entity counts with labels", () => {
    const floor = emptyFloor({
      walls: [{ id: "w1", start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, height: 1, thickness: 1 }],
      furniture: [
        {
          id: "f1",
          catalogId: "c",
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: { x: 1, y: 1, z: 1 },
          width: 1,
          depth: 1,
          height: 1,
        },
      ],
    });
    const summary = summarizeFloorLayers(floor);
    expect(summary.find((s) => s.key === "walls")?.count).toBe(1);
    expect(summary.find((s) => s.key === "furniture")?.count).toBe(1);
    expect(summary.find((s) => s.key === "walls")?.label).toBe("Walls");
    expect(summary.find((s) => s.key === "doors")?.count).toBe(0);
  });
});
