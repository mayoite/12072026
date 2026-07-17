import { describe, expect, it } from "vitest";

import { convertLegacyRectScene } from "@/features/planner/shared/document/legacyProject";
import { snapDrawingPoint } from "@/features/planner/lib/geometry/snapping";
import { createPlannerProject } from "@/features/planner/model/project";
import {
  displayValueToMm,
  formatFeetAndInches,
  parseFeetAndInches,
} from "@/features/planner/model/units";
import { addPlannerWall } from "@/features/planner/model/actions/walls";
import {
  exportPlannerProjectJson,
  importPlannerProjectJson,
} from "@/features/planner/persistence/projectJson";
import { createPlannerGuestProjectRepository } from "@/features/planner/persistence/guestProjectRepository";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `id-${index}`;
}

describe("Phase 01B feasibility", () => {
  it("adds one immutable canonical-mm wall and round-trips JSON", () => {
    const project = createPlannerProject({
      idFactory: ids("floor", "project"),
      now: "2026-07-03T00:00:00.000Z",
    });
    const next = addPlannerWall(
      project,
      { start: { x: 0, y: 0 }, end: { x: 6000, y: 0 } },
      ids("wall"),
    );
    expect(project.floors[0].walls).toEqual([]);
    expect(importPlannerProjectJson(exportPlannerProjectJson(next))).toEqual(next);
  });

  it("uses deterministic endpoint snapping and supports suppression", () => {
    const input = {
      raw: { x: 95, y: 2 },
      start: { x: 0, y: 0 },
      endpoints: [{ x: 100, y: 0 }],
      zoom: 1,
    };
    expect(snapDrawingPoint({ ...input, suppress: false })).toEqual({
      point: { x: 100, y: 0 },
      kind: "endpoint",
    });
    expect(snapDrawingPoint({ ...input, suppress: true }).kind).toBe("none");
  });

  it("keeps physical dimensions stable across display units", () => {
    expect(displayValueToMm(6, "m")).toBe(6000);
    expect(parseFeetAndInches("5' 6\"")).toBeCloseTo(1676.4);
    expect(formatFeetAndInches(1676.4)).toBe("5' 6\"");
  });

  it("migrates a legacy rectangle with a conversion report", () => {
    const result = convertLegacyRectScene(
      {
        type: "cad-suite-planner-scene",
        version: 1,
        room: { widthMm: 6000, depthMm: 4000 },
      },
      ids("floor", "project", "w1", "w2", "w3", "w4"),
    );
    expect(result.project.floors[0].walls).toHaveLength(4);
    expect(result.report.unsupported).toEqual([]);
  });

  it("round-trips guest state in memory only", () => {
    const repository = createPlannerGuestProjectRepository();
    const project = createPlannerProject({
      idFactory: ids("floor", "project"),
    });
    repository.save(project);
    expect(repository.load(project.id)).toEqual(project);
    expect(createPlannerGuestProjectRepository().load(project.id)).toBeNull();
  });
});
