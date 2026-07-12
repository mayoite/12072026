import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  validateLayout,
  applySuggestion as applyClientSuggestion,
  resolveAdvisorProviderChain,
  DEFAULT_ADVISOR_CONFIG,
  requestAdvisorChat,
  requestSpaceSuggest,
} from "@/features/planner/project/ai/advisorClient";
import {
  applySuggestion,
  applyLayoutToProject,
  previewSuggestionActions,
} from "@/features/planner/project/ai/advisorActions";
import {
  getAdvisorErrorMessage,
  ADVISOR_ERROR_CODES,
} from "@/features/planner/project/ai/advisorTypes";
import {
  convertSketchToPlan,
  convertSketchToPlanWithProgress,
  acceptConversion,
  rejectConversion,
  getDefaultSketchPrompt,
  estimateConversionTimeout,
  getSketchRecoveryMessage,
} from "@/features/planner/project/ai/sketchToPlanClient";
import { createPlannerProject } from "@/features/planner/project/model/project";
import type { SpaceSuggestLayout } from "@/features/planner/project/ai/advisorTypes";

const VALID_LAYOUT: SpaceSuggestLayout = {
  version: 1,
  source: "grid-pack",
  summary: "Open office",
  room: { label: "Office", x: 0, y: 0, widthMm: 6000, depthMm: 4000 },
  walls: [
    { type: "planner-wall", x: 0, y: 0, endX: 6000, endY: 0, lengthMm: 6000 },
  ],
  zones: [],
  furniture: [
    { catalogItemId: "desk-standard", label: "Desk", x: 1000, y: 1000 },
    { catalogItemId: "chair-standard", label: "Chair", x: 1200, y: 1200 },
  ],
};

describe("advisor types and client validation", () => {
  it("maps advisor error codes to user-facing messages", () => {
    expect(getAdvisorErrorMessage(ADVISOR_ERROR_CODES.RATE_LIMITED)).toContain("Too many requests");
    expect(getAdvisorErrorMessage("UNKNOWN", "Fallback")).toBe("Fallback");
  });

  it("validates layout structure and seating warnings", () => {
    const valid = validateLayout(VALID_LAYOUT);
    expect(valid.valid).toBe(true);
    expect(valid.warnings).toHaveLength(0);

    const invalid = validateLayout({
      ...VALID_LAYOUT,
      version: 2 as 1,
      source: "manual" as "grid-pack",
      room: { ...VALID_LAYOUT.room, widthMm: 0 },
      furniture: [],
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
    expect(invalid.warnings.some((w) => w.includes("seating"))).toBe(true);
  });

  it("exposes advisor provider configuration", () => {
    expect(resolveAdvisorProviderChain()).toEqual(DEFAULT_ADVISOR_CONFIG.providerOrder);
  });
});

describe("advisor actions", () => {
  it("previews and applies layout suggestions to a project", () => {
    const project = createPlannerProject({ name: "Advisor Target" });
    const preview = previewSuggestionActions({
      type: "suggestion",
      description: "Add layout",
      actionLabel: "Apply",
      layout: VALID_LAYOUT,
    });
    expect(preview.length).toBeGreaterThan(0);

    const applied = applyLayoutToProject(project, VALID_LAYOUT);
    expect(applied.actions.length).toBeGreaterThan(0);
    expect(applied.project.floors[0].walls.length).toBeGreaterThan(0);
  });

  it("applies suggestions through the action layer", async () => {
    const project = createPlannerProject({ name: "Suggestion Project" });

    const layoutResult = await applySuggestion(
      {
        type: "suggestion",
        description: "Layout",
        actionLabel: "Apply",
        layout: VALID_LAYOUT,
      },
      project,
    );
    expect(layoutResult.success).toBe(true);
    expect(layoutResult.applied).toBe(true);

    const missingProject = await applySuggestion({
      type: "placement",
      description: "Place desk",
      actionLabel: "Place",
    });
    expect(missingProject.success).toBe(false);

    const placement = await applySuggestion(
      {
        type: "placement",
        description: "Place desk",
        actionLabel: "Place",
      },
      project,
    );
    expect(placement.success).toBe(true);
  });

  it("rejects invalid client-side suggestion payloads", async () => {
    const empty = await applyClientSuggestion(null as unknown as Parameters<typeof applyClientSuggestion>[0]);
    expect(empty.success).toBe(false);

    const invalid = await applyClientSuggestion({
      type: "placement",
      description: "",
      actionLabel: "Apply",
    });
    expect(invalid.success).toBe(false);
  });
});

describe("advisor network client", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body ?? "{}")) as { mode?: string };
        if (body.mode === "space-suggest") {
          return {
            ok: true,
            json: async () => ({
              success: true,
              layout: VALID_LAYOUT,
              content: "Office layout",
            }),
          };
        }
        return {
          ok: true,
          json: async () => ({
            success: true,
            content: "Try a bench layout",
            suggestion: {
              type: "suggestion",
              description: "Bench cluster",
              actionLabel: "Apply",
              layout: VALID_LAYOUT,
            },
          }),
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests advisor chat and space suggest responses", async () => {
    const chat = await requestAdvisorChat([{ role: "user", content: "Plan a 10 seat office" }]);
    expect(chat.success).toBe(true);
    if (chat.success) {
      expect(chat.content).toContain("bench");
    }

    const suggest = await requestSpaceSuggest(10, "office", 1200);
    expect(suggest.success).toBe(true);
  });
});

describe("sketch-to-plan client", () => {
  const dataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          status: "preview",
          fileName: "sketch.png",
          objects: [{ type: "wall", x1: 0, y1: 0, x2: 1000, y2: 0 }],
          warnings: [],
        }),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates sketch requests and converts sketches", async () => {
    const invalid = await convertSketchToPlan({ imageDataUrl: "", fileName: "" });
    expect(invalid.success).toBe(false);

    const converted = await convertSketchToPlan({
      imageDataUrl: dataUrl,
      fileName: "sketch.png",
      includeRooms: true,
    });
    expect(converted.success).toBe(true);
    expect(converted.objects?.length).toBe(1);

    const progressStates: string[] = [];
    await convertSketchToPlanWithProgress(
      { imageDataUrl: dataUrl, fileName: "sketch.png" },
      (state) => progressStates.push(state.status),
    );
    expect(progressStates).toContain("converting");
    expect(progressStates).toContain("preview");
  });

  it("supports recovery helpers and acceptance workflow", () => {
    expect(getDefaultSketchPrompt(true)).toContain("rooms");
    expect(getDefaultSketchPrompt(false)).not.toContain("room labels");
    expect(estimateConversionTimeout(dataUrl)).toBeGreaterThan(0);
    expect(getSketchRecoveryMessage("low_confidence")).toContain("reliable");
    expect(acceptConversion("sketch.png").success).toBe(true);
    expect(rejectConversion("sketch.png").success).toBe(true);
  });
});
