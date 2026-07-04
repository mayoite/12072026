import { describe, expect, it } from "vitest";

import { convertLegacyRectScene } from "@/features/planner/open3d/shared/document/legacyProject";
import { snapDrawingPoint } from "@/features/planner/open3d/lib/geometry/snapping";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import {
  displayValueToMm,
  formatFeetAndInches,
  parseFeetAndInches,
} from "@/features/planner/open3d/model/units";
import { addOpen3dWall } from "@/features/planner/open3d/model/actions/walls";
import {
  exportOpen3dProjectJson,
  importOpen3dProjectJson,
} from "@/features/planner/open3d/persistence/projectJson";
import { createOpen3dGuestProjectRepository } from "@/features/planner/open3d/persistence/guestProjectRepository";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `id-${index}`;
}

describe("Phase 01B feasibility", () => {
  it("adds one immutable canonical-mm wall and round-trips JSON", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor", "project"),
      now: "2026-07-03T00:00:00.000Z",
    });
    const next = addOpen3dWall(
      project,
      { start: { x: 0, y: 0 }, end: { x: 6000, y: 0 } },
      ids("wall"),
    );
    expect(project.floors[0].walls).toEqual([]);
    expect(importOpen3dProjectJson(exportOpen3dProjectJson(next))).toEqual(next);
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
    const repository = createOpen3dGuestProjectRepository();
    const project = createOpen3dProject({
      idFactory: ids("floor", "project"),
    });
    repository.save(project);
    expect(repository.load(project.id)).toEqual(project);
    expect(createOpen3dGuestProjectRepository().load(project.id)).toBeNull();
  });
});
