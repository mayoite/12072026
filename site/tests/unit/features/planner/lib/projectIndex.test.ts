import { describe, expect, it, vi } from "vitest";
import { getProjectIdFromKey, getProjectIndex, saveProjectIndex, readSavedProjectPayload, getSavedPlans, getSavedPlanById, getSavedPlanByKey, renameSavedPlan, updateSavedPlanMetadata, duplicateSavedPlan, deleteSavedPlan, getSavedPlanSnapshots } from "@/features/planner/lib/projectIndex";

vi.mock("@/features/planner/cloud-store/plannerStore", () => ({
  usePlannerStore: {
    getState: () => ({
      document: {
        walls: [],
        furniture: [],
        roomWidth: 800,
        roomHeight: 600,
      },
      addFurnitureItem: vi.fn(),
      removeFurnitureItem: vi.fn(),
      updateFurnitureItem: vi.fn(),
      history: { undo: vi.fn(), redo: vi.fn() },
    }),
    subscribe: vi.fn(),
  },
}));

describe("projectIndex", () => {
  it("should have function getProjectIdFromKey defined", () => {
    expect(getProjectIdFromKey).toBeTypeOf("function");
  });
  it("should have function getProjectIndex defined", () => {
    expect(getProjectIndex).toBeTypeOf("function");
  });
  it("should have function saveProjectIndex defined", () => {
    expect(saveProjectIndex).toBeTypeOf("function");
  });
  it("should have function readSavedProjectPayload defined", () => {
    expect(readSavedProjectPayload).toBeTypeOf("function");
  });
  it("should have function getSavedPlans defined", () => {
    expect(getSavedPlans).toBeTypeOf("function");
  });
  it("should have function getSavedPlanById defined", () => {
    expect(getSavedPlanById).toBeTypeOf("function");
  });
  it("should have function getSavedPlanByKey defined", () => {
    expect(getSavedPlanByKey).toBeTypeOf("function");
  });
  it("should have function renameSavedPlan defined", () => {
    expect(renameSavedPlan).toBeTypeOf("function");
  });
  it("should have function updateSavedPlanMetadata defined", () => {
    expect(updateSavedPlanMetadata).toBeTypeOf("function");
  });
  it("should have function duplicateSavedPlan defined", () => {
    expect(duplicateSavedPlan).toBeTypeOf("function");
  });
  it("should have function deleteSavedPlan defined", () => {
    expect(deleteSavedPlan).toBeTypeOf("function");
  });
  it("should have function getSavedPlanSnapshots defined", () => {
    expect(getSavedPlanSnapshots).toBeTypeOf("function");
  });
});