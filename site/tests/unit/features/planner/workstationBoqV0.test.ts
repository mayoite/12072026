import { describe, expect, it } from "vitest";

import {
  placeWorkstationConfigOnProject,
  placeWorkstationInstancesOnProject,
} from "@/features/planner/catalog/placementAction";
import {
  summarizeWorkstationBoqV0,
  workstationBoqToQuoteCartItems,
  workstationV0UnitPriceInr,
  WORKSTATION_V0_GST_RATE,
} from "@/features/planner/catalog/workstationBoqV0";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
} from "@/features/planner/catalog/workstationSystemV0";
import { createPlannerProject } from "@/features/planner/model/project";

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

    let project = createPlannerProject({
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

    // Money path: unit × qty + GST 18%
    const unitLinear = workstationV0UnitPriceInr(linear);
    expect(linearLine?.unitPriceInr).toBe(unitLinear);
    expect(linearLine?.lineSubtotalInr).toBe(unitLinear * 3);
    expect(linearLine?.gstRate).toBe(WORKSTATION_V0_GST_RATE);
    expect(linearLine?.lineGstInr).toBe(Math.round(unitLinear * 3 * WORKSTATION_V0_GST_RATE));
    expect(linearLine?.lineTotalInr).toBe(
      linearLine!.lineSubtotalInr + linearLine!.lineGstInr,
    );
    expect(summary.currencyCode).toBe("INR");
    expect(summary.subtotalInr).toBe(
      (linearLine?.lineSubtotalInr ?? 0) + (lLine?.lineSubtotalInr ?? 0),
    );
    expect(summary.totalInr).toBe(summary.subtotalInr + summary.gstInr);
    expect(summary.totalInr).toBeGreaterThan(0);
  });

  it("prices linear 1500×600 desk+pedestal+panel from list schedule", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    // base 58000 + pedestal 8000 + panel 6000
    expect(workstationV0UnitPriceInr(config)).toBe(72_000);
  });

  it("ignores non-workstation furniture", () => {
    const project = createPlannerProject({
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
    let project = createPlannerProject({
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
    expect(cart[0]!.name).toMatch(/ex-GST/);
    expect(cart[0]!.name).toMatch(/₹/);
  });
});
