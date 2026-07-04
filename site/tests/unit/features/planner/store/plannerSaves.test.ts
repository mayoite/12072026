import { describe, expect, it } from "vitest";
import { savePlannerDocumentToStore, loadPlannerDocumentFromStore, listPlannerDocumentsFromStore, deletePlannerDocumentFromStore, savePlannerDocumentToSupabase, loadPlannerDocumentFromSupabase, listPlannerDocumentsFromSupabase, deletePlannerDocumentFromSupabase } from "@/features/planner/store/plannerSaves";

describe("plannerSaves", () => {
  it("should have function savePlannerDocumentToStore defined", () => {
    expect(savePlannerDocumentToStore).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocumentFromStore defined", () => {
    expect(loadPlannerDocumentFromStore).toBeTypeOf("function");
  });
  it("should have function listPlannerDocumentsFromStore defined", () => {
    expect(listPlannerDocumentsFromStore).toBeTypeOf("function");
  });
  it("should have function deletePlannerDocumentFromStore defined", () => {
    expect(deletePlannerDocumentFromStore).toBeTypeOf("function");
  });
  it("should have constant savePlannerDocumentToSupabase defined", () => {
    expect(savePlannerDocumentToSupabase).toBeDefined();
  });
  it("should have constant loadPlannerDocumentFromSupabase defined", () => {
    expect(loadPlannerDocumentFromSupabase).toBeDefined();
  });
  it("should have constant listPlannerDocumentsFromSupabase defined", () => {
    expect(listPlannerDocumentsFromSupabase).toBeDefined();
  });
  it("should have constant deletePlannerDocumentFromSupabase defined", () => {
    expect(deletePlannerDocumentFromSupabase).toBeDefined();
  });
});