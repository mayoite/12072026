import { describe, expect, it } from "vitest";
import { createOpen3dProject, createRectangularRoomProject, createOpen3dSceneEnvelope } from "@/features/planner/open3d/model/project";
import { exportToJson, envelopeToJsonString } from "@/features/planner/open3d/shared/export/jsonExport";
import {
  importFromJson,
  parseJsonToEnvelope,
  validateEnvelopeStructure,
  DEFAULT_IMPORT_LIMITS,
  recoverFromErrors,
} from "@/features/planner/open3d/shared/export/jsonImport";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function room(): ReturnType<typeof createRectangularRoomProject> {
  return createRectangularRoomProject({
    idFactory: ids("floor", "project", "wall-1", "wall-2", "wall-3", "wall-4"),
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
}

describe("jsonExport", () => {
  it("exports a valid project to JSON envelope", () => {
    const p = room();
    const result = exportToJson(p);
    expect(result.success).toBe(true);
    expect(result.envelope.type).toBe("open3d-floorplan-project");
    expect(result.envelope.version).toBe(1);
    expect(result.envelope.units).toBe("mm");
    expect(result.envelope.project).toBeDefined();
    expect(result.envelope.project.id).toBe("project");
  });

  it("exports pretty-printed JSON when requested", () => {
    const p = room();
    const result = exportToJson(p, { pretty: true });
    const jsonStr = envelopeToJsonString(result.envelope, true);
    expect(jsonStr).toContain("\n");
    expect(jsonStr).toContain("  ");
  });

  it("exports compact JSON by default", () => {
    const p = room();
    const result = exportToJson(p);
    const jsonStr = envelopeToJsonString(result.envelope, false);
    expect(jsonStr).not.toContain("\n");
    expect(jsonStr).not.toContain("  ");
  });

  it("filters to single floor when floorId is provided", () => {
    const p = room();
    const floorId = p.floors[0].id;
    const result = exportToJson(p, { floorId });
    expect(result.success).toBe(true);
    expect(result.envelope.project.floors).toHaveLength(1);
    expect(result.envelope.project.floors[0].id).toBe(floorId);
  });

  it("fails for empty project", () => {
    const empty = createOpen3dProject({ idFactory: ids("p") });
    empty.floors = [];
    const result = exportToJson(empty);
    expect(result.success).toBe(false);
    expect(result.error).toContain("no floors");
  });

  it("fails for project without id or name", () => {
    const p = room();
    const invalid = { ...p, id: undefined, name: undefined };
    const result = exportToJson(invalid as never);
    expect(result.success).toBe(false);
    expect(result.error).toContain("id and name");
  });

  it("fails when floorId does not exist", () => {
    const p = room();
    const result = exportToJson(p, { floorId: "nonexistent" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });

  it("round-trips through JSON correctly", () => {
    const p = room();
    const exportResult = exportToJson(p);
    expect(exportResult.success).toBe(true);
    const jsonStr = envelopeToJsonString(exportResult.envelope, true);
    const importResult = importFromJson(jsonStr);
    expect(importResult.success).toBe(true);
    expect(importResult.project).not.toBeNull();
    expect(importResult.project!.id).toBe(p.id);
    expect(importResult.project!.name).toBe(p.name);
    expect(importResult.project!.floors).toHaveLength(p.floors.length);
  });
});

describe("jsonImport", () => {
  it("parses valid JSON string", () => {
    const p = room();
    const envelope = createOpen3dSceneEnvelope(p);
    const jsonStr = JSON.stringify(envelope);
    const { envelope: parsed, parseError } = parseJsonToEnvelope(jsonStr);
    expect(parseError).toBeNull();
    expect(parsed).toBeDefined();
    expect(parsed!.type).toBe("open3d-floorplan-project");
  });

  it("rejects empty input", () => {
    const { envelope, parseError } = parseJsonToEnvelope("");
    expect(envelope).toBeNull();
    expect(parseError).toContain("non-empty");
  });

  it("rejects invalid JSON", () => {
    const { envelope, parseError } = parseJsonToEnvelope("not valid json {{{");
    expect(envelope).toBeNull();
    expect(parseError).toBeDefined();
  });

  it("rejects JSON exceeding size limit", () => {
    const largeJson = '{"data":"' + "x".repeat(DEFAULT_IMPORT_LIMITS.maxJsonSize + 1) + '"}';
    const { envelope, parseError } = parseJsonToEnvelope(largeJson);
    expect(envelope).toBeNull();
    expect(parseError).toContain("exceeds maximum size");
  });

  it("validates envelope structure", () => {
    const p = room();
    const envelope = createOpen3dSceneEnvelope(p);
    const errors = validateEnvelopeStructure(envelope);
    expect(errors.filter((e) => e.severity === "error")).toHaveLength(0);
  });

  it("rejects missing type", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    const envelopeCopy = { ...envelope, type: undefined };
    const errors = validateEnvelopeStructure(envelopeCopy as never);
    expect(errors.some((e) => e.path === "type")).toBe(true);
  });

  it("rejects wrong type", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    const envelopeAny = envelope as unknown as { type: string };
    envelopeAny.type = "something-else";
    const errors = validateEnvelopeStructure(envelopeAny as never);
    expect(errors.some((e) => e.path === "type" && e.message.includes("Unknown"))).toBe(true);
  });

  it("rejects invalid version", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    const envelopeAny = envelope as unknown as { version: number };
    envelopeAny.version = -1;
    const errors = validateEnvelopeStructure(envelopeAny as never);
    expect(errors.some((e) => e.path === "version")).toBe(true);
  });

  it("rejects unsupported units", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    const envelopeAny = envelope as unknown as { units: string };
    envelopeAny.units = "inches";
    const errors = validateEnvelopeStructure(envelopeAny as never);
    expect(errors.some((e) => e.path === "units")).toBe(true);
  });

  it("warns on invalid displayUnit", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    envelope.displayUnit = "invalid" as never;
    const errors = validateEnvelopeStructure(envelope);
    expect(errors.some((e) => e.path === "displayUnit" && e.severity === "warning")).toBe(true);
  });

  it("rejects too many floors", () => {
    const p = room();
    const envelope = createOpen3dSceneEnvelope(p);
    // Add more floors than allowed
    const extraFloors = Array(DEFAULT_IMPORT_LIMITS.maxFloors + 1)
      .fill(null)
      .map((_, i) => ({ ...p.floors[0], id: `floor-${i}` }));
    envelope.project.floors = extraFloors as never;
    const errors = validateEnvelopeStructure(envelope);
    expect(errors.some((e) => e.path === "floors" && e.message.includes("Too many"))).toBe(true);
  });

  it("imports valid JSON successfully", () => {
    const p = room();
    const envelope = createOpen3dSceneEnvelope(p);
    const jsonStr = JSON.stringify(envelope);
    const result = importFromJson(jsonStr);
    expect(result.success).toBe(true);
    expect(result.project).not.toBeNull();
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors for invalid JSON", () => {
    const result = importFromJson("not valid");
    expect(result.success).toBe(false);
    expect(result.project).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("round-trips correctly", () => {
    const p = room();
    const envelope = createOpen3dSceneEnvelope(p);
    const jsonStr = JSON.stringify(envelope, null, 2);
    const result = importFromJson(jsonStr);
    expect(result.success).toBe(true);
    expect(result.project).not.toBeNull();
    expect(result.project!.id).toBe(p.id);
    expect(result.project!.name).toBe(p.name);
    expect(result.project!.floors.length).toBe(p.floors.length);
  });
});

describe("recoverFromErrors", () => {
  it("sets default displayUnit when missing", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    envelope.displayUnit = undefined as never;
    const { envelope: recovered, recovered: messages } = recoverFromErrors(envelope);
    expect(recovered.displayUnit).toBe("mm");
    expect(messages).toContain("Set default displayUnit to mm");
  });

  it("assigns IDs to floors without IDs", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    envelope.project.floors[0].id = "";
    const { envelope: recovered, recovered: messages } = recoverFromErrors(envelope);
    expect(recovered.project.floors[0].id).toBe("floor-recovered-0");
    expect(messages.some((m) => m.includes("Assigned ID"))).toBe(true);
  });

  it("leaves valid envelope unchanged", () => {
    const envelope = createOpen3dSceneEnvelope(room());
    const { envelope: recovered, recovered: messages } = recoverFromErrors(envelope);
    expect(recovered).toEqual(envelope);
    expect(messages).toHaveLength(0);
  });
});