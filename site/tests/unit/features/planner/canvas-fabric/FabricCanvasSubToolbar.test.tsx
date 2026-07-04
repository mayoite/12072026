import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FabricCanvasSubToolbar } from "@/features/planner/canvas-fabric/FabricCanvasSubToolbar";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/FabricDrawToolsBar", () => ({
  FabricDrawToolsBar: () => <div data-testid="fabric-draw-tools-bar" />,
}));

vi.mock("@/features/planner/ui/PlannerTooltip", () => ({
  PlannerTooltip: ({ children }: any) => <>{children}</>,
}));

vi.mock("@phosphor-icons/react", () => ({
  Copy: () => <span />,
  Trash: () => <span />,
  ArrowArcLeft: () => <span />,
  ArrowArcRight: () => <span />,
  ArrowCounterClockwise: () => <span />,
  ArrowClockwise: () => <span />,
  Intersect: () => <span />,
  Exclude: () => <span />,
  DownloadSimple: () => <span />,
}));

describe("FabricCanvasSubToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  const getMockApp = (overrides = {}) => ({
    roomEdit: false,
    selections: [],
    states: [{}],
    redoStates: [],
    roomEditStates: [{}],
    roomEditRedoStates: [],
    snapEnabled: false,
    gridEnabled: false,
    ungroupable: false,
    undo: vi.fn(),
    redo: vi.fn(),
    clone: vi.fn(),
    deleteSelection: vi.fn(),
    rotateClockWise: vi.fn(),
    rotateAntiClockWise: vi.fn(),
    group: vi.fn(),
    ungroup: vi.fn(),
    toggleSnap: vi.fn(),
    toggleGrid: vi.fn(),
    endEditRoom: vi.fn(),
    exportDraft: vi.fn(),
    arrange: vi.fn(),
    placeInCenter: vi.fn(),
    ...overrides,
  });

  it("renders loader/placeholder during initialization", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    const { container } = render(<FabricCanvasSubToolbar />);
    expect(container.querySelector(".pw-subtopbar")).toHaveAttribute("aria-hidden");
  });

  it("renders full toolbar after initialization timer", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricCanvasSubToolbar />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("fabric-draw-tools-bar")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders room edit mode layout when roomEdit is active", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp({ roomEdit: true }) as any);
    render(<FabricCanvasSubToolbar />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByTestId("fabric-draw-tools-bar")).not.toBeInTheDocument();
    expect(screen.getByText("End room edit")).toBeInTheDocument();
  });

  it("calls appropriate floorplan functions on button clicks", () => {
    const mockApp = getMockApp({ selections: ["item-1"] });
    vi.mocked(useFloorplan).mockReturnValue(mockApp as any);

    render(<FabricCanvasSubToolbar />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const cloneButton = screen.getByLabelText("Clone");
    fireEvent.click(cloneButton);
    expect(mockApp.clone).toHaveBeenCalledTimes(1);

    const deleteButton = screen.getByLabelText("Delete");
    fireEvent.click(deleteButton);
    expect(mockApp.deleteSelection).toHaveBeenCalledTimes(1);
  });
});
