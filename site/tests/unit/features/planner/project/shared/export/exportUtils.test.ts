import { describe, expect, it } from "vitest";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";
import * as mod from "@/features/planner/project/shared/export/exportUtils";
import {
  clampRasterPixelDimensions,
  getFinitePlanDimensions,
  MAX_EXPORT_CANVAS_EDGE_PX,
} from "@/features/planner/project/shared/export/exportUtils";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function sampleProject() {
  const result = createRectangularRoomProject({
    idFactory: ids("floor-main", "project-main", "wall-a", "wall-b", "wall-c", "wall-d"),
    name: "Client Plan A",
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
  return { ...result, displayUnit: "m" as const };
}

describe("exportUtils public API", () => {
  it("exposes expected export symbols", () => {
    const expected = [
      "DEFAULT_PDF_SETTINGS",
      "formatMeasurement",
      "getWallLengthMm",
      "getFloorBounds",
      "exportAsJSON",
      "downloadJSON",
      "exportAsSVG",
      "exportAsPNG",
      "exportAsPDF",
      "getFinitePlanDimensions",
      "clampRasterPixelDimensions",
      "MAX_EXPORT_CANVAS_EDGE_PX",
    ] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});

describe("exportUtils raster guards", () => {
  it("returns finite plan dimensions for rectangular rooms", () => {
    const floor = sampleProject().floors[0];
    const dims = getFinitePlanDimensions(floor, 2000);
    expect(dims).not.toBeNull();
    if (!dims) throw new Error("expected dimensions");
    expect(dims.planW).toBeGreaterThan(0);
    expect(dims.planH).toBeGreaterThan(0);
  });

  it("clamps oversized raster dimensions to the export edge limit", () => {
    const clamped = clampRasterPixelDimensions(20_000, 10_000);
    expect(clamped.widthPx).toBeLessThanOrEqual(MAX_EXPORT_CANVAS_EDGE_PX);
    expect(clamped.heightPx).toBeLessThanOrEqual(MAX_EXPORT_CANVAS_EDGE_PX);
    expect(clamped.shrink).toBeLessThan(1);
  });

  it("keeps small raster dimensions unchanged", () => {
    const clamped = clampRasterPixelDimensions(800, 600);
    expect(clamped).toEqual({ widthPx: 800, heightPx: 600, shrink: 1 });
  });
});
