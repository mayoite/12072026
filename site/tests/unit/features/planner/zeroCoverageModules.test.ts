/**
 * Covers modules that were at 0% in the benchmark-exceed coverage run.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { createRectangularRoomProject } from "@/features/planner/model/project";
import {
  getSketchRecoveryMessage,
  classifySketchConversionError,
  buildSketchPlanFabricDraft,
  SketchConversionError,
} from "@/features/planner/ai/sketchToPlan.server";
import { exportToJson, envelopeToJsonString } from "@/features/planner/shared/export/jsonExport";

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

describe("sketchToPlan (canonical root ai module)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("classifies recovery errors and builds fabric draft geometry", () => {
    expect(getSketchRecoveryMessage("missing_provider")).toContain("unavailable");
    const classified = classifySketchConversionError(new Error("timed out"), "sketch.png");
    expect(classified).toBeInstanceOf(SketchConversionError);
    expect(classified.reason).toBe("timeout");

    const draft = JSON.parse(
      buildSketchPlanFabricDraft({
        objects: [
          { type: "wall", x1: 0, y1: 0, x2: 100, y2: 0 },
          { type: "room", left: 10, top: 10, width: 80, height: 60, label: "Office" },
        ],
        warnings: [],
      }),
    );
    expect(draft.objects).toHaveLength(2);
    expect(draft.objects[0].type).toBe("line");
    expect(draft.objects[1].name).toBe("ROOM:Office");
  });
});
