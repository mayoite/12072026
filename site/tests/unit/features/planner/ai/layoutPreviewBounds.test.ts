import { describe, it, expect, vi } from "vitest";
import { buildLayoutPreviewModel } from "@/features/planner/ai/layoutPreviewBounds";

vi.mock("@/features/planner/catalog-api/workspaceCatalog", () => ({
  PLANNER_CATALOG_ITEMS: [
    { id: "sku-chair", widthMm: 500, heightMm: 500 },
    { id: "sku-desk", widthMm: 1200, heightMm: 600 },
  ],
}));

vi.mock("@/features/planner/catalog-api/catalogBlockBridge", () => ({
  plannerCanvasUnits: (mm: number) => mm / 10,
}));

describe("buildLayoutPreviewModel", () => {
  it("should compile layout preview model correctly with room, zones, furniture, and walls", () => {
    const mockLayout = {
      room: {
        x: 0,
        y: 0,
        widthMm: 4000,
        depthMm: 3000,
      },
      zones: [
        {
          x: 10,
          y: 20,
          widthMm: 1000,
          heightMm: 1000,
          label: "Meeting",
          zoneType: "meeting",
        },
      ],
      furniture: [
        {
          x: 50,
          y: 50,
          label: "Chair 1",
          catalogItemId: "sku-chair",
        },
        {
          x: 100,
          y: 100,
          label: "Unknown Item",
          catalogItemId: "unknown-sku",
        },
      ],
      walls: [
        {
          x: 0,
          y: 0,
          endX: 100,
          endY: 0,
        },
      ],
    };

    const model = buildLayoutPreviewModel(mockLayout as any);

    // Verify room
    expect(model.room).toEqual({
      x: 0,
      y: 0,
      w: 400,
      h: 300,
    });

    // Verify zone
    expect(model.zones).toEqual([
      {
        x: 10,
        y: 20,
        w: 100,
        h: 100,
        label: "Meeting",
        zoneType: "meeting",
      },
    ]);

    // Verify furniture (known vs unknown catalog item size)
    expect(model.furniture).toEqual([
      {
        x: 50,
        y: 50,
        w: 50,
        h: 50,
        label: "Chair 1",
        catalogItemId: "sku-chair",
      },
      {
        x: 100,
        y: 100,
        w: 12, // Default fallback width (120 mm to canvas units)
        h: 6,  // Default fallback height (60 mm to canvas units)
        label: "Unknown Item",
        catalogItemId: "unknown-sku",
      },
    ]);

    // Verify walls
    expect(model.walls).toEqual([
      {
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 0,
      },
    ]);

    // Bounds should include all elements plus padding
    expect(model.bounds.w).toBeGreaterThan(model.room.w);
    expect(model.bounds.h).toBeGreaterThan(model.room.h);
  });
});
