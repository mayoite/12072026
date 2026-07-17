import { describe, expect, it } from "vitest";
import {
  READY_EXPORT_FORMATS,
  SUPPORTED_EXPORT_FORMATS,
  isSupportedExportFormat,
  isKnownExportFormat,
  buildExportFilename,
  preflightPlannerExport,
} from "@/features/planner/shared/export/exportPreflight";
import { createRectangularRoomProject } from "@/features/planner/model/project";

describe("exportPreflight", () => {
  it("lists ready formats and rejects unknown", () => {
    expect(READY_EXPORT_FORMATS).toEqual(expect.arrayContaining(["json", "svg", "png", "pdf", "dxf"]));
    expect(SUPPORTED_EXPORT_FORMATS).toEqual(READY_EXPORT_FORMATS);
    expect(isSupportedExportFormat("json")).toBe(true);
    expect(isSupportedExportFormat("dwg")).toBe(false);
    expect(isKnownExportFormat("svg")).toBe(true);
  });

  it("builds filename and preflights ready projects", () => {
    const project = createRectangularRoomProject({
      name: "My Plan!",
      widthMm: 3000,
      depthMm: 2000,
    });
    const name = buildExportFilename(project, "json");
    expect(name).toMatch(/\.json$/);
    expect(name.toLowerCase()).toContain("my");
    const ok = preflightPlannerExport(project, "json");
    expect(ok.status).toBe("ready");
    expect(ok.filename).toBe(name);
    const bad = preflightPlannerExport(project, "dwg");
    expect(bad.status).toBe("unsupported");
    expect(bad.messages.join(" ")).toMatch(/DWG|unsupported/i);
  });

  it("blocks empty floors for geometry exports and rejects GLB", () => {
    const empty = createRectangularRoomProject({
      name: "Empty",
      widthMm: 3000,
      depthMm: 2000,
    });
    // Rectangular room has walls — clear them for the empty case.
    const floor = empty.floors[0];
    if (floor) {
      floor.walls = [];
      floor.furniture = [];
      floor.rooms = [];
    }
    const blocked = preflightPlannerExport(empty, "svg");
    expect(blocked.status).toBe("blocked");
    expect(blocked.messages.join(" ")).toMatch(/no exportable geometry/i);

    const glb = preflightPlannerExport(empty, "glb");
    expect(glb.status).toBe("unsupported");
    expect(glb.messages.join(" ")).toMatch(/GLB/i);
  });
});
