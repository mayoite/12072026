import { describe, it, expect, vi } from "vitest";
import {
  createText,
  createBasicShape,
  createFurniture,
} from "@/features/planner/canvas-fabric/lib/helpers";

function mockFabricClass(name: string) {
  return vi.fn().mockImplementation(function MockFabric(this: Record<string, unknown>, ...args: unknown[]) {
    Object.assign(this, { fabricType: name, args });
    if (name === "IText") {
      this.t = args[0];
      this.opts = args[1];
    } else if (name === "Group") {
      this.items = args[0];
      this.opts = args[1];
    } else {
      this.opts = args[0];
    }
  });
}

vi.mock("fabric", () => ({
  Group: mockFabricClass("Group"),
  Rect: mockFabricClass("Rect"),
  Line: mockFabricClass("Line"),
  Circle: mockFabricClass("Circle"),
  Ellipse: mockFabricClass("Ellipse"),
  Path: mockFabricClass("Path"),
  Polygon: mockFabricClass("Polygon"),
  Polyline: mockFabricClass("Polyline"),
  Triangle: mockFabricClass("Triangle"),
  IText: mockFabricClass("IText"),
  Point: mockFabricClass("Point"),
  util: {
    degreesToRadians: vi.fn().mockReturnValue(0),
  },
}));

describe("helpers", () => {
  it("createText vertical join", () => {
    const textObj = createText({
      text: "ABC",
      direction: "VERTICAL",
      font_size: 14,
      name: "T1",
    }) as { t: string };
    expect(textObj.t).toBe("A\nB\nC");
  });

  it("createBasicShape rect", () => {
    const shape = createBasicShape({
      type: "rect",
      definition: { width: 100, height: 50 },
    }) as { opts: { width: number; fill: string } };
    expect(shape.opts.width).toBe(100);
    expect(shape.opts.fill).toBe("white");
  });

  it("createFurniture generic", () => {
    const generic = createFurniture("GENERIC", {
      title: "Table desk",
      width: 120,
      height: 60,
    }) as { name: string };
    expect(generic.name).toBe("GENERIC:Table desk");
  });
});
