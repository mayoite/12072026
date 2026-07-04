import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as helpersType0 from "@/features/planner/canvas-fabric/lib/helpers";
import { createFloorplanCanvasApi } from "@/features/planner/canvas-fabric/hooks/floorplanCanvas";

function mockFabricCtor(name: string) {
  return vi.fn().mockImplementation(function MockFabric(this: Record<string, unknown>, ...args: unknown[]) {
    Object.assign(this, { fabricType: name, args });
    if (name === "Canvas") {
      this.on = vi.fn();
      this.calcOffset = vi.fn();
      this.getWidth = vi.fn().mockReturnValue(1000);
      this.getHeight = vi.fn().mockReturnValue(800);
      this.getZoom = vi.fn().mockReturnValue(1);
      this.setDimensions = vi.fn();
      this.setViewportTransform = vi.fn();
      this.viewportTransform = [1, 0, 0, 1, 0, 0];
      this.requestRenderAll = vi.fn();
      this.getObjects = vi.fn().mockReturnValue([]);
      this.discardActiveObject = vi.fn();
      this.toDatalessJSON = vi.fn().mockReturnValue({});
      this.clear = vi.fn();
    } else if (name === "Point" && args.length >= 2) {
      this.x = args[0];
      this.y = args[1];
    }
  });
}

vi.mock("fabric", () => ({
  Canvas: mockFabricCtor("Canvas"),
  Pattern: mockFabricCtor("Pattern"),
  Point: mockFabricCtor("Point"),
}));

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/lib/helpers", async (importOriginal) => {
  const actual = await importOriginal<typeof helpersType0>();
  return {
    ...actual,
    createFurniture: vi.fn(),
  };
});

vi.mock("@/features/planner/canvas-fabric/hooks/fabricDrawTools", () => ({
  wireFabricDrawTools: vi.fn().mockReturnValue({
    applyCanvasMode: vi.fn(),
    setDrawTool: vi.fn(),
    setDrawColor: vi.fn(),
    setDrawFillColor: vi.fn(),
    dispose: vi.fn(),
  }),
}));

describe("floorplanCanvas API factory", () => {
  const mockCtxRef = {
    current: {
      roomEdit: false,
      zoom: 100,
      gridEnabled: true,
      snapEnabled: true,
      states: [],
      redoStates: [],
      roomEditStates: [],
      roomEditRedoStates: [],
      defaultChair: {},
      setSelections: vi.fn(),
      setUngroupable: vi.fn(),
      pushState: vi.fn(),
      setStates: vi.fn(),
      setRedoStates: vi.fn(),
      setRoomEditStates: vi.fn(),
      setRoomEditRedoStates: vi.fn(),
      enterRoomEdit: vi.fn(),
      exitRoomEdit: vi.fn(),
      syncZoom: vi.fn(),
    },
  };

  let canvasEl: HTMLCanvasElement;

  beforeEach(() => {
    vi.clearAllMocks();
    canvasEl = document.createElement("canvas");
    canvasEl.closest = vi.fn().mockReturnValue({
      clientWidth: 1200,
      clientHeight: 900,
    });
  });

  it("can initialize floorplan canvas api", () => {
    const api = createFloorplanCanvasApi(mockCtxRef, canvasEl);
    api.init();

    expect(mockCtxRef.current.pushState).toHaveBeenCalled();
  });

  it("handles key events correctly", () => {
    const api = createFloorplanCanvasApi(mockCtxRef, canvasEl);
    api.init();

    const ev = new KeyboardEvent("keydown", { key: "Delete" });
    api.onKeyDown(ev);

    const evUp = new KeyboardEvent("keyup", { key: "Control" });
    api.onKeyUp(evUp);
  });
});
