import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useValidation } from "@/features/planner/editor/useValidation";
import { createPlannerProject } from "@/features/planner/project/model/project";

describe("useValidation", () => {
  it("validates an active floor snapshot", () => {
    const project = createPlannerProject();
    const { result } = renderHook(() => useValidation(project.floors[0]));
    expect(result.current.issues).toEqual(expect.any(Array));
    expect(result.current.errors).toBeGreaterThanOrEqual(0);
    expect(result.current.warnings).toBeGreaterThanOrEqual(0);
  });

  it("returns empty result for undefined floor", () => {
    const { result } = renderHook(() => useValidation(undefined));
    expect(result.current.issues).toEqual([]);
    expect(result.current.errors).toBe(0);
  });
});
