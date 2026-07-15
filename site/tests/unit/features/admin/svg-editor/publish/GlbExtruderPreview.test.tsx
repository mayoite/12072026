import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

vi.mock("three", () => {
  class Color {
    constructor(public hex: string) {}
  }
  class Scene {
    add = vi.fn();
  }
  class Group {
    add = vi.fn();
    traverse = vi.fn();
  }
  class MeshStandardMaterial {
    dispose = vi.fn();
  }
  class ExtrudeGeometry {
    scale = vi.fn();
    center = vi.fn();
    dispose = vi.fn();
  }
  class Mesh {
    constructor(
      public geometry: ExtrudeGeometry,
      public material: MeshStandardMaterial,
    ) {}
  }
  return {
    Color,
    Scene,
    Group,
    MeshStandardMaterial,
    ExtrudeGeometry,
    Mesh,
    DoubleSide: 2,
  };
});

vi.mock("three-stdlib", () => ({
  SVGLoader: class {
    parse = vi.fn(() => ({ paths: [{}] }));
    static createShapes = vi.fn(() => [{}]);
  },
  GLTFExporter: class {
    parse = vi.fn((_: unknown, onDone: (value: ArrayBuffer) => void) => {
      setTimeout(() => onDone(new ArrayBuffer(8)), 50);
    });
  },
}));

describe("GlbExtruderPreview (name-mirror)", () => {
  afterEach(() => cleanup());

  it("shows empty UI for blank svg", async () => {
    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/publish/GlbExtruderPreview"
    );
    render(<GlbExtruderPreview svgString="  " />);
    expect(screen.getByTestId("glb-extruder-empty")).toBeInTheDocument();
  });

  it("uses admin css instead of inline busy layout", async () => {
    const onGlbGenerated = vi.fn();
    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/publish/GlbExtruderPreview"
    );
    const { container } = render(
      <GlbExtruderPreview svgString="<svg><path d='M0 0 L10 0 L10 10 Z' /></svg>" onGlbGenerated={onGlbGenerated} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("glb-extruder-processing")).toBeInTheDocument();
    });

    expect(container.querySelector("[data-testid='glb-extruder-processing']")).not.toHaveAttribute("style");
  });
});
