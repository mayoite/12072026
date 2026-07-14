import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const parseMock = vi.fn();
const createShapesMock = vi.fn();
const parseExportMock = vi.fn();

vi.mock("three", () => {
  class Color {
    constructor(public hex: string) {}
  }
  class Scene {
    add = vi.fn();
  }
  class Group {
    add = vi.fn();
    traverse = vi.fn((cb: (o: unknown) => void) => {
      // no meshes in mock tree
      void cb;
    });
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
    geometry: ExtrudeGeometry;
    material: MeshStandardMaterial;
    constructor(geometry: ExtrudeGeometry, material: MeshStandardMaterial) {
      this.geometry = geometry;
      this.material = material;
    }
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

vi.mock("three-stdlib", () => {
  class SVGLoader {
    parse = parseMock;
    static createShapes = createShapesMock;
  }
  class GLTFExporter {
    parse = parseExportMock;
  }
  return { SVGLoader, GLTFExporter };
});

describe("GlbExtruderPreview", () => {
  afterEach(() => {
    cleanup();
    parseMock.mockReset();
    createShapesMock.mockReset();
    parseExportMock.mockReset();
  });

  it("shows empty admin UI when svgString is blank", async () => {
    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/GlbExtruderPreview"
    );

    render(<GlbExtruderPreview svgString="  " />);

    expect(screen.getByTestId("glb-extruder-empty")).toBeInTheDocument();
    expect(screen.getByText(/No SVG loaded/i)).toBeInTheDocument();
  });

  it("extrudes SVG paths and calls onGlbGenerated with a GLB blob", async () => {
    const fakeShape = {};
    parseMock.mockReturnValue({ paths: [{ id: "p1" }] });
    createShapesMock.mockReturnValue([fakeShape]);
    parseExportMock.mockImplementation(
      (
        _scene: unknown,
        onDone: (gltf: ArrayBuffer) => void,
        _onError: (e: Error) => void,
        options: { binary?: boolean },
      ) => {
        expect(options.binary).toBe(true);
        onDone(new ArrayBuffer(8));
      },
    );

    const onGlbGenerated = vi.fn();
    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/GlbExtruderPreview"
    );

    render(
      <GlbExtruderPreview
        svgString={'<svg><path d="M0 0 L10 0 L10 10 Z"/></svg>'}
        onGlbGenerated={onGlbGenerated}
      />,
    );

    await waitFor(() => {
      expect(onGlbGenerated).toHaveBeenCalledTimes(1);
    });

    const blob = onGlbGenerated.mock.calls[0][0] as Blob;
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("model/gltf-binary");

    await waitFor(() => {
      expect(screen.getByTestId("glb-extruder-ready")).toBeInTheDocument();
    });
  });

  it("shows admin error when SVG has no paths", async () => {
    parseMock.mockReturnValue({ paths: [] });

    const { GlbExtruderPreview } = await import(
      "@/features/admin/svg-editor/GlbExtruderPreview"
    );

    render(
      <GlbExtruderPreview svgString="<svg></svg>" onGlbGenerated={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("glb-extruder-error")).toBeInTheDocument();
    });

    expect(screen.getByText(/Extrusion failed/i)).toBeInTheDocument();
    expect(screen.getByText(/No drawable paths/i)).toBeInTheDocument();
  });

  it("keeps three off the static import graph (SSR-safe)", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    let source: string;
    try {
      source = await fs.readFile(
        path.resolve(process.cwd(), "features/admin/svg-editor/GlbExtruderPreview.tsx"),
        "utf8",
      );
    } catch {
      source = await fs.readFile(
        path.resolve(
          process.cwd(),
          "site/features/admin/svg-editor/GlbExtruderPreview.tsx",
        ),
        "utf8",
      );
    }

    expect(source).not.toMatch(/import\s+\*\s+as\s+THREE\s+from\s+["']three["']/);
    expect(source).not.toMatch(/from\s+["']three-stdlib["']/);
    expect(source).toMatch(/import\(["']three["']\)/);
    expect(source).toMatch(/import\(["']three-stdlib["']\)/);
  });
});
