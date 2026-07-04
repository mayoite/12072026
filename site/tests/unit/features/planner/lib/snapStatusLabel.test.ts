import { describe, expect, it } from "vitest";

import { buildSnapStatusLabel, isSnapStatusActive } from "@/features/planner/lib/snapStatusLabel";

describe("snapStatusLabel", () => {
  it("reports off when snapping is disabled", () => {
    expect(buildSnapStatusLabel(false, true)).toBe("Off");
    expect(isSnapStatusActive("Off")).toBe(false);
  });

  it("reports grid + objects when both are enabled", () => {
    expect(buildSnapStatusLabel(true, true)).toBe("Grid + Objects");
    expect(isSnapStatusActive("Grid + Objects")).toBe(true);
  });

  it("reports objects-only when grid is hidden", () => {
    expect(buildSnapStatusLabel(true, false)).toBe("Objects");
    expect(isSnapStatusActive("Objects")).toBe(true);
  });

  it("treats legacy pending label as inactive", () => {
    expect(isSnapStatusActive("Pending")).toBe(false);
  });
});
