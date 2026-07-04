import { describe, expect, it } from "vitest";
import { planRowToDocument, savePlannerDocument, loadPlannerDocument, listPlannerDocuments, listPlannerDocumentSummaries, deletePlannerDocument, isPlannerDatabaseConfigured, planRowToAdminSummary, planSummaryRowToAdminSummary, planRowToAdminDetail, listPlannerDocumentsAdmin, loadPlannerDocumentAdmin, patchPlannerDocumentAdmin, listPlannerAnalyticsRows } from "@/features/planner/store/plannerPersistence";

describe("plannerPersistence", () => {
  it("should have function planRowToDocument defined", () => {
    expect(planRowToDocument).toBeTypeOf("function");
  });
  it("should have function savePlannerDocument defined", () => {
    expect(savePlannerDocument).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocument defined", () => {
    expect(loadPlannerDocument).toBeTypeOf("function");
  });
  it("should have function listPlannerDocuments defined", () => {
    expect(listPlannerDocuments).toBeTypeOf("function");
  });
  it("should have function listPlannerDocumentSummaries defined", () => {
    expect(listPlannerDocumentSummaries).toBeTypeOf("function");
  });
  it("should have function deletePlannerDocument defined", () => {
    expect(deletePlannerDocument).toBeTypeOf("function");
  });
  it("should have function isPlannerDatabaseConfigured defined", () => {
    expect(isPlannerDatabaseConfigured).toBeTypeOf("function");
  });
  it("should have function planRowToAdminSummary defined", () => {
    expect(planRowToAdminSummary).toBeTypeOf("function");
  });
  it("should have function planSummaryRowToAdminSummary defined", () => {
    expect(planSummaryRowToAdminSummary).toBeTypeOf("function");
  });
  it("should have function planRowToAdminDetail defined", () => {
    expect(planRowToAdminDetail).toBeTypeOf("function");
  });
  it("should have function listPlannerDocumentsAdmin defined", () => {
    expect(listPlannerDocumentsAdmin).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocumentAdmin defined", () => {
    expect(loadPlannerDocumentAdmin).toBeTypeOf("function");
  });
  it("should have function patchPlannerDocumentAdmin defined", () => {
    expect(patchPlannerDocumentAdmin).toBeTypeOf("function");
  });
  it("should have function listPlannerAnalyticsRows defined", () => {
    expect(listPlannerAnalyticsRows).toBeTypeOf("function");
  });
});