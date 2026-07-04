import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FloorplanProvider, useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

function ConsumerComponent() {
  const floorplan = useFloorplan();
  return (
    <div>
      <span data-testid="zoom-val">{floorplan.zoom}%</span>
      <span data-testid="tool-val">{floorplan.drawTool}</span>
      <button onClick={() => floorplan.setZoom(80)}>Set Zoom 80</button>
      <button onClick={() => floorplan.setDrawTool("rectangle")}>Set Draw Tool Rect</button>
      <button onClick={() => floorplan.registerCanvasApi(mockApi as any)}>Register API</button>
      <button onClick={() => floorplan.performOperation("UNDO")}>Undo Op</button>
    </div>
  );
}

const mockApi = {
  undo: vi.fn(),
  redo: vi.fn(),
  copy: vi.fn(),
  paste: vi.fn(),
  delete: vi.fn(),
  rotate: vi.fn(),
  group: vi.fn(),
  ungroup: vi.fn(),
  placeInCenter: vi.fn(),
  arrange: vi.fn(),
  setZoom: vi.fn(),
  setGridVisible: vi.fn(),
  exportState: vi.fn(),
  importState: vi.fn(),
  exportSvg: vi.fn(),
  exportPngBlob: vi.fn(),
  saveAs: vi.fn(),
  handleInsert: vi.fn(),
  editRoom: vi.fn(),
  cancelRoomEdition: vi.fn(),
  setDrawTool: vi.fn(),
  setDrawColor: vi.fn(),
  setDrawFillColor: vi.fn(),
  applyStrokeToSelection: vi.fn(),
  applyFillToSelection: vi.fn(),
  setContextMenuListener: vi.fn(),
  fitToStage: vi.fn(),
  fitToContent: vi.fn(),
  recalcOffset: vi.fn(),
  setLayerVisibility: vi.fn(),
  resizeObject: vi.fn(),
  setObjectRotation: vi.fn(),
  setObjectLock: vi.fn(),
  clientToSceneUnits: vi.fn(),
  setFloorPlanUnderlay: vi.fn(),
};

describe("FloorplanContext & Provider", () => {
  it("provides floorplan states and updates zoom and draw tools", () => {
    render(
      <FloorplanProvider>
        <ConsumerComponent />
      </FloorplanProvider>
    );

    expect(screen.getByTestId("zoom-val")).toHaveTextContent("100%");
    expect(screen.getByTestId("tool-val")).toHaveTextContent("select");

    // Update Zoom
    fireEvent.click(screen.getByText("Set Zoom 80"));
    expect(screen.getByTestId("zoom-val")).toHaveTextContent("80%");

    // Update Tool
    fireEvent.click(screen.getByText("Set Draw Tool Rect"));
    expect(screen.getByTestId("tool-val")).toHaveTextContent("rectangle");
  });

  it("calls registered canvas api methods when performing operations", () => {
    render(
      <FloorplanProvider>
        <ConsumerComponent />
      </FloorplanProvider>
    );

    // Register API
    fireEvent.click(screen.getByText("Register API"));
    expect(mockApi.setDrawTool).toHaveBeenCalled();

    // Call Undo Operation
    fireEvent.click(screen.getByText("Undo Op"));
    expect(mockApi.undo).toHaveBeenCalled();
  });
});
