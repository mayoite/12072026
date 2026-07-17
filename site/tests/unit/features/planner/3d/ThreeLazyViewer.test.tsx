import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Lazy3DViewer,
  isWebGLSupported,
  isDeviceCapable,
  checkCanLoad3D,
  PLANNER_ORBIT_DEFAULT_ENABLED,
} from "@/features/planner/3d/ThreeLazyViewer";

vi.mock("three", () => {
  class MockWebGLRenderer {
    domElement = document.createElement("canvas");
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
    shadowMap = { enabled: false, type: 0 };
  }
  class MockScene {
    add = vi.fn();
    background: unknown = null;
    traverse = vi.fn();
  }
  class MockCamera {
    position = { set: vi.fn() };
    lookAt = vi.fn();
    aspect = 1;
    updateProjectionMatrix = vi.fn();
  }
  class MockLight {
    position = { set: vi.fn() };
    castShadow = false;
    shadow = { mapSize: { width: 0, height: 0 } };
  }
  class MockObject3D {
    children: unknown[] = [];
    name = "";
    add = vi.fn();
    remove = vi.fn();
    traverse = vi.fn();
  }
  class MockMesh extends MockObject3D {
    geometry = { dispose: vi.fn() };
    material = { dispose: vi.fn() };
    rotation = { x: 0 };
    receiveShadow = false;
  }

  return {
    Scene: MockScene,
    PerspectiveCamera: MockCamera,
    WebGLRenderer: MockWebGLRenderer,
    AmbientLight: MockLight,
    DirectionalLight: MockLight,
    Color: class {
      constructor(_hex?: string | number) {}
    },
    BoxGeometry: class {},
    PlaneGeometry: class {},
    GridHelper: class extends MockObject3D {},
    Group: MockObject3D,
    MeshStandardMaterial: class {},
    Mesh: MockMesh,
    DoubleSide: 2,
    PCFShadowMap: 1,
  };
});

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: class {
    enableDamping = true;
    dampingFactor = 0;
    target = { set: vi.fn() };
    maxPolarAngle = 0;
    minDistance = 0;
    maxDistance = 0;
    update = vi.fn();
    dispose = vi.fn();
  },
}));

describe("ThreeLazyViewer", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("exports capability checks and orbit default", () => {
    expect(typeof isWebGLSupported()).toBe("boolean");
    expect(typeof isDeviceCapable()).toBe("boolean");
    expect(checkCanLoad3D()).toHaveProperty("canLoad");
    expect(PLANNER_ORBIT_DEFAULT_ENABLED).toBe(true);
  });

  it("lazy-loads viewer and calls onReady", async () => {
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
      />,
    );

    expect(screen.getByText("Preparing 3D scene")).toBeInTheDocument();
    // Suite load can delay React.lazy + dynamic three import past the 1s waitFor default.
    await waitFor(
      () => {
        expect(onReady).toHaveBeenCalled();
      },
      { timeout: 10_000 },
    );
  }, 15_000);
});
