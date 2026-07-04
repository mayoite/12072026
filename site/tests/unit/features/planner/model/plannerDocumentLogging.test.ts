import { describe, expect, it, vi } from "vitest";
import { describePlannerValueSample, summarizePlannerSceneJson, summarizePlannerDocumentInput, getPlannerValueAtPath, formatPlannerZodIssues, logPlannerDocumentBuildAttempt, logPlannerSchemaValidationFailure } from "@/features/planner/model/plannerDocumentLogging";

vi.mock("fabric", () => {
  const mockCanvas = {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getWidth: vi.fn(() => 800),
    getHeight: vi.fn(() => 600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getZoom: vi.fn(() => 1),
    setZoom: vi.fn(),
    getObjects: vi.fn(() => []),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
  };
  return {
    fabric: {
      Canvas: vi.fn(() => mockCanvas),
      Rect: vi.fn(() => ({})),
      Circle: vi.fn(() => ({})),
      Path: vi.fn(() => ({})),
      Group: vi.fn(() => ({})),
    }
  };
});

describe("plannerDocumentLogging", () => {
  it("should have function describePlannerValueSample defined", () => {
    expect(describePlannerValueSample).toBeTypeOf("function");
  });
  it("should have function summarizePlannerSceneJson defined", () => {
    expect(summarizePlannerSceneJson).toBeTypeOf("function");
  });
  it("should have function summarizePlannerDocumentInput defined", () => {
    expect(summarizePlannerDocumentInput).toBeTypeOf("function");
  });
  it("should have function getPlannerValueAtPath defined", () => {
    expect(getPlannerValueAtPath).toBeTypeOf("function");
  });
  it("should have function formatPlannerZodIssues defined", () => {
    expect(formatPlannerZodIssues).toBeTypeOf("function");
  });
  it("should have function logPlannerDocumentBuildAttempt defined", () => {
    expect(logPlannerDocumentBuildAttempt).toBeTypeOf("function");
  });
  it("should have function logPlannerSchemaValidationFailure defined", () => {
    expect(logPlannerSchemaValidationFailure).toBeTypeOf("function");
  });
});