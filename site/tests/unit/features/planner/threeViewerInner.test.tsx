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
  const OrbitControlsCtor = vi.fn(function MockOrbitControls(
    this: {
      enableDamping: boolean;
      dampingFactor: number;
      target: { set: ReturnType<typeof vi.fn> };
      maxPolarAngle: number;
      minDistance: number;
      maxDistance: number;
      update: ReturnType<typeof vi.fn>;
      dispose: ReturnType<typeof vi.fn>;
    },
  ) {
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
    // Non-deprecated Three shadow filter (PCFSoftShadowMap logs deprecation).
    PCFShadowMap: "PCFShadowMap",
    PCFSoftShadowMap: "PCFSoftShadowMap",
    DoubleSide: "DoubleSide",
  };
});

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
    Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, value: 800 });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 600 });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows loading state then mounts the WebGL container", async () => {
    const onReady = vi.fn();
    const { container: _container } = render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner backgroundColor="#fafafa" onReady={onReady} enableShadows={false} />
      </div>,
    );

    expect(screen.getByText("Initializing 3D...")).toBeInTheDocument();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
      expect(renderCalls).toHaveBeenCalled();
    });

    expect(screen.getByTestId("three-viewer-container")).toBeInTheDocument();
  });

  it("renders an error panel when scene initialization fails", async () => {
    forceWebGLError.current = true;

    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner />
      </div>,
    );

    await waitFor(() => {
      expect(screen.getByText("3D Viewer Error")).toBeInTheDocument();
      expect(screen.getByText("WebGL init failed")).toBeInTheDocument();
    });
  });

  it("disposes renderer and scene resources on unmount", async () => {
    const { unmount } = render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows backgroundColor="#fff" />
      </div>,
    );

    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
    });

    unmount();
    expect(disposeCalls).toHaveBeenCalled();
    expect(geometryDispose).toHaveBeenCalled();
    expect(materialDispose).toHaveBeenCalled();
  });

  it("renders with shadow maps enabled and without an onReady callback", async () => {
    let resizeHandler: (() => void) | undefined;
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "resize") {
        resizeHandler = handler as () => void;
      }
    });

    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows backgroundColor="#000000" />
      </div>,
    );

    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
    });

    resizeHandler?.();
    expect(renderCalls).toHaveBeenCalled();
  });

  it("enableShadows uses PCFShadowMap (not deprecated PCFSoftShadowMap)", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows backgroundColor="#ffffff" />
      </div>,
    );

    await waitFor(() => {
      expect(rendererInstances.length).toBeGreaterThan(0);
      expect(renderCalls).toHaveBeenCalled();
    });

    const shadowMap = rendererInstances[rendererInstances.length - 1]?.shadowMap;
    expect(shadowMap).toBeDefined();
    expect(shadowMap?.enabled).toBe(true);
    // Contract: PCFSoftShadowMap is deprecated in current Three and spams console.
    expect(shadowMap?.type).toBe("PCFShadowMap");
    expect(shadowMap?.type).not.toBe("PCFSoftShadowMap");
  });

  it("does not enable shadow maps when enableShadows is false", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} backgroundColor="#ffffff" />
      </div>,
    );

    await waitFor(() => {
      expect(rendererInstances.length).toBeGreaterThan(0);
      expect(renderCalls).toHaveBeenCalled();
    });

    const shadowMap = rendererInstances[rendererInstances.length - 1]?.shadowMap;
    expect(shadowMap?.enabled).toBe(false);
    expect(shadowMap?.type).toBeUndefined();
  });

  it("cancels Three.js loading when unmounted early", async () => {
    const { unmount } = render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner />
      </div>,
    );
    unmount();
    expect(screen.queryByText("Initializing 3D...")).not.toBeInTheDocument();
  });
});
