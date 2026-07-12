import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Lazy3DViewer,
  isWebGLSupported,
  isDeviceCapable,
  checkCanLoad3D,
} from "@/features/planner/3d/ThreeLazyViewer";

vi.mock("three", () => {
  class MockWebGLRenderer {
    domElement = document.createElement("canvas");
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
  }

  return {
    Scene: vi.fn(() => ({ add: vi.fn() })),
    PerspectiveCamera: vi.fn(() => ({ position: { set: vi.fn() }, lookAt: vi.fn() })),
    WebGLRenderer: MockWebGLRenderer,
    AmbientLight: vi.fn(),
    DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() }, castShadow: false })),
    Color: vi.fn(),
    BoxGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Mesh: vi.fn(),
  };
});

describe("three-lazy capability checks", () => {
  it("reports WebGL and device capability", () => {
    expect(typeof isWebGLSupported()).toBe("boolean");
    expect(typeof isDeviceCapable()).toBe("boolean");

    const check = checkCanLoad3D();
    expect(check).toHaveProperty("canLoad");
    expect(Array.isArray(check.reasons)).toBe(true);
  });
});

describe("Lazy3DViewer", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("lazy-loads the inner viewer and calls onReady", async () => {
    const onReady = vi.fn();
    const project = {
      id: "project-3d",
      name: "3D Demo",
      floors: [
        {
          id: "floor-1",
          name: "Ground",
          level: 0,
          walls: [],
          doors: [],
          windows: [],
          furniture: [],
          rooms: [],
          measurements: [],
          annotations: [],
          textAnnotations: [],
          groups: [],
          stairs: [],
          columns: [],
          guides: [],
        },
      ],
    };

    render(
      <Lazy3DViewer
        projectData={project}
        onReady={onReady}
        loadingMessage="Preparing 3D scene"
        backgroundColor="#eee"
      />,
    );

    expect(screen.getByText("Preparing 3D scene")).toBeInTheDocument();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
    });
  });
});
