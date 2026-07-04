import { describe, it, expect, vi } from "vitest";
import {
  buildLayerManagerEntries,
  filterLayerManagerEntries,
  groupLayerManagerEntries,
  getNextLayerSelection,
  _summarizeLayerGroupSelection,
} from "@/features/planner/editor/layerManagerEntries";

vi.mock("@/features/planner/lib/calibrationScale", () => ({
  canvasUnitsToMillimeters: vi.fn().mockImplementation((val) => val * 10),
}));

vi.mock("@/features/planner/catalog/catalogBlockBridge", () => ({
  normalizeCatalogMm: vi.fn().mockImplementation((w, _d) => w),
  plannerCanvasUnits: vi.fn().mockImplementation((val) => val),
}));

describe("layerManagerEntries", () => {
  it("builds layer manager entries correctly", () => {
    const shapes = [
      { id: "shape-1", type: "planner-wall", isLocked: false, props: { startX: 0, startY: 0, endX: 10, endY: 0 } },
      { id: "shape-2", type: "planner-furniture", isLocked: true, props: { widthMm: 1200, heightMm: 600 } },
    ];

    const entries = buildLayerManagerEntries(shapes as any, ["shape-2"], "metric");

    expect(entries.length).toBe(2);
    expect(entries[0].id).toBe("shape-2"); // reversed order
    expect(entries[0].isLocked).toBe(true);
    expect(entries[0].isSelected).toBe(true);
  });

  it("groups layer manager entries by category", () => {
    const entries = [
      { id: "1", label: "Wall 1", category: "wall", typeLabel: "wall", detail: "", isLocked: false, isSelected: false },
      { id: "2", label: "Desk 1", category: "furniture", typeLabel: "furniture", detail: "", isLocked: false, isSelected: false },
    ];

    const groups = groupLayerManagerEntries(entries as any);
    expect(groups.length).toBe(2);
    expect(groups[0].category).toBe("wall");
    expect(groups[1].category).toBe("furniture");
  });

  it("filters entries by category or search query", () => {
    const entries = [
      { id: "1", label: "Big Wall", category: "wall", typeLabel: "wall", detail: "", isLocked: false, isSelected: false },
      { id: "2", label: "Nice Desk", category: "furniture", typeLabel: "furniture", detail: "", isLocked: false, isSelected: false },
    ];

    const filtered = filterLayerManagerEntries(entries as any, "wall", "Big");
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("1");
  });

  it("computes next layer selection correctly", () => {
    const current = ["1"];
    const ordered = ["1", "2", "3"];

    const nextSelection = getNextLayerSelection({
      anchorId: "1",
      clickedId: "3",
      currentIds: current,
      orderedIds: ordered,
      extendRange: true,
    });

    expect(nextSelection).toEqual(["1", "2", "3"]);
  });
});
