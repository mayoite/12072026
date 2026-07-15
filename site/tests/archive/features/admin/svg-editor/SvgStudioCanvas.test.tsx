import { describe, expect, it } from "vitest";
import { SvgStudioCanvas } from "@/features/admin/svg-editor/SvgStudioCanvas";

describe("SvgStudioCanvas", () => {
  it("exports a client canvas component", () => {
    expect(typeof SvgStudioCanvas).toBe("function");
    expect(SvgStudioCanvas.name).toMatch(/SvgStudioCanvas|Canvas/);
  });
});
