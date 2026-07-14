import { describe, expect, it } from "vitest";

import {
  buildTemplateCanvasPlacements,
  getTemplate,
  getTemplatesByCategory,
} from "@/features/planner/templates/layoutTemplates";

describe("layoutTemplates (canonical templates entry)", () => {
  it("exports template helpers", () => {
    expect(typeof getTemplate).toBe("function");
    expect(typeof getTemplatesByCategory).toBe("function");
    expect(typeof buildTemplateCanvasPlacements).toBe("function");
  });
});
