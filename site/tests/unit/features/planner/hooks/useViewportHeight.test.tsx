import { describe, expect, it, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useViewportHeight } from "@/features/planner/hooks/useViewportHeight";

describe("useViewportHeight", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sets --vh CSS variable from window.innerHeight", () => {
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    const setProperty = vi.spyOn(document.documentElement.style, "setProperty");
    renderHook(() => useViewportHeight());
    expect(setProperty).toHaveBeenCalled();
    const vhCall = setProperty.mock.calls.find((c) => c[0] === "--vh" || String(c[0]).includes("vh"));
    expect(vhCall).toBeDefined();
    if (vhCall) {
      const value = String(vhCall[1]);
      expect(value).toMatch(/px|8/);
    }
  });
});
