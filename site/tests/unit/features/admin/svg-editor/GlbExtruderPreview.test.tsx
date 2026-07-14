import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

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
    parse = vi.fn(() => ({ paths: [] }));
    static createShapes = vi.fn(() => []);
  },
  GLTFExporter: class {
    parse = vi.fn();
  },
}));

describe("GlbExtruderPreview (name-mirror)", () => {
  afterEach(() => cleanup());

  it("shows empty UI for blank svg", async () => {
    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/GlbExtruderPreview"
    );
    render(<GlbExtruderPreview svgString="  " />);
    expect(screen.getByTestId("glb-extruder-empty")).toBeInTheDocument();
  });
});
