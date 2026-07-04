import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { FloorplanCanvas } from "@/features/planner/canvas-fabric/FloorplanCanvas";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";
import { createFloorplanCanvasApi } from "@/features/planner/canvas-fabric/hooks/floorplanCanvas";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/hooks/floorplanCanvas", () => ({
  createFloorplanCanvasApi: vi.fn(),
}));

vi.mock("@/features/planner/store/workspaceStore", () => ({
  usePlannerWorkspaceStore: vi.fn(),
}));

describe("FloorplanCanvas", () => {
  const mockRegisterCanvasApi = vi.fn();
  const mockSetZoom = vi.fn();
  const mockSetLayerVisibility = vi.fn();
  const mockEditRoom = vi.fn();
  const mockEndEditRoom = vi.fn();
  const mockPushState = vi.fn();
  const mockSetStates = vi.fn();
  const mockSetRedoStates = vi.fn();
  const mockSetRoomEditStates = vi.fn();
  const mockSetRoomEditRedoStates = vi.fn();
  const mockSetSelections = vi.fn();
  const mockSetUngroupable = vi.fn();

  const mockApi = {
    init: vi.fn(),
    fitToContent: vi.fn().mockReturnValue(1),
    recalcOffset: vi.fn(),
    onKeyDown: vi.fn(),
    onKeyUp: vi.fn(),
    dispose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlannerWorkspaceStore).mockReturnValue({});
    vi.mocked(createFloorplanCanvasApi).mockReturnValue(mockApi as any);
  });

  const getMockApp = (overrides = {}) => ({
    roomEdit: false,
    zoom: 1,
    gridEnabled: true,
    snapEnabled: true,
    states: [],
    redoStates: [],
    roomEditStates: [],
    roomEditRedoStates: [],
    defaultChair: null,
    registerCanvasApi: mockRegisterCanvasApi,
    setZoom: mockSetZoom,
    setLayerVisibility: mockSetLayerVisibility,
    editRoom: mockEditRoom,
    endEditRoom: mockEndEditRoom,
    pushState: mockPushState,
    setStates: mockSetStates,
    setRedoStates: mockSetRedoStates,
    setRoomEditStates: mockSetRoomEditStates,
    setRoomEditRedoStates: mockSetRoomEditRedoStates,
    setSelections: mockSetSelections,
    setUngroupable: mockSetUngroupable,
    ...overrides,
  });

  it("registers canvas api and calls init on render", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);

    const { container } = render(<FloorplanCanvas />);

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(createFloorplanCanvasApi).toHaveBeenCalled();
    expect(mockApi.init).toHaveBeenCalled();
    expect(mockRegisterCanvasApi).toHaveBeenCalledWith(mockApi);
  });

  it("disposes canvas api on unmount", () => {
    vi.mocked(useFloorplan).mockReturnValue(getMockApp() as any);

    const { unmount } = render(<FloorplanCanvas />);
    unmount();

    expect(mockApi.dispose).toHaveBeenCalled();
    expect(mockRegisterCanvasApi).toHaveBeenLastCalledWith(null);
  });
});
