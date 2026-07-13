/**
 * Covers modules that were at 0% in the benchmark-exceed coverage run.
 */

import { afterEach, describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { createPlannerProject, createRectangularRoomProject } from "@/features/planner/project/model/project";
import {
  createAiPrivacyNotice,
  DEFAULT_CATALOG_IDS,
  formatDimensionWithUnit,
  summarizeProjectState,
  validateAiProposal,
} from "@/features/planner/project/ai/aiAdvisor";
import {
  cancelSketchToPlan,
  estimateProcessingTime,
  executeSketchToPlan,
  isSketchToPlanAvailable,
  SKETCH_TO_PLAN_API_ROUTE,
  validateSketchToPlanRequest,
} from "@/features/planner/project/ai/sketchToPlan";
import { exportToJson, envelopeToJsonString } from "@/features/planner/project/shared/export/jsonExport";

const PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("jsonExport module", () => {
  it("exports valid projects and rejects empty envelopes", () => {
    const project = createRectangularRoomProject({
      name: "JSON Export",
      widthMm: 3000,
      depthMm: 2000,
    });

    const result = exportToJson(project, { pretty: true });
    expect(result.success).toBe(true);
    expect(result.envelope.project.name).toBe("JSON Export");

    const json = envelopeToJsonString(result.envelope, true);
    expect(json).toContain("JSON Export");

    const empty = exportToJson({ ...project, floors: [] });
    expect(empty.success).toBe(false);
    expect(empty.error).toContain("no floors");
  });
});

describe("aiAdvisor summaries", () => {
  it("summarizes project state and validates proposals", () => {
    const project = createPlannerProject({ name: "Advisor Target" });
    const summary = summarizeProjectState(project, "wall-1", "wall");
    expect(summary.projectName).toBe("Advisor Target");
    expect(summary.totalWalls).toBe(0);
    expect(DEFAULT_CATALOG_IDS.length).toBeGreaterThan(0);

    const validation = validateAiProposal(
      {
        id: "proposal-1",
        type: "placement",
        confidence: 0.9,
        description: "Add desk",
        units: "mm",
        details: {
          catalogId: DEFAULT_CATALOG_IDS[0],
          position: { x: 100, y: 200 },
        },
      },
      summary,
    );
    expect(validation.valid).toBe(true);

    const privacy = createAiPrivacyNotice();
    expect(privacy.privacy).toContain("AI");
    expect(formatDimensionWithUnit(1500, "m")).toContain("m");
  });
});

describe("sketchToPlan command module", () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        success: true,
        project: { name: "Sketch Import" },
        floor: { id: "test" },
      }),
    } as Response);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates requests and runs the placeholder conversion pipeline", async () => {
    expect(validateSketchToPlanRequest({ imageDataUrl: "" }).length).toBeGreaterThan(0);
    expect(validateSketchToPlanRequest({ imageDataUrl: PNG_DATA_URL }).length).toBe(0);
    expect(SKETCH_TO_PLAN_API_ROUTE).toContain("sketch-to-plan");
    expect(estimateProcessingTime(PNG_DATA_URL)).toBeGreaterThan(0);
    expect(cancelSketchToPlan().status).toBe("cancelled");
    expect(await isSketchToPlanAvailable()).toBe(true);

    const progress: string[] = [];
    const result = await executeSketchToPlan(
      {
        imageDataUrl: PNG_DATA_URL,
        projectName: "Sketch Import",
        hints: { knownDimensions: { widthMm: 5000, depthMm: 4000 } },
      },
      (update) => progress.push(update.status),
    );

    expect(result.success).toBe(true);
    expect(result.project?.name).toBe("Sketch Import");
    expect(progress).toContain("completed");
  });
});
