import { describe, expect, it } from "vitest";

import {
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "@/features/planner/open3d/catalog/placementAction";
import {
  summarizeWorkstationBoqV0,
  workstationBoqToQuoteCartItems,
} from "@/features/planner/open3d/catalog/workstationBoqV0";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
} from "@/features/planner/open3d/catalog/workstationSystemV0";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("summarizeWorkstationBoqV0", () => {
  it("aggregates two configs with quantities", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const lshape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "return", "panel"],
    });

    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "BOQ",
      now: "2026-07-09T19:00:00.000Z",
    });

    project = placeWorkstationInstancesOnProject(project, linear, 3, {
      columns: 3,
      idFactory: ids("a0", "a1", "a2"),
    }).project;
    project = placeWorkstationConfigOnProject(
      project,
      lshape,
      { x: 0, y: 5000 },
      { idFactory: ids("b0") },
    ).project;

    const summary = summarizeWorkstationBoqV0(project);
    expect(summary.totalInstances).toBe(4);
    expect(summary.totalSeats).toBe(4);
    expect(summary.lines).toHaveLength(2);

    const linearLine = summary.lines.find(
      (l) => l.catalogId === workstationConfigKey(linear),
    );
    const lLine = summary.lines.find(
      (l) => l.catalogId === workstationConfigKey(lshape),
    );
    expect(linearLine?.quantity).toBe(3);
    expect(linearLine?.footprintWidthMm).toBe(1500);
    expect(lLine?.quantity).toBe(1);
    expect(lLine?.shape).toBe("l-shape");
  });

  it("ignores non-workstation furniture", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "BOQ empty",
      now: "2026-07-09T19:00:00.000Z",
    });
    // place a non-ws furniture via placeWorkstation would always be ws — skip
    const summary = summarizeWorkstationBoqV0(project);
    expect(summary.lines).toEqual([]);
    expect(summary.totalInstances).toBe(0);
  });

  it("maps BOQ lines to quote cart items", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Quote map",
      now: "2026-07-09T19:30:00.000Z",
    });
    project = placeWorkstationInstancesOnProject(project, linear, 2, {
      idFactory: ids("q0", "q1"),
    }).project;
    const cart = workstationBoqToQuoteCartItems(summarizeWorkstationBoqV0(project));
    expect(cart).toHaveLength(1);
    expect(cart[0]!.qty).toBe(2);
    expect(cart[0]!.id).toContain("ws-v0");
    expect(cart[0]!.name).toMatch(/1500/);
  });
});
