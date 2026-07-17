import { describe, expect, it } from "vitest";
import {
  createPlannerDocument,
  createEmptyPlannerDocument,
  describeUnsupportedPlannerSchemaVersion,
  isPlannerDocument,
  toPlannerJsonSafe,
  validatePlannerDocumentSafe,
  PLANNER_DOCUMENT_SCHEMA_VERSION,
  type CadSuitePlannerSceneEnvelope,
  type Open3dPlannerSceneEnvelope,
} from "@/features/planner/model";

describe("model barrel", () => {
  it("creates and validates planner documents", () => {
    expect(PLANNER_DOCUMENT_SCHEMA_VERSION).toBeGreaterThan(0);
    const empty = createEmptyPlannerDocument();
    expect(isPlannerDocument(empty)).toBe(true);
    const doc = createPlannerDocument({ name: "Barrel" });
    expect(doc.name).toBe("Barrel");
    const safe = validatePlannerDocumentSafe(doc);
    expect(safe.success).toBe(true);
    expect(toPlannerJsonSafe({ a: 1, b: undefined })).toEqual({ a: 1 });
  });

  it("exports dual envelope aliases and unsupported-version helper", () => {
    expect(describeUnsupportedPlannerSchemaVersion({ schemaVersion: 99 })).toMatch(
      /unsupported schema version 99/i,
    );
    expect(describeUnsupportedPlannerSchemaVersion({ schemaVersion: 1 })).toBeNull();

    // Compile-time dual-envelope contract (aliases must stay distinct by type field).
    const open3d: Open3dPlannerSceneEnvelope = {
      type: "open3d-floorplan-project",
      version: 1,
      units: "mm",
      displayUnit: "mm",
      source: "native-open3d",
      project: {
        id: "p1",
        name: "P",
        floors: [],
        activeFloorId: "f1",
        displayUnit: "mm",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    };
    const cad: CadSuitePlannerSceneEnvelope = {
      type: "cad-suite-planner-scene",
      version: 1,
      measurement: { canonicalUnit: "mm", displayUnit: "mm" },
      room: {
        widthMm: 6000,
        depthMm: 8000,
        wallHeightMm: 2700,
        wallThicknessMm: 150,
        floorThicknessMm: 100,
        originMm: { xMm: 0, yMm: 0 },
      },
      items: [],
    };
    expect(open3d.type).toBe("open3d-floorplan-project");
    expect(cad.type).toBe("cad-suite-planner-scene");
  });
});
