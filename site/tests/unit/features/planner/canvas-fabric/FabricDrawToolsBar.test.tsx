import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FabricDrawToolsBar } from "@/features/planner/canvas-fabric/FabricDrawToolsBar";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";
import { usePlannerStore } from "@/features/planner/store/plannerStore";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/store/plannerStore", () => ({
  usePlannerStore: vi.fn(),
}));

vi.mock("@/features/planner/ui/PlannerTooltip", () => ({
  PlannerTooltip: ({ children }: any) => <>{children}</>,
}));

vi.mock("@phosphor-icons/react", () => ({
  Cursor: () => <span />,
  Hand: () => <span />,
  Minus: () => <span />,
  Ruler: () => <span />,
  BezierCurve: () => <span />,
  Square: () => <span />,
  PencilSimple: () => <span />,
  Eraser: () => <span />,
  Palette: () => <span />,
  PaintBucket: () => <span />,
}));

describe("FabricDrawToolsBar", () => {
  const mockSetDrawTool = vi.fn();
  const mockSetDrawColor = vi.fn();
  const mockSetDrawFillColor = vi.fn();
  const mockSetPlannerTool = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlannerStore).mockReturnValue(mockSetPlannerTool);
  });

  const getMockApp = (overrides = {}) => ({
    drawTool: "select",
    drawColor: "var(--color-black)",
    drawFillColor: "transparent",
    setDrawTool: mockSetDrawTool,
    setDrawColor: mockSetDrawColor,
    setDrawFillColor: mockSetDrawFillColor,
    ...overrides,
  });

  it("renders draw tools correctly", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricDrawToolsBar />);

    expect(screen.getByLabelText("Select")).toBeInTheDocument();
    expect(screen.getByLabelText("Rectangle")).toBeInTheDocument();
  });

  it("selects a draw tool and updates planner tool", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricDrawToolsBar />);

    const rectButton = screen.getByLabelText("Rectangle");
    fireEvent.click(rectButton);

    expect(mockSetDrawTool).toHaveBeenCalledWith("rectangle");
    expect(mockSetPlannerTool).toHaveBeenCalled();
  });

  it("sets draw colors correctly", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricDrawToolsBar />);

    // Presets color swatches
    const swatch = screen.getAllByRole("button", { name: /Use color/i })[0];
    fireEvent.click(swatch);
    expect(mockSetDrawColor).toHaveBeenCalled();
  });
});
