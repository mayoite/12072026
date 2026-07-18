import { describe, expect, it } from "vitest";
import {
  buildPlannerFurnitureBoq,
  exportPlannerFurnitureBoqToCsv,
  PLANNER_FURNITURE_BOQ_GST_RATE,
} from "@/features/planner/shared/export/projectFurnitureBoq";
import { createRectangularRoomProject } from "@/features/planner/model/project";
import { addPlannerFurniture } from "@/features/planner/model/actions/furniture";

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

  it("uses brand series display name + SKU for oando catalog furniture (B4/B11)", () => {
    let project = createRectangularRoomProject({
      name: "Brand BOQ",
      widthMm: 6000,
      depthMm: 5000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    project = addPlannerFurniture(
      project,
      {
        catalogId: "a81e3a1b-16f4-4000-8000-000000000002",
        position: { x: 1000, y: 1000 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1600,
        depth: 800,
        height: 750,
        sourceCatalogId: "a81e3a1b-16f4-4000-8000-000000000002",
        sourceSlug: "oando-fluid-desk-1600",
        sourceSku: "OANDO-FLUID-DSK-1600",
        geometryMode: "box",
      },
      ids("f-fluid"),
    );
    project = addPlannerFurniture(
      project,
      {
        catalogId: "a81e3a1b-16f4-4000-8000-000000000004",
        position: { x: 3000, y: 2000 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1800,
        depth: 900,
        height: 750,
        sourceCatalogId: "a81e3a1b-16f4-4000-8000-000000000004",
        sourceSlug: "oando-omnia-desk-1800",
        sourceSku: "OANDO-OMNIA-DSK-1800",
        geometryMode: "box",
      },
      ids("f-omnia"),
    );

    const boq = buildPlannerFurnitureBoq(project, {
      now: "2026-07-18T00:00:00.000Z",
    });

    expect(boq.totalItems).toBe(2);
    expect(boq.lines).toHaveLength(2);

    const fluid = boq.lines.find((l) => l.sku === "OANDO-FLUID-DSK-1600");
    expect(fluid).toBeDefined();
    expect(fluid?.name).toBe("Fluid Desk 1600");
    expect(fluid?.sku).toBe("OANDO-FLUID-DSK-1600");

    const omnia = boq.lines.find((l) => l.sku === "OANDO-OMNIA-DSK-1800");
    expect(omnia).toBeDefined();
    expect(omnia?.name).toBe("Omnia Desk 1800");
    expect(omnia?.sku).toBe("OANDO-OMNIA-DSK-1800");

    const csv = exportPlannerFurnitureBoqToCsv(boq);
    expect(csv).toContain("Fluid Desk 1600");
    expect(csv).toContain("OANDO-FLUID-DSK-1600");
    expect(csv).toContain("Omnia Desk 1800");
    expect(csv).toContain("OANDO-OMNIA-DSK-1800");
  });

  it("falls back to humanized SKU when only sourceSku is stamped", () => {
    let project = createRectangularRoomProject({
      name: "SKU only",
      widthMm: 5000,
      depthMm: 4000,
      idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
    });
    project = addPlannerFurniture(
      project,
      {
        catalogId: "unknown-id",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1400,
        depth: 700,
        height: 750,
        sourceSku: "OANDO-FLUID-DSK-1400",
        geometryMode: "box",
      },
      ids("f-sku"),
    );

    const boq = buildPlannerFurnitureBoq(project, {
      now: "2026-07-18T00:00:00.000Z",
    });
    expect(boq.lines[0]?.name).toBe("Fluid Desk 1400");
    expect(boq.lines[0]?.sku).toBe("OANDO-FLUID-DSK-1400");
  });
});
