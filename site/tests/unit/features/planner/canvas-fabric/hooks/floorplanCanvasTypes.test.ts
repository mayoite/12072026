import { describe, it, expect, vi } from "vitest";
import { resolveLayerCategory, getBoundingRect } from "@/features/planner/canvas-fabric/hooks/floorplanCanvasTypes";

describe("floorplanCanvasTypes", () => {
  describe("resolveLayerCategory", () => {
    it("resolves layer category correctly", () => {
      expect(resolveLayerCategory({ name: "CORNER" })).toBe("walls");
      expect(resolveLayerCategory({ name: "WALL:123" })).toBe("walls");
      expect(resolveLayerCategory({ name: "DOOR:main" })).toBe("walls");
      expect(resolveLayerCategory({ name: "WINDOW:main" })).toBe("walls");
      expect(resolveLayerCategory({ name: "DRAW:measure-1" })).toBe("measurements");
      expect(resolveLayerCategory({ name: "DRAW:zone-a" })).toBe("zones");
      expect(resolveLayerCategory({ name: "GENERIC:Chair" })).toBe("furniture");
      expect(resolveLayerCategory({ name: "TABLE" })).toBe("furniture");
      expect(resolveLayerCategory({ name: "CHAIR" })).toBe("furniture");
      expect(resolveLayerCategory({ name: "DESK" })).toBe("furniture");
      expect(resolveLayerCategory({ name: "UNKNOWN" })).toBeNull();
      expect(resolveLayerCategory(null)).toBeNull();
    });
  });

  describe("getBoundingRect", () => {
    it("returns zero bounds if objects list is empty", () => {
      expect(getBoundingRect([])).toEqual({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        center: 0,
        middle: 0,
        width: 0,
        height: 0,
      });
    });

    it("calcules union of bounding boxes", () => {
      const obj1 = {
        left: 10,
        top: 10,
        width: 20,
        height: 30,
        setCoords: vi.fn(),
        getBoundingRect: () => ({ left: 10, top: 10, width: 20, height: 30 }),
      };
      const obj2 = {
        left: 15,
        top: 25,
        width: 40,
        height: 10,
        setCoords: vi.fn(),
        getBoundingRect: () => ({ left: 15, top: 25, width: 40, height: 10 }),
      };

      const rect = getBoundingRect([obj1 as any, obj2 as any]);
      expect(rect.left).toBe(10);
      expect(rect.top).toBe(10);
      expect(rect.right).toBe(55); // 15 + 40
      expect(rect.bottom).toBe(40); // max(10+30, 25+10)
      expect(rect.width).toBe(45);
      expect(rect.height).toBe(30);
    });
  });
});
