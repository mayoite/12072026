import { describe, it, expect, vi, beforeEach } from "vitest";
import { wireFabricDrawTools } from "@/features/planner/canvas-fabric/hooks/fabricDrawTools";
import { Point } from "fabric";

function mockFabricCtor(name: string) {
  return vi.fn().mockImplementation(function MockFabric(this: Record<string, unknown>, ...args: unknown[]) {
    Object.assign(this, { fabricType: name, args });
    if (name === "Point" && args.length >= 2) {
      this.x = args[0];
      this.y = args[1];
    } else if (name === "Line") {
      this.pts = args[0];
      this.opts = args[1];
      this.set = vi.fn();
    } else if (name === "PencilBrush") {
      this.view = args[0];
    } else {
      this.opts = args[0];
      this.set = vi.fn();
    }
  });
}

vi.mock("fabric", () => ({
  Point: mockFabricCtor("Point"),
  Line: mockFabricCtor("Line"),
  Rect: mockFabricCtor("Rect"),
  Path: mockFabricCtor("Path"),
  FabricText: mockFabricCtor("FabricText"),
  Group: mockFabricCtor("Group"),
  PencilBrush: mockFabricCtor("PencilBrush"),
}));

describe("fabricDrawTools", () => {
  let mockCanvas: any;
  let listeners: Record<string, (...args: unknown[]) => unknown>;

  beforeEach(() => {
    vi.clearAllMocks();
    listeners = {};
    mockCanvas = {
      on: vi.fn().mockImplementation((event, callback) => {
        listeners[event] = callback;
      }),
      remove: vi.fn(),
      add: vi.fn(),
      requestRenderAll: vi.fn(),
      setActiveObject: vi.fn(),
      discardActiveObject: vi.fn(),
      relativePan: vi.fn(),
    };
  });

  it("wires draw tools and sets up event listeners on canvas", () => {
    const options = {
      getView: () => mockCanvas,
      getScenePointer: vi.fn().mockReturnValue(new Point(10, 20)),
      getDrawTool: () => "select" as any,
      getDrawColor: () => "var(--color-black)",
      getDrawFillColor: () => "transparent",
      roomEditActive: () => false,
      saveState: vi.fn(),
    };

    const tools = wireFabricDrawTools(options);
    expect(mockCanvas.on).toHaveBeenCalledWith("mouse:down", expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith("mouse:move", expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith("mouse:up", expect.any(Function));

    tools.dispose();
  });

  it("returns a dispose function", () => {
    const options = {
      getView: () => mockCanvas,
      getScenePointer: vi.fn().mockReturnValue(new Point(0, 0)),
      getDrawTool: () => "select" as any,
      getDrawColor: () => "var(--color-black)",
      getDrawFillColor: () => "transparent",
      roomEditActive: () => false,
      saveState: vi.fn(),
    };

    const tools = wireFabricDrawTools(options);
    expect(tools.dispose).toBeTypeOf("function");
    expect(() => tools.dispose()).not.toThrow();
  });
});
