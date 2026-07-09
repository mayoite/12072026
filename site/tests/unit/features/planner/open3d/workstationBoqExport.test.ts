import { describe, expect, it } from "vitest";

import { placeWorkstationInstancesOnProject } from "@/features/planner/open3d/catalog/placementAction";
import { summarizeWorkstationBoqV0 } from "@/features/planner/open3d/catalog/workstationBoqV0";
import {
  createWorkstationConfigV0,
} from "@/features/planner/open3d/catalog/workstationSystemV0";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("workstation BOQ export payload", () => {
  it("serializes a stable JSON payload with seats and lines", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "panel"],
    });
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Export BOQ",
      now: "2026-07-09T20:00:00.000Z",
    });
    project = placeWorkstationInstancesOnProject(project, config, 5, {
      columns: 5,
      idFactory: ids("w0", "w1", "w2", "w3", "w4"),
    }).project;

    const summary = summarizeWorkstationBoqV0(project);
    const payload = {
      kind: "workstation-boq-v0" as const,
      exportedAt: "2026-07-09T20:00:00.000Z",
      ...summary,
    };
    const json = JSON.stringify(payload);
    const parsed = JSON.parse(json) as typeof payload;
    expect(parsed.kind).toBe("workstation-boq-v0");
    expect(parsed.totalSeats).toBe(5);
    expect(parsed.totalInstances).toBe(5);
    expect(parsed.lines).toHaveLength(1);
    expect(parsed.lines[0]!.quantity).toBe(5);
    expect(parsed.lines[0]!.footprintWidthMm).toBe(1500);
  });
});
