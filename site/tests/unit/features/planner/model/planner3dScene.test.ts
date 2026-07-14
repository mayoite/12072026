import { describe, expect, it } from "vitest";
import { validatePlanner3DSceneDocument, collectPlanner3DSceneWarnings, planner3dSceneDocumentSchema } from "@/features/planner/model/planner3dScene";

describe("planner3dScene", () => {
  it("should have function validatePlanner3DSceneDocument defined", () => {
    expect(validatePlanner3DSceneDocument).toBeTypeOf("function"); expect(String(validatePlanner3DSceneDocument)).toContain('function');
  });
  it("should have function collectPlanner3DSceneWarnings defined", () => {
    expect(collectPlanner3DSceneWarnings).toBeTypeOf("function"); expect(String(collectPlanner3DSceneWarnings)).toContain('function');
  });
  it("should have constant planner3dSceneDocumentSchema defined", () => {
    expect(planner3dSceneDocumentSchema).toBeDefined();
  });
});