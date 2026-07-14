import { describe, expect, it } from "vitest";
import {
  READY_EXPORT_FORMATS,
  SUPPORTED_EXPORT_FORMATS,
  isSupportedExportFormat,
  isKnownExportFormat,
  buildExportFilename,
  preflightPlannerExport,
} from "@/features/planner/project/shared/export/exportPreflight";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

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
});
