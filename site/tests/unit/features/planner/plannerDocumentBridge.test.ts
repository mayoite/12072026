import { describe, expect, it } from "vitest";
import type { PlannerDocument, PlannerJsonValue } from "@/features/planner/model/plannerDocument";
import {
  plannerDocumentToPlannerProject,
  plannerProjectToPlannerDocument,
} from "@/features/planner/shared/document/plannerDocumentBridge";
import { createRectangularRoomProject, createPlannerSceneEnvelope } from "@/features/planner/model/project";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function basePlannerDocument(): PlannerDocument {
  return {
    schemaVersion: 1,
    id: "plan-uuid-1",
    name: "Test Plan",
    title: "Test Plan Title",
    projectName: "Project Alpha",
    clientName: "Client Beta",
    preparedBy: "Designer Gamma",
    roomWidthMm: 5000,
    roomDepthMm: 4000,
    seatTarget: 12,
    unitSystem: "metric",
    sceneJson: {},
    itemCount: 0,
    thumbnailUrl: null,
    status: "draft",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-02T00:00:00Z",
  };
}

describe("plannerDocumentToPlannerProject", () => {
  it("converts a basic planner document to a rectangular room project", () => {
    const doc = basePlannerDocument();
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.project.name).toBe("Test Plan");
    expect(result.project.id).toBe("plan-uuid-1");
    expect(result.project.displayUnit).toBe("mm");
    expect(result.project.floors[0].walls).toHaveLength(4);
    expect(result.warnings).toHaveLength(0);
  });

  it("converts a sparse planner document with empty metadata", () => {
    const doc: PlannerDocument = {
      ...basePlannerDocument(),
      title: "Test Plan", // same as name so it is excluded
      projectName: null,
      clientName: null,
      preparedBy: null,
    };
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.project.description).toBeUndefined();
    expect(result.project.displayUnit).toBe("mm");
  });

  it("preserves metadata in description", () => {
    const doc = basePlannerDocument();
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.project.description).toContain("Title: Test Plan Title");
    expect(result.project.description).toContain("Project: Project Alpha");
    expect(result.project.description).toContain("Client: Client Beta");
    expect(result.project.description).toContain("Prepared by: Designer Gamma");
  });

  it("handles imperial unit system", () => {
    const doc = { ...basePlannerDocument(), unitSystem: "imperial" as const };
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.project.displayUnit).toBe("ft-in");
  });

  it("recovers an Open3D envelope stored in sceneJson", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "From Envelope",
    });
    const envelope = createPlannerSceneEnvelope(project);
    const doc: PlannerDocument = {
      ...basePlannerDocument(),
      sceneJson: envelope as unknown as PlannerJsonValue,
    };
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.project.name).toBe("From Envelope");
    expect(result.project.floors[0].walls).toHaveLength(4);
    expect(result.warnings).toHaveLength(0);
  });

  it("falls back to rectangular room on invalid envelope in sceneJson", () => {
    const doc: PlannerDocument = {
      ...basePlannerDocument(),
      sceneJson: { type: "open3d-floorplan-project", version: "not-a-number" } as unknown as PlannerJsonValue,
    };
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.project.floors[0].walls).toHaveLength(4);
  });

  it("falls back to rectangular room on legacy scene", () => {
    const doc: PlannerDocument = {
      ...basePlannerDocument(),
      sceneJson: { type: "cad-suite-planner-scene", version: 1 } as unknown as PlannerJsonValue,
    };
    const result = plannerDocumentToPlannerProject(doc);
    expect(result.warnings[0]).toContain("Legacy");
    expect(result.project.floors[0].walls).toHaveLength(4);
  });
});

describe("plannerProjectToPlannerDocument", () => {
  it("round-trips a basic project back to planner document", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "Round Trip",
    });
    const result = plannerProjectToPlannerDocument(project);
    expect(result.document.name).toBe("Round Trip");
    expect(result.document.roomWidthMm).toBe(3000);
    expect(result.document.roomDepthMm).toBe(2000);
    expect(result.document.unitSystem).toBe("metric");
  });

  it("reconstructs metadata from description", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "Meta",
    });
    const projectWithDesc = { ...project, description: "Title: Meta Title\nProject: Alpha\nClient: Beta\nPrepared by: Gamma" };
    const result = plannerProjectToPlannerDocument(projectWithDesc);
    expect(result.document.title).toBe("Meta Title");
    expect(result.document.projectName).toBe("Alpha");
    expect(result.document.clientName).toBe("Beta");
    expect(result.document.preparedBy).toBe("Gamma");
  });

  it("ignores unrecognized description lines", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "Meta",
    });
    const projectWithDesc = { ...project, description: "Title: Meta Title\nRandom line\nClient: Beta" };
    const result = plannerProjectToPlannerDocument(projectWithDesc);
    expect(result.document.title).toBe("Meta Title");
    expect(result.document.clientName).toBe("Beta");
    expect(result.document.projectName).toBeNull();
  });

  it("handles imperial display unit", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "Imperial",
    });
    const imperialProject = { ...project, displayUnit: "ft-in" as const };
    const result = plannerProjectToPlannerDocument(imperialProject);
    expect(result.document.unitSystem).toBe("imperial");
  });

  it("warns when no rectangular room is found", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "No Room",
    });
    const emptyProject = { ...project, floors: [{ ...project.floors[0], walls: [] }] };
    const result = plannerProjectToPlannerDocument(emptyProject);
    expect(result.warnings[0]).toContain("default dimensions");
  });

  it("preserves envelope in sceneJson when provided", () => {
    const project = createRectangularRoomProject({
      idFactory: ids("floor", "proj", "w1", "w2", "w3", "w4"),
      widthMm: 3000,
      depthMm: 2000,
      name: "With Envelope",
    });
    const envelope = createPlannerSceneEnvelope(project);
    const result = plannerProjectToPlannerDocument(project, envelope);
    expect(result.document.sceneJson).toBeDefined();
    const parsed = result.document.sceneJson as Record<string, unknown>;
    expect(parsed.type).toBe("open3d-floorplan-project");
  });
});

describe("round-trip", () => {
  it("preserves identity through planner â†’ open3d â†’ planner", () => {
    const doc = basePlannerDocument();
    const toOpen3d = plannerDocumentToPlannerProject(doc);
    const back = plannerProjectToPlannerDocument(toOpen3d.project, toOpen3d.envelope);
    expect(back.document.name).toBe(doc.name);
    expect(back.document.id).toBe(doc.id);
    expect(back.document.projectName).toBe(doc.projectName);
    expect(back.document.clientName).toBe(doc.clientName);
    expect(back.document.preparedBy).toBe(doc.preparedBy);
    expect(back.document.unitSystem).toBe(doc.unitSystem);
  });
});
