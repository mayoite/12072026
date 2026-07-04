import { describe, it, expect } from "vitest";
import {
  toPlannerViewerShapes,
  buildRoomShape,
  buildZoneShape,
  buildFurnitureShape,
  buildCatalogShape,
  buildTemplateShapes,
  applyShapes,
} from "@/features/planner/editor/plannerShapeFactories";

describe("plannerShapeFactories", () => {
  it("builds room shape correctly", () => {
    const shape = buildRoomShape(10, 20, 100, 200, "Office Room", "office");
    expect(shape.type).toBe("planner-room");
    expect(shape.x).toBe(10);
    expect(shape.y).toBe(20);
  });

  it("builds zone shape correctly", () => {
    const shape = buildZoneShape(30, 40, 150, 250, "Quiet Zone", "quiet");
    expect(shape.type).toBe("planner-zone");
    expect(shape.x).toBe(30);
    expect(shape.y).toBe(40);
  });

  it("builds furniture shape correctly", () => {
    const shape = buildFurnitureShape(50, 60, { name: "Desk", widthMm: 1200, depthMm: 600 });
    expect(shape.type).toBe("planner-furniture");
    expect(shape.x).toBe(50);
  });

  it("builds catalog shape correctly", () => {
    const item = { id: "catalog-item-123" } as any;
    const shape = buildCatalogShape(item, 70, 80);
    expect(shape.type).toBe("planner-furniture");
    expect(shape.props.catalogId).toBe("catalog-item-123");
  });

  it("returns empty array for toPlannerViewerShapes and buildTemplateShapes", () => {
    expect(toPlannerViewerShapes([])).toEqual([]);
    expect(buildTemplateShapes({} as any)).toEqual([]);
  });

  it("does not crash when calling applyShapes", () => {
    expect(() => applyShapes(null, [])).not.toThrow();
  });
});
