import { describe, it, expect, vi } from "vitest";
import {
  shapeToInspectorData,
  readInspectorSelection,
  syncSelectionFromEditor,
  applyInspectorChanges,
} from "@/features/planner/editor/shapeInspectorBridge";
import {
  getPlannerFabricRuntime,
  getPlannerFabricRuntimeState,
  subscribePlannerFabricRuntimeState,
} from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntime: vi.fn(),
  getPlannerFabricRuntimeState: vi.fn(),
  subscribePlannerFabricRuntimeState: vi.fn(),
}));

describe("shapeInspectorBridge", () => {
  it("converts shape to inspector data", () => {
    const shape = {
      id: "shape-1",
      name: "GENERIC:Desk",
      width: 10,
      height: 20,
      scaleX: 1.5,
      scaleY: 1.2,
      angle: 45,
      stroke: "#FF0000",
    };

    const data = shapeToInspectorData(shape);
    expect(data).toEqual({
      id: "shape-1",
      type: "GENERIC",
      label: "Desk",
      // MM conversion: CU * scale * mmPerCanvasUnit (10)
      widthMm: 150,
      heightMm: 240,
      rotation: 45,
      isLocked: false,
      color: "#FF0000",
    });
  });

  it("reads inspector selection", () => {
    const mockState = {
      selections: [{ id: "shape-1", name: "GENERIC:Desk" }],
    };
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue(mockState as any);

    const selection = readInspectorSelection();
    expect(selection?.id).toBe("shape-1");
  });

  it("syncs selection change notifications", () => {
    const mockState = {
      selections: [{ id: "shape-1", name: "GENERIC:Desk" }],
    };
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue(mockState as any);

    const mockUnsub = vi.fn();
    vi.mocked(subscribePlannerFabricRuntimeState).mockReturnValue(mockUnsub);

    const mockCallback = vi.fn();
    const unsub = syncSelectionFromEditor(null, mockCallback);

    expect(mockCallback).toHaveBeenCalled();
    expect(unsub).toBe(mockUnsub);
  });

  it("applies inspector changes to runtime", () => {
    const mockResize = vi.fn();
    vi.mocked(getPlannerFabricRuntime).mockReturnValue({
      resizeObject: mockResize,
    } as any);

    const selectedShape = { id: "shape-1", name: "GENERIC:Desk", width: 10, height: 20 };
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [selectedShape],
    } as any);

    applyInspectorChanges(null, "shape-1", { widthMm: 1200, heightMm: 800 });
    expect(mockResize).toHaveBeenCalledWith("shape-1", 1200, 800);
  });
});
