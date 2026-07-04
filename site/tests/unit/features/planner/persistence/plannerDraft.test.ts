import { describe, expect, it } from "vitest";
import { cleanupExpiredPlannerDrafts, listPlannerDraftDocuments, resolvePlannerDraftDocument, savePlannerDraftDocument, loadPlannerDraftDocument, deletePlannerDraftDocument, loadOrCreatePlannerDraftDocument } from "@/features/planner/persistence/plannerDraft";

describe("plannerDraft", () => {
  it("should have function cleanupExpiredPlannerDrafts defined", () => {
    expect(cleanupExpiredPlannerDrafts).toBeTypeOf("function");
  });
  it("should have function listPlannerDraftDocuments defined", () => {
    expect(listPlannerDraftDocuments).toBeTypeOf("function");
  });
  it("should have function resolvePlannerDraftDocument defined", () => {
    expect(resolvePlannerDraftDocument).toBeTypeOf("function");
  });
  it("should have function savePlannerDraftDocument defined", () => {
    expect(savePlannerDraftDocument).toBeTypeOf("function");
  });
  it("should have function loadPlannerDraftDocument defined", () => {
    expect(loadPlannerDraftDocument).toBeTypeOf("function");
  });
  it("should have function deletePlannerDraftDocument defined", () => {
    expect(deletePlannerDraftDocument).toBeTypeOf("function");
  });
  it("should have function loadOrCreatePlannerDraftDocument defined", () => {
    expect(loadOrCreatePlannerDraftDocument).toBeTypeOf("function");
  });
});