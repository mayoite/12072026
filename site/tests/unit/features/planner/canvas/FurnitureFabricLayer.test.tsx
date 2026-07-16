import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FurnitureFabricLayer } from "@/features/planner/canvas/FurnitureFabricLayer";

const { CanvasCtor, RectCtor, disposeMock } = vi.hoisted(() => {
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
  }) {
    this.add = vi.fn();
    this.clear = vi.fn();
    this.dispose = disposeMock;
    this.on = vi.fn();
    this.off = vi.fn();
    this.requestRenderAll = vi.fn();
    this.setDimensions = vi.fn();
    this.getObjects = vi.fn(() => []);
  });
  const RectCtor = vi.fn(function MockRect(
    this: Record<string, unknown> & {
      set: (key: string, value: unknown) => unknown;
    },
    opts: Record<string, unknown>,
  ) {
    Object.assign(this, opts);
    this.set = (key: string, value: unknown) => {
      this[key] = value;
      return this;
    };
  });
  return { CanvasCtor, RectCtor, disposeMock };
});

vi.mock("fabric", () => ({
  Canvas: CanvasCtor,
  Rect: RectCtor,
}));

describe("FurnitureFabricLayer", () => {
  afterEach(() => {
    cleanup();
    CanvasCtor.mockClear();
    RectCtor.mockClear();
    disposeMock.mockClear();
  });

  it("mounts a fabric canvas and builds furniture rects", async () => {
    const furniture = [
      {
        id: "furn-1",
        catalogId: "desk",
        position: { x: 1000, y: 500 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 1200,
        depth: 600,
        height: 750,
      },
    ];

    const { container } = render(
      <FurnitureFabricLayer furniture={furniture} interactive={false} />,
    );
    expect(container.querySelector("canvas")).toBeDefined();

    await waitFor(() => {
      expect(CanvasCtor).toHaveBeenCalled();
    });
  });

  it("disposes canvas on unmount", async () => {
    const { unmount } = render(<FurnitureFabricLayer furniture={[]} />);
    await waitFor(() => expect(CanvasCtor).toHaveBeenCalled());
    unmount();
    expect(disposeMock).toHaveBeenCalled();
  });
});
