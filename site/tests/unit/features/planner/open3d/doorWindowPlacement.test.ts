import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDoorWindowPlacement } from "@/features/planner/open3d/editor/useDoorWindowPlacement";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";

describe("useDoorWindowPlacement", () => {
  let project: ReturnType<typeof createOpen3dProject>;

  beforeEach(() => {
    project = createOpen3dProject({ name: "Test Project" });
  });

  describe("initial state", () => {
    it("starts in select mode", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));
      expect(result.current.placementMode).toEqual({ mode: "select" });
      expect(result.current.isPlacing).toBe(false);
      expect(result.current.isEditing).toBe(false);
    });

    it("provides door types", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));
      expect(result.current.doorTypes).toContain("single");
      expect(result.current.doorTypes).toContain("double");
      expect(result.current.doorTypes).toContain("sliding");
    });

    it("provides window types", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));
      expect(result.current.windowTypes).toContain("standard");
      expect(result.current.windowTypes).toContain("fixed");
      expect(result.current.windowTypes).toContain("casement");
    });
  });

  describe("door placement", () => {
    it("enters door placement mode", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));

      act(() => {
        result.current.startDoorPlacement("single");
      });

      expect(result.current.placementMode).toEqual({ mode: "place-door", doorType: "single" });
      expect(result.current.isPlacing).toBe(true);
    });

    it("exits placement mode on cancel", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));

      act(() => {
        result.current.startDoorPlacement("double");
      });

      act(() => {
        result.current.cancelPlacement();
      });

      expect(result.current.placementMode).toEqual({ mode: "select" });
      expect(result.current.selectedWallId).toBeNull();
    });
  });

  describe("window placement", () => {
    it("enters window placement mode", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));

      act(() => {
        result.current.startWindowPlacement("standard");
      });

      expect(result.current.placementMode).toEqual({ mode: "place-window", windowType: "standard" });
      expect(result.current.isPlacing).toBe(true);
    });
  });

  describe("wall hover tracking", () => {
    it("tracks hover position", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));

      act(() => {
        result.current.handleWallHover("wall-1", 0.5);
      });

      expect(result.current.selectedWallId).toBe("wall-1");
      expect(result.current.hoverPosition).toBe(0.5);
    });

    it("clears hover on mouse leave", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(project));

      act(() => {
        result.current.handleWallHover("wall-1", 0.5);
      });

      act(() => {
        result.current.handleWallHover(null, null);
      });

      expect(result.current.selectedWallId).toBeNull();
      expect(result.current.hoverPosition).toBeNull();
    });
  });

  describe("door/window queries", () => {
    it("returns empty arrays when project is null", () => {
      const { result } = renderHook(() => useDoorWindowPlacement(null));

      expect(result.current.getDoorsOnWall("wall-1")).toEqual([]);
      expect(result.current.getWindowsOnWall("wall-1")).toEqual([]);
    });
  });
});