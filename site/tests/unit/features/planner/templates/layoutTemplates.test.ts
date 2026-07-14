import { describe, expect, it } from "vitest";
import { buildTemplateCanvasPlacements, getTemplate, getTemplatesByCategory } from "@/features/planner/templates/layoutTemplates";

describe("layoutTemplates", () => {
  it("should have function buildTemplateCanvasPlacements defined", () => {
    expect(buildTemplateCanvasPlacements).toBeTypeOf("function"); expect(String(buildTemplateCanvasPlacements)).toContain('function');
  });
  it("should have function getTemplate defined", () => {
    expect(getTemplate).toBeTypeOf("function"); expect(String(getTemplate)).toContain('function');
  });
  it("should have function getTemplatesByCategory defined", () => {
    expect(getTemplatesByCategory).toBeTypeOf("function"); expect(String(getTemplatesByCategory)).toContain('function');
  });
});