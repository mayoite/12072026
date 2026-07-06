import { describe, expect, it } from "vitest";

import { createRectangularRoomProject } from "@/features/planner/open3d/model/project";
import {
  buildExportFilename,
  isSupportedExportFormat,
  preflightOpen3dExport,
  SUPPORTED_EXPORT_FORMATS,
} from "@/features/planner/open3d/shared/export/exportPreflight";
import {
  formatMeasurement,
  getFloorBounds,
} from "@/features/planner/open3d/shared/export/exportUtils";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function project() {
  const result = createRectangularRoomProject({
    idFactory: ids("floor-main", "project-main", "wall-a", "wall-b", "wall-c", "wall-d"),
    name: "Client Plan A",
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
  return { ...result, displayUnit: "m" as const };
}

describe("Phase 06 export preflight (live subset post-removal)", () => {
  it("lists supported formats and correctly identifies supported/unsupported", () => {
    expect(Array.isArray(SUPPORTED_EXPORT_FORMATS)).toBe(true);
    expect(isSupportedExportFormat("json")).toBe(true);
    expect(isSupportedExportFormat("dwg")).toBe(false);
  });

  it("preflights and builds filename for live formats", () => {
    const p = project();
    const name = buildExportFilename(p, "json");
    expect(typeof name).toBe("string");
    const pf = preflightOpen3dExport(p, "json");
    expect(pf).toBeTruthy();
  });
});

describe("Phase 06 utils (live)", () => {
  it("formatMeasurement and getFloorBounds work without heavy deps", () => {
    expect(formatMeasurement(6000, "m")).toContain("m");
    const bounds = getFloorBounds(project().floors[0]);
    expect(bounds.maxX).toBeGreaterThan(bounds.minX);
  });
});
