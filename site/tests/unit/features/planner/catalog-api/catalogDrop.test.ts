import { describe, expect, it, vi } from "vitest";
import {
  catalogDropScreenFootprint,
  catalogFootprintCanvasCm,
  centeredCatalogDropPagePoint,
  hideNativeDragPreview,
} from "@/features/planner/catalog-api/catalogDrop";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

const desk: CatalogItem = {
  id: "desk-1",
  name: "Desk",
  category: "desks",
  shapeType: "planner-desk",
  widthMm: 120,
  heightMm: 60,
  depthMm: 60,
  description: "desk",
  tags: [],
};

const largeMmDesk: CatalogItem = {
  ...desk,
  id: "desk-large",
  widthMm: 1600,
  heightMm: 800,
  depthMm: 800,
};

describe("catalogDrop", () => {
  it("maps catalog cm footprint to canvas cm", () => {
    expect(catalogFootprintCanvasCm(desk)).toEqual({ w: 120, h: 60 });
  });

  it("scales real mm values via plannerCanvasUnits", () => {
    const fp = catalogFootprintCanvasCm(largeMmDesk);
    expect(fp.w).toBe(160);
    expect(fp.h).toBe(80);
  });

  it("enforces minimum screen ghost size", () => {
    const tiny: CatalogItem = { ...desk, widthMm: 2, heightMm: 2 };
    const screen = catalogDropScreenFootprint(null, tiny);
    expect(screen.w).toBeGreaterThanOrEqual(28);
    expect(screen.h).toBeGreaterThanOrEqual(20);
  });

  it("centers drop page point on item footprint", () => {
    const point = centeredCatalogDropPagePoint(null, 200, 100, desk);
    expect(point.x).toBe(200 - 120 / 2);
    expect(point.y).toBe(100 - 60 / 2);
  });

  it("hides native drag preview via transparent drag image", () => {
    const setDragImage = vi.fn();
    const event = {
      dataTransfer: { setDragImage },
    } as unknown as DragEvent;
    hideNativeDragPreview(event as never);
    expect(setDragImage).toHaveBeenCalledTimes(1);
    const [img, x, y] = setDragImage.mock.calls[0]!;
    expect(img).toBeInstanceOf(HTMLCanvasElement);
    expect(x).toBe(0);
    expect(y).toBe(0);
  });
});
