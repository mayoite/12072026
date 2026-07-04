import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FabricLibraryPanel } from "@/features/planner/canvas-fabric/FabricLibraryPanel";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/models/furnishings", () => ({
  FURNISHINGS: {
    doors: [{ title: "Single Door" }],
    windows: [{ title: "Slider Window" }],
    tables: [{ title: "Standard Desk" }],
    chairs: [{ title: "Task Chair" }],
    miscellaneous: [{ title: "Filing Cabinet" }],
  },
}));

vi.mock("@/features/planner/canvas-fabric/components/PreviewFurniture", () => ({
  PreviewFurniture: () => <div data-testid="preview-furniture" />,
}));

vi.mock("@/features/planner/canvas-fabric/components/ChairsLayoutDialog", () => ({
  ChairsLayoutDialog: ({ open, onClose }: any) =>
    open ? (
      <div data-testid="chairs-dialog">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("FabricLibraryPanel", () => {
  const mockSetDefaultChair = vi.fn();
  const mockInsertObject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMockApp = (overrides = {}) => ({
    roomEdit: false,
    setDefaultChair: mockSetDefaultChair,
    insertObject: mockInsertObject,
    ...overrides,
  });

  it("initializes default chair and renders categories", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricLibraryPanel />);

    expect(mockSetDefaultChair).toHaveBeenCalledWith({ title: "Task Chair" });
    expect(screen.getByRole("tab", { name: "Doors" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Windows" })).toBeInTheDocument();
  });

  it("switches categories and inserts item on click", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricLibraryPanel />);

    // Click "Windows" tab
    const windowsTab = screen.getByRole("tab", { name: "Windows" });
    fireEvent.click(windowsTab);

    // Verify Slider Window is rendered
    const itemButton = screen.getByText("Slider Window");
    expect(itemButton).toBeInTheDocument();

    // Click item to insert
    fireEvent.click(itemButton);
    expect(mockInsertObject).toHaveBeenCalledWith({
      type: "WINDOW",
      object: { title: "Slider Window" },
    });
  });

  it("submits the text tool form to insert text", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricLibraryPanel />);

    const textTab = screen.getByRole("tab", { name: "Text" });
    fireEvent.click(textTab);

    const input = screen.getByLabelText("Text");
    fireEvent.change(input, { target: { value: "Hello World" } });

    const submitBtn = screen.getByText("Add text");
    fireEvent.click(submitBtn);

    expect(mockInsertObject).toHaveBeenCalledWith({
      type: "TEXT",
      object: {
        text: "Hello World",
        font_size: 16,
        direction: "HORIZONTAL",
        name: "TEXT:Text",
      },
    });
  });

  it("opens chairs layout dialog from advanced tab", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);
    render(<FabricLibraryPanel />);

    const advancedTab = screen.getByRole("tab", { name: "Advanced" });
    fireEvent.click(advancedTab);

    const layoutChairsBtn = screen.getByText("Layout chairs");
    fireEvent.click(layoutChairsBtn);

    expect(screen.getByTestId("chairs-dialog")).toBeInTheDocument();
  });
});
