import { describe, expect, it } from "vitest";

import { placeWorkstationInstancesOnProject } from "@/features/planner/project/catalog/placementAction";
import {
  createWorkstationConfigV0,
} from "@/features/planner/project/catalog/workstationSystemV0";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type { PlannerFurnitureItem, PlannerProject } from "@/features/planner/project/model/types";
import {
  buildPlannerBoqFilename,
  buildPlannerFurnitureBoq,
  exportPlannerFurnitureBoqToCsv,
  exportPlannerFurnitureBoqToJson,
  PLANNER_FURNITURE_BOQ_KIND,
  PLANNER_FURNITURE_BOQ_PRICING_NOTE,
} from "@/features/planner/project/shared/export/projectFurnitureBoq";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function withFurniture(project: PlannerProject, items: PlannerFurnitureItem[]): PlannerProject {
  return {
    ...project,
    floors: project.floors.map((floor, i) =>
      i === 0 ? { ...floor, furniture: [...floor.furniture, ...items] } : floor,
    ),
  };
}

describe("buildPlannerFurnitureBoq (pure first-class BOQ)", () => {
  it("returns empty summary for a project with no furniture", () => {
    const project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Empty Plan",
      now: "2026-07-09T12:00:00.000Z",
    });

    const summary = buildPlannerFurnitureBoq(project, {
      now: "2026-07-09T12:00:00.000Z",
    });

    expect(summary.kind).toBe(PLANNER_FURNITURE_BOQ_KIND);
    expect(summary.totalItems).toBe(0);
    expect(summary.totalLines).toBe(0);
    expect(summary.lines).toEqual([]);
    expect(summary.subtotalInr).toBe(0);
    expect(summary.totalInr).toBe(0);
  });

  it("aggregates mixed furniture + priced workstations into JSON and CSV", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "panel"],
    });

    let project = createPlannerProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Client BOQ Plan",
      now: "2026-07-09T12:00:00.000Z",
    });

    project = placeWorkstationInstancesOnProject(project, config, 3, {
      columns: 3,
      idFactory: ids("w0", "w1", "w2"),
    }).project;

    const tableTemplate: Omit<PlannerFurnitureItem, "id" | "position"> = {
      catalogId: "side-table-001",
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 600,
      depth: 600,
      height: 450,
      sourceCatalogId: "side-table-001",
      sourceSlug: "side-table-001",
      sourceSku: "ST-001",
      geometryMode: "box",
    };

    project = withFurniture(project, [
      {
        ...tableTemplate,
        id: "t0",
        position: { x: 1000, y: 1000 },
      },
      {
        ...tableTemplate,
        id: "t1",
        position: { x: 2000, y: 1000 },
      },
    ]);

    const summary = buildPlannerFurnitureBoq(project, {
      now: "2026-07-09T15:00:00.000Z",
    });

    expect(summary.kind).toBe(PLANNER_FURNITURE_BOQ_KIND);
    expect(summary.projectName).toBe("Client BOQ Plan");
    expect(summary.generatedAt).toBe("2026-07-09T15:00:00.000Z");
    expect(summary.totalItems).toBe(5);
    expect(summary.totalLines).toBe(2);
    expect(summary.pricedItemCount).toBe(3);
    expect(summary.unpricedItemCount).toBe(2);

    const wsLine = summary.lines.find((l) => l.category === "workstation");
    const tableLine = summary.lines.find((l) => l.catalogId === "side-table-001");

    expect(wsLine).toBeDefined();
    expect(wsLine!.quantity).toBe(3);
    expect(wsLine!.widthMm).toBe(1500);
    expect(wsLine!.depthMm).toBe(600);
    expect(wsLine!.priced).toBe(true);
    expect(wsLine!.priceSource).toBe("demo-list");
    expect(wsLine!.sourceObjectIds).toEqual(["w0", "w1", "w2"]);
    expect(wsLine!.unitPriceInr).toBeGreaterThan(0);
    expect(wsLine!.lineTotalInr).toBeGreaterThan(wsLine!.lineSubtotalInr);

    expect(tableLine).toBeDefined();
    expect(tableLine!.quantity).toBe(2);
    expect(tableLine!.widthMm).toBe(600);
    expect(tableLine!.depthMm).toBe(600);
    expect(tableLine!.heightMm).toBe(450);
    expect(tableLine!.sku).toBe("ST-001");
    expect(tableLine!.priced).toBe(false);
    expect(tableLine!.priceSource).toBe("none");
    expect(tableLine!.sourceObjectIds).toEqual(["t0", "t1"]);
    expect(tableLine!.unitPriceInr).toBe(0);
    expect(tableLine!.lineGstInr).toBe(0);

    // Demo prices labeled at summary level — never presented as live ERP.
    expect(summary.pricingMode).toBe("demo-list-partial");
    expect(summary.pricingNote).toBe(PLANNER_FURNITURE_BOQ_PRICING_NOTE);
    expect(summary.pricingNote.toLowerCase()).toContain("demo");
    expect(summary.pricingNote.toLowerCase()).toContain("not live");
    expect(summary.calculationHash).toMatch(/^[a-f0-9]{64}$/);

    const repeated = buildPlannerFurnitureBoq(project, {
      now: "2026-07-10T08:00:00.000Z",
    });
    expect(repeated.generatedAt).not.toBe(summary.generatedAt);
    expect(repeated.calculationHash).toBe(summary.calculationHash);

    const json = exportPlannerFurnitureBoqToJson(summary);
    const parsed = JSON.parse(json) as typeof summary;
    expect(parsed.kind).toBe(PLANNER_FURNITURE_BOQ_KIND);
    expect(parsed.pricingMode).toBe("demo-list-partial");
    expect(parsed.pricingNote).toContain("demo list");
    expect(parsed.lines).toHaveLength(2);
    expect(parsed.totalItems).toBe(5);
    expect(parsed.lines.find((l) => l.priced)?.priceSource).toBe("demo-list");

    const csv = exportPlannerFurnitureBoqToCsv(summary);
    expect(csv).toContain("Project,Client BOQ Plan");
    expect(csv).toContain("Pricing mode,demo-list-partial");
    expect(csv).toContain("Pricing note,");
    expect(csv).toContain("demo list");
    expect(csv).toContain("Category,Item,Catalog ID,SKU,Qty");
    expect(csv).toContain("Price source");
    expect(csv).toContain("demo-list");
    expect(csv).toContain("workstation");
    expect(csv).toContain("side-table-001");
    expect(csv).toContain("ST-001");
    expect(csv).toContain("Total items,5");
    expect(csv).toContain("Unpriced items,2");
    expect(csv).toContain(`Calculation hash,${summary.calculationHash}`);
    expect(csv).toContain("Source object IDs");

    expect(buildPlannerBoqFilename(project, "json")).toBe(
      "client-boq-plan-furniture-boq-v1.json",
    );
    expect(buildPlannerBoqFilename(project, "csv")).toBe(
      "client-boq-plan-furniture-boq-v1.csv",
    );
  });
});
