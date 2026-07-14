import { describe, expect, it } from "vitest";
import {
  buildPlannerFurnitureBoq,
  exportPlannerFurnitureBoqToCsv,
  PLANNER_FURNITURE_BOQ_GST_RATE,
} from "@/features/planner/project/shared/export/projectFurnitureBoq";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";
import { addPlannerFurniture } from "@/features/planner/project/model/actions/furniture";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("projectFurnitureBoq", () => {
  it("builds BOQ lines from furniture and csv export", () => {
    let project = createRectangularRoomProject({
      name: "BOQ",
      widthMm: 5000,
      depthMm: 4000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    project = addPlannerFurniture(
      project,
      {
        catalogId: "desk-1",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1200,
        depth: 600,
        height: 750,
      },
      ids("f1"),
    );
    const boq = buildPlannerFurnitureBoq(project, {
      now: "2026-01-01T00:00:00.000Z",
    });
    expect(boq.lines.length).toBeGreaterThanOrEqual(1);
    expect(PLANNER_FURNITURE_BOQ_GST_RATE).toBeGreaterThan(0);
    const csv = exportPlannerFurnitureBoqToCsv(boq);
    expect(csv.length).toBeGreaterThan(10);
    expect(csv.toLowerCase()).toMatch(/desk|qty|quantity|line|catalog|sku|gst/i);
  });
});
