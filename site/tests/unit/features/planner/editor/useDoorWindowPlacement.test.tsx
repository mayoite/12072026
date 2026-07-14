import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDoorWindowPlacement } from "@/features/planner/editor/useDoorWindowPlacement";
import { createPlannerProject } from "@/features/planner/project/model/project";

describe("useDoorWindowPlacement", () => {
  it("exposes placement mode API with project", () => {
    const project = createPlannerProject();
    const { result } = renderHook(() => useDoorWindowPlacement(project));
    expect(result.current.placementMode).toEqual({ mode: "select" });
    expect(result.current.doorTypes).toContain("single");
    expect(result.current.windowTypes).toContain("standard");
    expect(result.current.isPlacing).toBe(false);
    act(() => {
      result.current.startDoorPlacement("single");
    });
    expect(result.current.placementMode).toEqual({ mode: "place-door", doorType: "single" });
    expect(result.current.isPlacing).toBe(true);
    act(() => {
      result.current.cancelPlacement();
    });
    expect(result.current.placementMode).toEqual({ mode: "select" });
  });
});
