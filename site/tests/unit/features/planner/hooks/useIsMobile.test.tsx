import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  function mockMatchMedia(matches: boolean) {
    const listeners = new Set<(e: MediaQueryListEvent) => void>();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    return listeners;
  }

  it("reports false when viewport is not mobile", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("reports true when matchMedia matches mobile query", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
