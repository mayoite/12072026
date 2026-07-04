import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LayerVisibilityPanel, countShapesByLayer } from "@/features/planner/editor/LayerVisibilityPanel";
import { getPlannerFabricRuntimeState, subscribePlannerFabricRuntimeState } from "@/features/planner/canvas-fabric";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
  subscribePlannerFabricRuntimeState: vi.fn(),
}));

vi.mock("@/features/planner/store/workspaceStore", () => ({
  PLANNER_LAYER_CATEGORIES: ["walls", "rooms", "zones", "furniture", "measurements"],
  usePlannerWorkspaceStore: vi.fn(),
}));

describe("LayerVisibilityPanel", () => {
  const mockToggleLayer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMockStore = (overrides = {}) => ({
    layerVisible: {
      walls: true,
      rooms: true,
      zones: true,
      furniture: true,
      measurements: true,
    },
    toggleLayer: mockToggleLayer,
    ...overrides,
  });

  it("counts shapes correctly", () => {
    const shapes = [
      { type: "planner-wall" },
      { type: "planner-furniture" },
      { type: "planner-furniture" },
    ];
    const counts = countShapesByLayer(shapes);
    expect(counts.walls).toBe(1);
    expect(counts.furniture).toBe(2);
  });

  it("renders layers list and handles toggle click", () => {
    vi.mocked(usePlannerWorkspaceStore).mockImplementation((selector: any) =>
      selector(getMockStore())
    );
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      serializedDraft: JSON.stringify({
        objects: [{ name: "WALL:1" }],
      }),
    } as any);
    vi.mocked(subscribePlannerFabricRuntimeState).mockReturnValue(vi.fn());

    render(<LayerVisibilityPanel />);

    expect(screen.getByText("Walls & openings")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // count of walls

    const wallRow = screen.getByLabelText("Hide Walls & openings layer");
    fireEvent.click(wallRow);

    expect(mockToggleLayer).toHaveBeenCalledWith("walls");
  });
});
