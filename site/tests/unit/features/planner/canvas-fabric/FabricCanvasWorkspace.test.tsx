import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FabricCanvasWorkspace } from "@/features/planner/canvas-fabric/FabricCanvasWorkspace";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/FloorplanCanvas", () => ({
  FloorplanCanvas: () => <div data-testid="floorplan-canvas" />,
}));

vi.mock("@/features/planner/canvas-fabric/FabricCanvasContextMenu", () => ({
  FabricCanvasContextMenu: () => <div data-testid="context-menu" />,
}));

describe("FabricCanvasWorkspace", () => {
  it("renders correctly with screen reader labels", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      selections: [{ name: "CHAIR:Ergonomic Chair" }],
    } as any);

    render(<FabricCanvasWorkspace />);

    // Verify sub-components render
    expect(screen.getByTestId("floorplan-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu")).toBeInTheDocument();

    // Verify aria announcement
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Selected: Ergonomic Chair");

    // Verify application section
    const section = screen.getByRole("application");
    expect(section).toHaveAttribute("aria-label", "Floor plan: 1 object selected");
  });

  it("renders with default label if no selections", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      selections: [],
    } as any);

    render(<FabricCanvasWorkspace />);

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("");

    const section = screen.getByRole("application");
    expect(section).toHaveAttribute("aria-label", "Floor plan canvas");
  });
});
