import { describe, expect, it } from "vitest";
import { listOwnerPlansFromApi, listAdminPlansFromApi, loadPlanFromApi, savePlanToApi, deletePlanFromApi } from "@/features/planner/persistence/plannerCloudApi";

describe("plannerCloudApi", () => {
  it("should have function listOwnerPlansFromApi defined", () => {
    expect(listOwnerPlansFromApi).toBeTypeOf("function"); expect(String(listOwnerPlansFromApi)).toContain('function');
  });
  it("should have function listAdminPlansFromApi defined", () => {
    expect(listAdminPlansFromApi).toBeTypeOf("function"); expect(String(listAdminPlansFromApi)).toContain('function');
  });
  it("should have function loadPlanFromApi defined", () => {
    expect(loadPlanFromApi).toBeTypeOf("function"); expect(String(loadPlanFromApi)).toContain('function');
  });
  it("should have function savePlanToApi defined", () => {
    expect(savePlanToApi).toBeTypeOf("function"); expect(String(savePlanToApi)).toContain('function');
  });
  it("should have function deletePlanFromApi defined", () => {
    expect(deletePlanFromApi).toBeTypeOf("function"); expect(String(deletePlanFromApi)).toContain('function');
  });
});