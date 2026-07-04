import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractCanvasPlacements } from "@/features/planner/ai/extractCanvasPlacements";
import { getPlannerFabricRuntimeState, parseFabricObjects } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
  parseFabricObjects: vi.fn(),
}));

describe("extractCanvasPlacements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array if no objects", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({ serializedDraft: "{}" } as any);
    vi.mocked(parseFabricObjects).mockReturnValue([]);

    const result = extractCanvasPlacements();
    expect(result).toEqual([]);
  });

  it("should extract chair placement", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({ serializedDraft: "{}" } as any);
    vi.mocked(parseFabricObjects).mockReturnValue([
      {
        id: "chair-1",
        name: "CHAIR:Ergonomic",
        left: 10,
        top: 20,
        width: 50,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        catalogId: "sku-chair",
      },
    ]);

    const result = extractCanvasPlacements();
    expect(result).toEqual([
      {
        shapeId: "chair-1",
        kind: "chair",
        label: "Ergonomic",
        widthMm: 500,
        heightMm: 500,
        catalogItemId: "sku-chair",
      },
    ]);
  });

  it("should extract storage placement", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({ serializedDraft: "{}" } as any);
    vi.mocked(parseFabricObjects).mockReturnValue([
      {
        id: "storage-1",
        name: "MISCELLANEOUS:Storage Cabinet",
        left: 10,
        top: 20,
        width: 100,
        height: 50,
        scaleX: 1.5,
        scaleY: 1.2,
      },
    ]);

    const result = extractCanvasPlacements();
    expect(result).toEqual([
      {
        shapeId: "storage-1",
        kind: "storage",
        label: "Storage Cabinet",
        widthMm: 1500,
        heightMm: 600,
        catalogItemId: undefined,
      },
    ]);
  });

  it("should filter out non-furniture items like wall or group", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({ serializedDraft: "{}" } as any);
    vi.mocked(parseFabricObjects).mockReturnValue([
      {
        id: "wall-1",
        name: "WALL:Inner",
        left: 10,
        top: 20,
        width: 100,
        height: 10,
      },
      {
        id: "chair-1",
        name: "CHAIR:Task",
        left: 10,
        top: 20,
        width: 50,
        height: 50,
      },
    ]);

    const result = extractCanvasPlacements();
    expect(result).toEqual([
      {
        shapeId: "chair-1",
        kind: "chair",
        label: "Task",
        widthMm: 500,
        heightMm: 500,
        catalogItemId: undefined,
      },
    ]);
  });
});
