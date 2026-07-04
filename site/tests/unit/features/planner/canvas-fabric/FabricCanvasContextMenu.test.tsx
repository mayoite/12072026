import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FabricCanvasContextMenu } from "@/features/planner/canvas-fabric/FabricCanvasContextMenu";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

describe("FabricCanvasContextMenu", () => {
  const mockCloseContextMenu = vi.fn();
  const mockEndEditRoom = vi.fn();
  const mockClone = vi.fn();
  const mockCopy = vi.fn();
  const mockPaste = vi.fn();
  const mockDeleteSelection = vi.fn();
  const mockPerformOperation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null if contextMenu is null", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      contextMenu: null,
      closeContextMenu: mockCloseContextMenu,
      selections: [],
      roomEdit: false,
      endEditRoom: mockEndEditRoom,
      clone: mockClone,
      copy: mockCopy,
      paste: mockPaste,
      deleteSelection: mockDeleteSelection,
      performOperation: mockPerformOperation,
    } as any);

    const { container } = render(<FabricCanvasContextMenu />);
    expect(container.firstChild).toBeNull();
  });

  it("renders context menu correctly when contextMenu is active", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      contextMenu: { clientX: 100, clientY: 200, target: null },
      closeContextMenu: mockCloseContextMenu,
      selections: ["item-1"],
      roomEdit: false,
      endEditRoom: mockEndEditRoom,
      clone: mockClone,
      copy: mockCopy,
      paste: mockPaste,
      deleteSelection: mockDeleteSelection,
      performOperation: mockPerformOperation,
    } as any);

    render(<FabricCanvasContextMenu />);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(menu.style.left).toBe("100px");
    expect(menu.style.top).toBe("200px");

    // Click Duplicate
    const duplicateButton = screen.getByText("Duplicate");
    fireEvent.click(duplicateButton);
    expect(mockClone).toHaveBeenCalledTimes(1);
    expect(mockCloseContextMenu).toHaveBeenCalledTimes(1);
  });

  it("renders room edit actions when roomEdit is true", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      contextMenu: { clientX: 100, clientY: 200, target: null },
      closeContextMenu: mockCloseContextMenu,
      selections: ["item-1"],
      roomEdit: true,
      endEditRoom: mockEndEditRoom,
      clone: mockClone,
      copy: mockCopy,
      paste: mockPaste,
      deleteSelection: mockDeleteSelection,
      performOperation: mockPerformOperation,
    } as any);

    render(<FabricCanvasContextMenu />);

    const endEditButton = screen.getByText("End room edit");
    fireEvent.click(endEditButton);
    expect(mockEndEditRoom).toHaveBeenCalledTimes(1);
    expect(mockCloseContextMenu).toHaveBeenCalledTimes(1);
  });
});
