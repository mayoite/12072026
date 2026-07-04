import { describe, expect, it, vi } from "vitest";
import { isPlannerSceneEnvelope, getPlannerSceneEnvelope, normalizePlannerDocumentId, createPlannerDocument, createEmptyPlannerDocument, isPlannerDocument, isPlannerSaveRow, normalizePlannerDocument, plannerDocumentToSaveRow, plannerSaveRowToDocument, summarizePlannerDocument, validatePlannerDocument, validatePlannerDocumentSafe, assertPlannerDocument, parsePlannerDocumentImport, validatePlannerDocumentImport, plannerCrmSyncStatusSchema, plannerEnquiryPayloadEnvelopeSchema, plannerDocumentSchema, plannerDocumentImportSchema, plannerSaveRowSchema, plannerSaveWriteSchema, plannerSaveSummarySchema, plannerDocumentImportEnvelopeSchema } from "@/features/planner/model/plannerDocument";

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

describe("plannerDocument", () => {
  it("should have function isPlannerSceneEnvelope defined", () => {
    expect(isPlannerSceneEnvelope).toBeTypeOf("function");
  });
  it("should have function getPlannerSceneEnvelope defined", () => {
    expect(getPlannerSceneEnvelope).toBeTypeOf("function");
  });
  it("should have function normalizePlannerDocumentId defined", () => {
    expect(normalizePlannerDocumentId).toBeTypeOf("function");
  });
  it("should have function createPlannerDocument defined", () => {
    expect(createPlannerDocument).toBeTypeOf("function");
  });
  it("should have function createEmptyPlannerDocument defined", () => {
    expect(createEmptyPlannerDocument).toBeTypeOf("function");
  });
  it("should have function isPlannerDocument defined", () => {
    expect(isPlannerDocument).toBeTypeOf("function");
  });
  it("should have function isPlannerSaveRow defined", () => {
    expect(isPlannerSaveRow).toBeTypeOf("function");
  });
  it("should have function normalizePlannerDocument defined", () => {
    expect(normalizePlannerDocument).toBeTypeOf("function");
  });
  it("should have function plannerDocumentToSaveRow defined", () => {
    expect(plannerDocumentToSaveRow).toBeTypeOf("function");
  });
  it("should have function plannerSaveRowToDocument defined", () => {
    expect(plannerSaveRowToDocument).toBeTypeOf("function");
  });
  it("should have function summarizePlannerDocument defined", () => {
    expect(summarizePlannerDocument).toBeTypeOf("function");
  });
  it("should have function validatePlannerDocument defined", () => {
    expect(validatePlannerDocument).toBeTypeOf("function");
  });
  it("should have function validatePlannerDocumentSafe defined", () => {
    expect(validatePlannerDocumentSafe).toBeTypeOf("function");
  });
  it("should have function assertPlannerDocument defined", () => {
    expect(assertPlannerDocument).toBeTypeOf("function");
  });
  it("should have function parsePlannerDocumentImport defined", () => {
    expect(parsePlannerDocumentImport).toBeTypeOf("function");
  });
  it("should have function validatePlannerDocumentImport defined", () => {
    expect(validatePlannerDocumentImport).toBeTypeOf("function");
  });
  it("should have constant plannerCrmSyncStatusSchema defined", () => {
    expect(plannerCrmSyncStatusSchema).toBeDefined();
  });
  it("should have constant plannerEnquiryPayloadEnvelopeSchema defined", () => {
    expect(plannerEnquiryPayloadEnvelopeSchema).toBeDefined();
  });
  it("should have constant plannerDocumentSchema defined", () => {
    expect(plannerDocumentSchema).toBeDefined();
  });
  it("should have constant plannerDocumentImportSchema defined", () => {
    expect(plannerDocumentImportSchema).toBeDefined();
  });
  it("should have constant plannerSaveRowSchema defined", () => {
    expect(plannerSaveRowSchema).toBeDefined();
  });
  it("should have constant plannerSaveWriteSchema defined", () => {
    expect(plannerSaveWriteSchema).toBeDefined();
  });
  it("should have constant plannerSaveSummarySchema defined", () => {
    expect(plannerSaveSummarySchema).toBeDefined();
  });
  it("should have constant plannerDocumentImportEnvelopeSchema defined", () => {
    expect(plannerDocumentImportEnvelopeSchema).toBeDefined();
  });
});