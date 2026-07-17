import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoomElements } from "@/features/planner/editor/useRoomElements";
import { createPlannerProject } from "@/features/planner/model/project";

describe("useRoomElements", () => {
  it("returns room element mode helpers", () => {
    const project = createPlannerProject();
    const { result } = renderHook(() => useRoomElements(project));
    expect(result.current.elementMode).toEqual({ mode: "select" });
    expect(result.current.roomCategories.length).toBeGreaterThan(0);
    expect(result.current.stairTypes).toContain("straight");
    act(() => {
      result.current.startColumnPlacement();
    });
    expect(result.current.elementMode).toEqual({ mode: "place-column" });
    expect(result.current.isPlacing).toBe(true);
  });
});
