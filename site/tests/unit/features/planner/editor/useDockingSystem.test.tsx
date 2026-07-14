import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useDockingSystem,
  SSR_VIEWPORT_TIER,
  PLANNER_VIEWPORT_BREAKPOINTS,
} from "@/features/planner/editor/useDockingSystem";

describe("useDockingSystem", () => {
  it("exposes breakpoints and SSR tier", () => {
    expect(PLANNER_VIEWPORT_BREAKPOINTS.smallMax).toBe(768);
    expect(PLANNER_VIEWPORT_BREAKPOINTS.tabletMax).toBe(1280);
    expect(PLANNER_VIEWPORT_BREAKPOINTS.smallMax).toBeLessThan(
      PLANNER_VIEWPORT_BREAKPOINTS.tabletMax,
    );
    expect(["desktop", "tablet", "small"]).toContain(SSR_VIEWPORT_TIER);
  });

  it("returns panel state API", () => {
    const { result } = renderHook(() => useDockingSystem());
    expect(result.current.panels.left.state).toMatch(/docked|floating|collapsed/);
    expect(typeof result.current.dock).toBe("function");
    expect(typeof result.current.undock).toBe("function");
    expect(typeof result.current.toggleCollapse).toBe("function");
  });
});
