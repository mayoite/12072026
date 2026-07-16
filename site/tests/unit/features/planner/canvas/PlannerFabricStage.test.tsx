import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerFabricStage } from "@/features/planner/canvas/PlannerFabricStage";

const { CanvasCtor, disposeMock } = vi.hoisted(() => {
  const disposeMock = vi.fn();
  const CanvasCtor = vi.fn(function MockCanvas(this: {
    add: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    requestRenderAll: ReturnType<typeof vi.fn>;
    setDimensions: ReturnType<typeof vi.fn>;
    getObjects: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    selection: boolean;
    defaultCursor: string;
    hoverCursor: string;
    skipTargetFind: boolean;
  }) {
    this.add = vi.fn();
    this.clear = vi.fn();
    this.dispose = disposeMock;
    this.on = vi.fn();
    this.off = vi.fn();
    this.requestRenderAll = vi.fn();
    this.setDimensions = vi.fn();
    this.getObjects = vi.fn(() => []);
    this.remove = vi.fn();
    this.selection = false;
    this.defaultCursor = "default";
    this.hoverCursor = "move";
    this.skipTargetFind = false;
  });
  return { CanvasCtor, disposeMock };
});

vi.mock("fabric", () => ({
  Canvas: CanvasCtor,
  Line: vi.fn(function MockLine(this: Record<string, unknown>, ...args: unknown[]) {
    this.args = args;
  }),
  Rect: vi.fn(),
  Group: vi.fn(),
  FabricObject: class {},
}));

describe("PlannerFabricStage", () => {
  afterEach(() => {
    cleanup();
    CanvasCtor.mockClear();
    disposeMock.mockClear();
  });

  it("mounts the production fabric stage shell", async () => {
    const { container } = render(<PlannerFabricStage />);
    expect(container.firstChild).toBeDefined();
    await waitFor(() => {
      expect(CanvasCtor).toHaveBeenCalled();
    });
  });

  it("accepts controlled tool and status callback without throwing", async () => {
    render(
      <PlannerFabricStage
        activeTool="select"
        onStatusChange={vi.fn()}
      />,
    );
    await waitFor(() => expect(CanvasCtor).toHaveBeenCalled());
  });
});
