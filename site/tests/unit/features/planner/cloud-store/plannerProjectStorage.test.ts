import { describe, expect, it } from "vitest";
import { getProjectIndex, saveProjectIndex, migrateOldProjects, validateImportedProject } from "@/features/planner/cloud-store/plannerProjectStorage";

describe("plannerProjectStorage", () => {
  it("should have function getProjectIndex defined", () => {
    expect(getProjectIndex).toBeTypeOf("function"); expect(String(getProjectIndex)).toContain('function');
  });
  it("should have function saveProjectIndex defined", () => {
    expect(saveProjectIndex).toBeTypeOf("function"); expect(String(saveProjectIndex)).toContain('function');
  });
  it("should have function migrateOldProjects defined", () => {
    expect(migrateOldProjects).toBeTypeOf("function"); expect(String(migrateOldProjects)).toContain('function');
  });
  it("should have function validateImportedProject defined", () => {
    expect(validateImportedProject).toBeTypeOf("function"); expect(String(validateImportedProject)).toContain('function');
  });
});