import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThreeViewerInner } from "@/features/planner/3d/ThreeViewerInner";

const {
  renderCalls,
  disposeCalls,
  geometryDispose,
  materialDispose,
  forceWebGLError,
  OrbitControlsCtor,
  rendererInstances,
} = vi.hoisted(() => {
  const OrbitControlsCtor = vi.fn(function MockOrbitControls(this: {
    enableDamping: boolean;
    dampingFactor: number;
    target: { set: ReturnType<typeof vi.fn> };
    maxPolarAngle: number;
    minDistance: number;
    maxDistance: number;
    update: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  }) {
    this.enableDamping = false;
    this.dampingFactor = 0;
    this.target = { set: vi.fn() };
    this.maxPolarAngle = 0;
    this.minDistance = 0;
    this.maxDistance = 0;
    this.update = vi.fn();
    this.dispose = vi.fn();
  });
  return {
    renderCalls: vi.fn(),
    disposeCalls: vi.fn(),
    geometryDispose: vi.fn(),
    materialDispose: vi.fn(),
    forceWebGLError: { current: false },
    OrbitControlsCtor,
    rendererInstances: [] as Array<{
      shadowMap: { enabled: boolean; type: unknown };
      dispose: ReturnType<typeof vi.fn>;
    }>,
  };
});

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: OrbitControlsCtor,
}));

vi.mock("three", () => {
  class MockMesh {
    geometry = { dispose: geometryDispose };
    material = { dispose: materialDispose };
    rotation = { x: 0, y: 0, z: 0 };
    position = { set: vi.fn(), x: 0, y: 0, z: 0 };
    receiveShadow = false;
    castShadow = false;
    name = "";
    userData: Record<string, unknown> = {};
  }

  class MockGroup {
    name = "";
    children: unknown[] = [];
    position = { set: vi.fn(), x: 0, y: 0, z: 0 };
    rotation = { y: 0 };
    userData: Record<string, unknown> = {};
    add = vi.fn((object: unknown) => {
      this.children.push(object);
    });
    remove = vi.fn((object: unknown) => {
      this.children = this.children.filter((c) => c !== object);
    });
    traverse = vi.fn((callback: (object: unknown) => void) => {
      for (const child of this.children) {
        callback(child);
      }
    });
  }

  class MockScene {
    background: unknown = null;
    private readonly children: unknown[] = [];
    add = vi.fn((object: unknown) => {
      this.children.push(object);
    });
    traverse = vi.fn((callback: (object: unknown) => void) => {
      for (const child of this.children) {
        callback(child);
      }
    });
  }

  class MockPerspectiveCamera {
    position = { set: vi.fn() };
    aspect = 1;
    lookAt = vi.fn();
    updateProjectionMatrix = vi.fn();
  }

  class MockWebGLRenderer {
    domElement = document.createElement("canvas");
    shadowMap = { enabled: false, type: undefined as unknown };
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = renderCalls;
    dispose = disposeCalls;

    constructor() {
      if (forceWebGLError.current) {
        throw new Error("WebGL init failed");
      }
      rendererInstances.push(this);
    }
  }

  class MockDirectionalLight {
    position = { set: vi.fn() };
    castShadow = false;
    shadow = { mapSize: { width: 0, height: 0 } };
  }

  return {
    __esModule: true,
    Scene: MockScene,
    Group: MockGroup,
    PerspectiveCamera: MockPerspectiveCamera,
    WebGLRenderer: MockWebGLRenderer,
    AmbientLight: vi.fn(),
    DirectionalLight: MockDirectionalLight,
    GridHelper: vi.fn(),
    PlaneGeometry: vi.fn(),
    BoxGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Mesh: MockMesh,
    Color: vi.fn(),
    PCFShadowMap: "PCFShadowMap",
    PCFSoftShadowMap: "PCFSoftShadowMap",
    DoubleSide: "DoubleSide",
  };
});

const emptyProject = {
  id: "p1",
  name: "Inner",
  floors: [
    {
      id: "f1",
      name: "G",
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

describe("ThreeViewerInner", () => {
  beforeEach(() => {
    forceWebGLError.current = false;
    renderCalls.mockClear();
    disposeCalls.mockClear();
    geometryDispose.mockClear();
    materialDispose.mockClear();
    OrbitControlsCtor.mockClear();
    rendererInstances.length = 0;
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    vi.spyOn(window, "addEventListener").mockImplementation(() => undefined);
    vi.spyOn(window, "removeEventListener").mockImplementation(() => undefined);
    Object.defineProperty(window, "devicePixelRatio", {
      value: 1,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("mounts with orbit controls enabled by default", async () => {
    const onReady = vi.fn();
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner
          projectData={emptyProject}
          enableControls={true}
          onReady={onReady}
          enableShadows={false}
        />
      </div>,
    );

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(OrbitControlsCtor).toHaveBeenCalled();
    });
  });

  it("renders without project data and reports ready", async () => {
    const onReady = vi.fn();
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner onReady={onReady} enableShadows={false} />
      </div>,
    );

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
    });
    expect(screen.getByTestId("three-viewer-container")).toBeInTheDocument();
  });
});
