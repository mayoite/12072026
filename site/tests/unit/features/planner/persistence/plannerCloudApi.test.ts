import { describe, expect, it } from "vitest";
import { listOwnerPlansFromApi, listAdminPlansFromApi, loadPlanFromApi, savePlanToApi, deletePlanFromApi } from "@/features/planner/persistence/plannerCloudApi";

describe("plannerCloudApi", () => {
  it("should have function listOwnerPlansFromApi defined", () => {
    expect(listOwnerPlansFromApi).toBeTypeOf("function");
  });
  it("should have function listAdminPlansFromApi defined", () => {
    expect(listAdminPlansFromApi).toBeTypeOf("function");
  });
  it("should have function loadPlanFromApi defined", () => {
    expect(loadPlanFromApi).toBeTypeOf("function");
  });
  it("should have function savePlanToApi defined", () => {
    expect(savePlanToApi).toBeTypeOf("function");
  });
  it("should have function deletePlanFromApi defined", () => {
    expect(deletePlanFromApi).toBeTypeOf("function");
  });
});