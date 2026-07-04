import { describe, expect, it } from "vitest";
import { getProjectIndex, saveProjectIndex, migrateOldProjects, validateImportedProject } from "@/features/planner/store/plannerProjectStorage";

describe("plannerProjectStorage", () => {
  it("should have function getProjectIndex defined", () => {
    expect(getProjectIndex).toBeTypeOf("function");
  });
  it("should have function saveProjectIndex defined", () => {
    expect(saveProjectIndex).toBeTypeOf("function");
  });
  it("should have function migrateOldProjects defined", () => {
    expect(migrateOldProjects).toBeTypeOf("function");
  });
  it("should have function validateImportedProject defined", () => {
    expect(validateImportedProject).toBeTypeOf("function");
  });
});