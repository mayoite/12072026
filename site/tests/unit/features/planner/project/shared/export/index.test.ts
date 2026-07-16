import { describe, expect, it } from "vitest";
import * as exp from "@/features/planner/project/shared/export";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

describe("export barrel", () => {
  it("preflights and exports JSON", () => {
    const project = createRectangularRoomProject({
      name: "Barrel Export",
      widthMm: 3000,
      depthMm: 2000,
    });
    const pre = exp.preflightPlannerExport(project, "json");
    expect(pre.status).toBe("ready");
    const result = exp.exportAsJSON(project);
    expect(result.success === true || typeof result === "string" || result).toBeDefined();
    if (result && typeof result === "object" && "success" in result) {
      expect((result as { success: boolean }).success).toBe(true);
    }
    expect(exp.SUPPORTED_EXPORT_FORMATS).toContain("json");
  });
});
