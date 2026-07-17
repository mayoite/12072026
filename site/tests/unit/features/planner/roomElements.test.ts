import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoomElements } from "@/features/planner/editor/useRoomElements";
import { createPlannerProject } from "@/features/planner/model/project";

describe("useRoomElements", () => {
  let project: ReturnType<typeof createPlannerProject>;

  beforeEach(() => {
    project = createPlannerProject({ name: "Test Project" });
  });

  describe("initial state", () => {
    it("starts in select mode", () => {
      const { result } = renderHook(() => useRoomElements(project));
      expect(result.current.elementMode).toEqual({ mode: "select" });
      expect(result.current.isPlacing).toBe(false);
      expect(result.current.isEditing).toBe(false);
    });

    it("provides room categories", () => {
      const { result } = renderHook(() => useRoomElements(project));
      expect(result.current.roomCategories).toContain("indoor");
      expect(result.current.roomCategories).toContain("outdoor");
    });

    it("provides stair types", () => {
      const { result } = renderHook(() => useRoomElements(project));
      expect(result.current.stairTypes).toContain("straight");
      expect(result.current.stairTypes).toContain("spiral");
    });

    it("provides column shapes", () => {
      const { result } = renderHook(() => useRoomElements(project));
      expect(result.current.columnShapes).toContain("square");
      expect(result.current.columnShapes).toContain("round");
    });
  });

  describe("stair placement", () => {
    it("enters stair placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startStairPlacement();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-stair" });
      expect(result.current.isPlacing).toBe(true);
    });
  });

  describe("column placement", () => {
    it("enters column placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startColumnPlacement();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-column" });
    });
  });

  describe("measurement placement", () => {
    it("enters measurement placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startMeasurementPlacement();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-measurement" });
    });
  });

  describe("annotation placement", () => {
    it("enters annotation placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startAnnotationPlacement();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-annotation" });
    });

    it("enters text annotation mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startTextAnnotation();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-text" });
    });
  });

  describe("guide placement", () => {
    it("enters guide placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startGuidePlacement();
      });

      expect(result.current.elementMode).toEqual({ mode: "place-guide" });
    });
  });

  describe("selection", () => {
    it("tracks selected element", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.selectElement("element-123");
      });

      expect(result.current.selectedElementId).toBe("element-123");
    });

    it("clears selection", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.selectElement("element-123");
      });

      act(() => {
        result.current.selectElement(null);
      });

      expect(result.current.selectedElementId).toBeNull();
    });
  });

  describe("mode exit", () => {
    it("cancels placement mode", () => {
      const { result } = renderHook(() => useRoomElements(project));

      act(() => {
        result.current.startStairPlacement();
      });

      act(() => {
        result.current.cancelMode();
      });

      expect(result.current.elementMode).toEqual({ mode: "select" });
    });
  });

  describe("queries with null project", () => {
    it("returns empty arrays when project is null", () => {
      const { result } = renderHook(() => useRoomElements(null));

      expect(result.current.getAllRooms()).toEqual([]);
      expect(result.current.getAllStairs()).toEqual([]);
      expect(result.current.getAllColumns()).toEqual([]);
      expect(result.current.getAllMeasurements()).toEqual([]);
      expect(result.current.getAllAnnotations()).toEqual([]);
      expect(result.current.getAllGuides()).toEqual([]);
    });
  });
});