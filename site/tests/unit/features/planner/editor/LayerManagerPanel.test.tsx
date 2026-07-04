import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LayerManagerPanel } from "@/features/planner/editor/LayerManagerPanel";
import { getPlannerFabricRuntimeState, subscribePlannerFabricRuntimeState } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
  subscribePlannerFabricRuntimeState: vi.fn(),
}));

describe("LayerManagerPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when there are no rows", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [],
      serializedDraft: null,
    } as any);
    vi.mocked(subscribePlannerFabricRuntimeState).mockReturnValue(vi.fn());

    render(<LayerManagerPanel unitSystem="metric" />);

    expect(screen.getByText("No canvas objects yet (metric units).")).toBeInTheDocument();
  });

  it("renders list of rows from serializedDraft", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      selections: [{ name: "GENERIC:Table" }],
      serializedDraft: JSON.stringify({
        objects: [
          { name: "GENERIC:Table" },
        ],
      }),
    } as any);
    vi.mocked(subscribePlannerFabricRuntimeState).mockReturnValue(vi.fn());

    render(<LayerManagerPanel unitSystem="metric" />);

    expect(screen.getByText("Table")).toBeInTheDocument();
    expect(screen.getByText("GENERIC")).toBeInTheDocument();
  });
});
