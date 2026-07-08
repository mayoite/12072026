import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RoomPresetsModal } from "@/features/planner/canvas-fabric/RoomPresetsModal";

vi.mock("@phosphor-icons/react", () => ({
  LayoutGrid: () => <span />,
  X: () => <span />,
}));

vi.mock("@/features/planner/canvas-fabric/models/furnishings", () => ({
  FURNISHINGS: {
    rooms: [
      { title: "Standard Office", width: 200, height: 150 },
      { title: "Conference Room", width: 300, height: 200 },
    ],
  },
}));

describe("RoomPresetsModal", () => {
  const mockOnClose = vi.fn();
  const mockOnApply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null if not open", () => {
    const { container } = render(
      <RoomPresetsModal open={false} onClose={mockOnClose} onApply={mockOnApply} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders preset cards and titles when open", () => {
    render(<RoomPresetsModal open={true} onClose={mockOnClose} onApply={mockOnApply} />);

    expect(screen.getByText("Room presets")).toBeInTheDocument();
    expect(screen.getByText("Standard Office")).toBeInTheDocument();
    expect(screen.getByText("Conference Room")).toBeInTheDocument();
  });

  it("calls onApply and onClose when clicking a room preset", () => {
    render(<RoomPresetsModal open={true} onClose={mockOnClose} onApply={mockOnApply} />);

    const standardOfficeBtn = screen.getByText("Standard Office");
    fireEvent.click(standardOfficeBtn);

    expect(mockOnApply).toHaveBeenCalledWith({
      title: "Standard Office",
      width: 200,
      height: 150,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking close button or backdrop", () => {
    render(<RoomPresetsModal open={true} onClose={mockOnClose} onApply={mockOnApply} />);

    const closeBtn = screen.getByLabelText("Close");
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByLabelText("Close dialog");
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
