import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";

import {
  useDockLayout,
  type StudioPanelDef,
} from "@/features/studio/shell/useDockLayout";

const PANELS: readonly StudioPanelDef[] = [
  { id: "inventory", title: "Inventory", defaultZone: "left" },
  { id: "properties", title: "Properties", defaultZone: "right", defaultHidden: true },
  { id: "log", title: "Log", defaultZone: "bottom", defaultCollapsed: true },
];

describe("useDockLayout", () => {
  it("seeds initial state from panel defs", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    expect(result.current.layout.inventory).toEqual({
      zone: "left",
      collapsed: false,
      hidden: false,
    });
    expect(result.current.layout.properties.hidden).toBe(true);
    expect(result.current.layout.log.collapsed).toBe(true);
  });

  it("showPanel un-hides and un-collapses", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() => result.current.showPanel("properties"));
    expect(result.current.layout.properties.hidden).toBe(false);
    act(() => result.current.showPanel("log"));
    expect(result.current.layout.log.collapsed).toBe(false);
  });

  it("hidePanel hides a visible panel", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() => result.current.hidePanel("inventory"));
    expect(result.current.layout.inventory.hidden).toBe(true);
  });

  it("movePanel changes zone and reveals the panel", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() => result.current.movePanel("properties", "left"));
    expect(result.current.layout.properties.zone).toBe("left");
    expect(result.current.layout.properties.hidden).toBe(false);
  });

  it("toggleCollapse flips collapsed", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() => result.current.toggleCollapse("inventory"));
    expect(result.current.layout.inventory.collapsed).toBe(true);
    act(() => result.current.toggleCollapse("inventory"));
    expect(result.current.layout.inventory.collapsed).toBe(false);
  });

  it("applyArrangement patches multiple panels at once", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() =>
      result.current.applyArrangement({
        inventory: { collapsed: true },
        properties: { hidden: false, zone: "bottom" },
      }),
    );
    expect(result.current.layout.inventory.collapsed).toBe(true);
    expect(result.current.layout.properties).toEqual({
      zone: "bottom",
      collapsed: false,
      hidden: false,
    });
  });

  it("resetArrangement restores defaults", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    act(() => result.current.movePanel("inventory", "right"));
    act(() => result.current.hidePanel("log"));
    act(() => result.current.resetArrangement());
    expect(result.current.layout.inventory.zone).toBe("left");
    expect(result.current.layout.log.hidden).toBe(false);
    expect(result.current.layout.log.collapsed).toBe(true);
  });

  it("returns identical state reference for no-op actions", () => {
    const { result } = renderHook(() => useDockLayout(PANELS));
    const before = result.current.layout;
    act(() => result.current.showPanel("inventory")); // already visible
    expect(result.current.layout).toBe(before);
  });
});
