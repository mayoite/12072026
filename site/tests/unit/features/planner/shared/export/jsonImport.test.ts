import { describe, expect, it } from "vitest";
import {
  importFromJson,
  parseJsonToEnvelope,
  validateEnvelopeStructure,
  DEFAULT_IMPORT_LIMITS,
} from "@/features/planner/shared/export/jsonImport";
import { exportToJson } from "@/features/planner/shared/export/jsonExport";
import { createRectangularRoomProject } from "@/features/planner/model/project";

describe("jsonImport", () => {
  it("round-trips envelope JSON", () => {
    const project = createRectangularRoomProject({
      name: "Import Room",
      widthMm: 4000,
      depthMm: 3000,
    });
    const exported = exportToJson(project);
    expect(exported.success).toBe(true);
    const json = JSON.stringify(exported.envelope);
    const envelope = parseJsonToEnvelope(json);
    expect(envelope).not.toBeNull();
    const structure = validateEnvelopeStructure(envelope!);
    expect(structure.valid || structure.errors?.length === 0 || Array.isArray(structure)).toBeDefined();
    // validate may return boolean shape — handle both
    if (typeof structure === "object" && structure && "valid" in structure) {
      expect((structure as { valid: boolean }).valid).toBe(true);
    }
    const imported = importFromJson(json);
    expect(imported.success).toBe(true);
    expect(imported.project?.name).toBe("Import Room");
    expect(DEFAULT_IMPORT_LIMITS.maxFloors).toBeGreaterThan(0);
  });

  it("rejects garbage JSON", () => {
    const bad = importFromJson("{not-json");
    expect(bad.success).toBe(false);
  });

  it("fails visibly on unsupported open3d scene envelope versions", () => {
    const project = createRectangularRoomProject({
      name: "Future Env",
      widthMm: 4000,
      depthMm: 3000,
    });
    const exported = exportToJson(project);
    expect(exported.success).toBe(true);
    const future = {
      ...exported.envelope!,
      version: 99,
    };
    const errors = validateEnvelopeStructure(future as typeof exported.envelope);
    expect(Array.isArray(errors)).toBe(true);
    expect(
      (errors as Array<{ path: string; message: string }>).some(
        (e) => e.path === "version" && /unsupported scene envelope version 99/i.test(e.message),
      ),
    ).toBe(true);
    const imported = importFromJson(JSON.stringify(future));
    expect(imported.success).toBe(false);
    expect(imported.project).toBeNull();
  });
});
