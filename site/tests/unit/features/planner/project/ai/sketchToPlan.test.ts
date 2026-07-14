import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  validateSketchToPlanRequest,
  executeSketchToPlan,
  cancelSketchToPlan,
  SKETCH_TO_PLAN_API_ROUTE,
  isSketchToPlanAvailable,
  estimateProcessingTime,
} from "@/features/planner/project/ai/sketchToPlan";

const PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("sketchToPlan", () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = async () =>
      ({
        ok: true,
        json: async () => ({
          success: true,
          project: { name: "Sketch Import" },
          floor: { id: "test" },
        }),
      }) as Response;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("validates request and runs conversion pipeline", async () => {
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
