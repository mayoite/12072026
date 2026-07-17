import { describe, expect, it } from "vitest";
import { exportToJson, envelopeToJsonString } from "@/features/planner/shared/export/jsonExport";
import { createRectangularRoomProject } from "@/features/planner/model/project";

describe("jsonExport", () => {
  it("exports valid projects and rejects empty floors", () => {
    const project = createRectangularRoomProject({
      name: "JSON Export",
      widthMm: 3000,
      depthMm: 2000,
    });
    const result = exportToJson(project, { pretty: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.envelope.project.name).toBe("JSON Export");
      const json = envelopeToJsonString(result.envelope, true);
      expect(json).toContain("JSON Export");
    }
    const empty = exportToJson({ ...project, floors: [] });
    expect(empty.success).toBe(false);
    expect(empty.error).toMatch(/floor/i);
  });
});
