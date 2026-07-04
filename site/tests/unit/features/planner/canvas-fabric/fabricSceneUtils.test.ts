import { describe, expect, it } from "vitest";
import {
  fabricObjectCategory,
  parseFabricObjects,
  PLANNER_MAX_CANVAS_MM,
  resolveRoomMmFromFabricObjects,
  resolveRoomMmFromFabricSnapshot,
  fabricObjectToSceneItem,
} from "@/features/planner/canvas-fabric/fabricSceneUtils";

describe("fabricSceneUtils", () => {
  describe("parseFabricObjects", () => {
    it("returns empty array for null or empty input", () => {
      expect(parseFabricObjects(null)).toEqual([]);
      expect(parseFabricObjects("")).toEqual([]);
    });

    it("returns empty array for invalid JSON", () => {
      expect(parseFabricObjects("{not-json")).toEqual([]);
    });

    it("extracts the objects array and filters non-objects", () => {
      const serialized = JSON.stringify({
        objects: [{ name: "WALL:0" }, null, "skip", { name: "CORNER" }],
      });
      expect(parseFabricObjects(serialized)).toEqual([
        { name: "WALL:0" },
        { name: "CORNER" },
      ]);
    });

    it("returns empty array when objects is missing", () => {
      const serialized = JSON.stringify({ version: "1" });
      expect(parseFabricObjects(serialized)).toEqual([]);
    });
  });

  describe("resolveRoomMmFromFabricObjects", () => {
    it("returns fallback when fewer than two corners", () => {
      expect(resolveRoomMmFromFabricObjects([])).toEqual({
        widthMm: 5000,
        depthMm: 4000,
      });
      expect(
        resolveRoomMmFromFabricObjects([{ name: "CORNER", left: 10, top: 10 }]),
      ).toEqual({ widthMm: 1000, depthMm: 1000 });
    });

    it("computes room mm from corner bounds (fabric units * 10)", () => {
      const corners = [
        { name: "CORNER", left: 0, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 200, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 200, top: 150, width: 0, height: 0 },
        { name: "CORNER", left: 0, top: 150, width: 0, height: 0 },
      ];
      // (200 - 0) * 10 = 2000mm wide; (150 - 0) * 10 = 1500mm deep.
      expect(resolveRoomMmFromFabricObjects(corners)).toEqual({
        widthMm: 2000,
        depthMm: 1500,
      });
    });

    it("enforces a configured minimum for each dimension", () => {
      const corners = [
        { name: "CORNER", left: 0, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 5, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 5, top: 5, width: 0, height: 0 },
      ];
      expect(resolveRoomMmFromFabricObjects(corners)).toEqual({
        widthMm: 1000,
        depthMm: 1000,
      });
    });

    it("caps room dimensions at the configured canvas maximum", () => {
      const corners = [
        { name: "CORNER", left: 0, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 200_000, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 200_000, top: 200_000, width: 0, height: 0 },
      ];
      expect(resolveRoomMmFromFabricObjects(corners)).toEqual({
        widthMm: PLANNER_MAX_CANVAS_MM,
        depthMm: PLANNER_MAX_CANVAS_MM,
      });
    });

    it("includes wall objects when computing bounds", () => {
      const objects = [
        { name: "WALL:0", left: 5000, top: 5000, width: 0, height: 0 },
        { name: "CORNER", left: 0, top: 0, width: 0, height: 0 },
        { name: "CORNER", left: 100, top: 100, width: 0, height: 0 },
      ];
      expect(resolveRoomMmFromFabricObjects(objects)).toEqual({
        widthMm: 50000,
        depthMm: 50000,
      });
    });

    it("respects a custom fallback", () => {
      expect(
        resolveRoomMmFromFabricObjects([], { widthMm: 3000, depthMm: 2000 }),
      ).toEqual({ widthMm: 3000, depthMm: 2000 });
    });
  });

  describe("resolveRoomMmFromFabricSnapshot", () => {
    it("combines parse + resolve", () => {
      const serialized = JSON.stringify({
        objects: [
          { name: "CORNER", left: 0, top: 0, width: 0, height: 0 },
          { name: "CORNER", left: 300, top: 0, width: 0, height: 0 },
          { name: "CORNER", left: 300, top: 200, width: 0, height: 0 },
        ],
      });
      expect(resolveRoomMmFromFabricSnapshot(serialized)).toEqual({
        widthMm: 3000,
        depthMm: 2000,
      });
    });

    it("returns fallback for null input", () => {
      expect(resolveRoomMmFromFabricSnapshot(null)).toEqual({
        widthMm: 5000,
        depthMm: 4000,
      });
    });
  });

  describe("fabricObjectCategory", () => {
    it("classifies structure names", () => {
      expect(fabricObjectCategory("CORNER")).toBe("Structure");
      expect(fabricObjectCategory("WALL:0")).toBe("Structure");
      expect(fabricObjectCategory("DOOR:front")).toBe("Structure");
      expect(fabricObjectCategory("WINDOW:left")).toBe("Structure");
    });

    it("classifies measurements and zones", () => {
      expect(fabricObjectCategory("DRAW:measure-1")).toBe("Measurement");
      expect(fabricObjectCategory("DRAW:zone-a")).toBe("Zone");
    });

    it("classifies furniture (and defaults to Furniture)", () => {
      expect(fabricObjectCategory("GENERIC:Desk")).toBe("Furniture");
      expect(fabricObjectCategory("TABLE:round")).toBe("Furniture");
      expect(fabricObjectCategory("CHAIR:Generic")).toBe("Furniture");
      expect(fabricObjectCategory("DESK:stand")).toBe("Furniture");
      expect(fabricObjectCategory("UNKNOWN")).toBe("Furniture");
    });
  });

  describe("fabricObjectToSceneItem", () => {
    it("converts fabric object map to SceneItem", () => {
      const obj = {
        name: "CHAIR:Ergonomic",
        left: 10,
        top: 20,
        width: 50,
        height: 50,
        scaleX: 1.5,
        scaleY: 1.2,
        angle: 45,
        originX: "left",
        originY: "top",
      };

      const item = fabricObjectToSceneItem(obj, 1);
      expect(item.id).toBe("fabric-item-1");
      expect(item.name).toBe("Ergonomic");
      expect(item.category).toBe("Furniture");
      expect(item.rotationDeg).toBe(45);
      expect(item.sizeMm.widthMm).toBeCloseTo(750); // 50 * 1.5 * 10
      expect(item.sizeMm.depthMm).toBeCloseTo(600); // 50 * 1.2 * 10
      expect(item.centerMm.xMm).toBeGreaterThan(0);
      expect(item.centerMm.yMm).toBeGreaterThan(0);
    });

    it("measures the DESK footprint, not the chair-inclusive group bounds", () => {
      const obj = {
        name: "TABLE:4 seater",
        left: 0,
        top: 0,
        width: 180, // group span includes chairs
        height: 120,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        originX: "left",
        originY: "top",
        objects: [
          { name: "CHAIR:Generic", width: 30, height: 30 },
          { name: "CHAIR:Generic", width: 30, height: 30 },
          { name: "DESK", width: 120, height: 60 },
        ],
      };

      const item = fabricObjectToSceneItem(obj, 2);
      // Desk footprint 120 x 60 (canvas units) * 10 = 1200 x 600 mm,
      // NOT the group's 180 x 120 -> 1800 x 1200.
      expect(item.sizeMm.widthMm).toBeCloseTo(1200);
      expect(item.sizeMm.depthMm).toBeCloseTo(600);
    });

    it("applies group scale to the DESK footprint", () => {
      const obj = {
        name: "TABLE:round",
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        scaleX: 2,
        scaleY: 2,
        angle: 0,
        objects: [{ name: "DESK", radius: 50 }],
      };

      const item = fabricObjectToSceneItem(obj, 3);
      // radius 50 -> diameter 100, * group scale 2 = 200 canvas units * 10 = 2000 mm.
      expect(item.sizeMm.widthMm).toBeCloseTo(2000);
      expect(item.sizeMm.depthMm).toBeCloseTo(2000);
    });

    it("falls back to group bounds when there is no DESK child", () => {
      const obj = {
        name: "CHAIR:Generic",
        width: 40,
        height: 40,
        scaleX: 1,
        scaleY: 1,
        objects: [{ name: "CHAIR:Generic", width: 40, height: 40 }],
      };

      const item = fabricObjectToSceneItem(obj, 4);
      expect(item.sizeMm.widthMm).toBeCloseTo(400);
      expect(item.sizeMm.depthMm).toBeCloseTo(400);
    });
  });
});
