import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertiesInspector } from "@/features/planner/editor/inspector/PropertiesInspector";
import { useFloorplan } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  useFloorplan: vi.fn().mockReturnValue({
    deleteSelection: vi.fn(),
    setObjectLock: vi.fn(),
    setObjectRotation: vi.fn(),
  }),
}));

vi.mock("@/features/planner/editor/shapeInspectorBridge", () => ({
  applyInspectorChanges: vi.fn(),
  readInspectorSelection: vi.fn().mockReturnValue(null),
  syncSelectionFromEditor: vi.fn().mockImplementation((_editor, onChange) => {
    onChange({
      id: "shape-1",
      label: "My Office Table",
      type: "Desk",
      widthMm: 1200,
      heightMm: 800,
      rotation: 90,
      isLocked: false,
    });
    return vi.fn();
  }),
}));

describe("PropertiesInspector", () => {
  it("renders selected shape property details", () => {
    render(<PropertiesInspector step="review" />);

    expect(screen.getByText("My Office Table")).toBeInTheDocument();
    expect(screen.getByText("Desk")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteBtn);
    expect(useFloorplan().deleteSelection).toHaveBeenCalled();
  });
});
