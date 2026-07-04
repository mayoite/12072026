import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ChairsLayoutDialog } from "@/features/planner/canvas-fabric/components/ChairsLayoutDialog";

function mockFabricCtor(name: string) {
  return vi.fn().mockImplementation(function MockFabric(this: Record<string, unknown>) {
    Object.assign(this, { fabricType: name });
    if (name === "Canvas") {
      this.setDimensions = vi.fn();
      this.clear = vi.fn();
      this.add = vi.fn();
      this.renderAll = vi.fn();
      this.dispose = vi.fn();
    } else if (name === "Group") {
      this.set = vi.fn();
      this.scale = vi.fn();
    }
  });
}

vi.mock("fabric", () => ({
  Canvas: mockFabricCtor("Canvas"),
  Group: mockFabricCtor("Group"),
}));

vi.mock("@/features/planner/canvas-fabric/models/furnishings", () => ({
  FURNISHINGS: {
    chairs: [
      { title: "Standard Chair" },
      { title: "Premium Chair" },
    ],
  },
}));

vi.mock("@/features/planner/canvas-fabric/lib/helpers", () => ({
  createShape: vi.fn().mockReturnValue({ width: 40, height: 40 }),
  RL_FILL: "fill",
  RL_STROKE: "stroke",
}));

vi.mock("@/features/planner/canvas-fabric/components/ZoomControl", () => ({
  ZoomControl: ({ zoom, onZoomChange }: any) => (
    <div data-testid="zoom-control">
      Zoom: {zoom}%
      <button onClick={() => onZoomChange(zoom + 10)}>Zoom In</button>
    </div>
  ),
}));

describe("ChairsLayoutDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null if not open", () => {
    const { container } = render(
      <ChairsLayoutDialog open={false} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders layout parameters and canvas element when open", async () => {
    await act(async () => {
      render(<ChairsLayoutDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Curved")).toBeInTheDocument();
    expect(screen.getByLabelText("Chairs per row")).toBeInTheDocument();
  });

  it("changes parameters and handles create and cancel actions", async () => {
    await act(async () => {
      render(<ChairsLayoutDialog open={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    });

    const createBtn = screen.getByText("Create");
    fireEvent.click(createBtn);

    expect(mockOnCreate).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
