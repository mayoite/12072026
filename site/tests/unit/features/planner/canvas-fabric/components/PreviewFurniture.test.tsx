import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PreviewFurniture } from "@/features/planner/canvas-fabric/components/PreviewFurniture";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";

function mockFabricCtor(name: string) {
  return vi.fn().mockImplementation(function MockFabric(this: Record<string, unknown>) {
    Object.assign(this, { fabricType: name });
    if (name === "Canvas") {
      this.setDimensions = vi.fn();
      this.clear = vi.fn();
      this.add = vi.fn();
      this.renderAll = vi.fn();
      this.dispose = vi.fn();
    }
  });
}

vi.mock("fabric", () => ({
  Canvas: mockFabricCtor("Canvas"),
}));

vi.mock("@/features/planner/canvas-fabric/context/FloorplanContext", () => ({
  useFloorplan: vi.fn(),
}));

vi.mock("@/features/planner/canvas-fabric/lib/helpers", () => ({
  createFurniture: vi.fn().mockReturnValue({
    left: 0,
    top: 0,
    selectable: true,
    hoverCursor: "default",
  }),
  RL_PREVIEW_WIDTH: 100,
  RL_PREVIEW_HEIGHT: 100,
}));

describe("PreviewFurniture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders canvas element and initializes preview", () => {
    vi.mocked(useFloorplan).mockReturnValue({
      defaultChair: {},
    } as any);

    const { container } = render(
      <PreviewFurniture type="CHAIR" furniture={{ title: "Test Chair" }} />
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
