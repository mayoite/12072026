import { describe, expect, it } from "vitest";
import { buildTemplateCanvasPlacements, getTemplate, getTemplatesByCategory } from "@/features/planner/templates/layoutTemplates";

describe("layoutTemplates", () => {
  it("should have function buildTemplateCanvasPlacements defined", () => {
    expect(buildTemplateCanvasPlacements).toBeTypeOf("function");
  });
  it("should have function getTemplate defined", () => {
    expect(getTemplate).toBeTypeOf("function");
  });
  it("should have function getTemplatesByCategory defined", () => {
    expect(getTemplatesByCategory).toBeTypeOf("function");
  });
});