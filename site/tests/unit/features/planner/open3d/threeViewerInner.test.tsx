import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThreeViewerInner } from "@/features/planner/open3d/3d/ThreeViewerInner";

const {
  renderCalls,
  disposeCalls,
  geometryDispose,
  materialDispose,
  forceWebGLError,
} = vi.hoisted(() => ({
  renderCalls: vi.fn(),
  disposeCalls: vi.fn(),
  geometryDispose: vi.fn(),
  materialDispose: vi.fn(),
  forceWebGLError: { current: false },
}));

vi.mock("three", () => {
  class MockMesh {
    geometry = { dispose: geometryDispose };
    material = { dispose: materialDispose };
    rotation = { x: 0, y: 0, z: 0 };
    receiveShadow = false;
  }

  class MockScene {
    background: unknown = null;
    private readonly children: MockMesh[] = [];
    add = vi.fn((object: MockMesh) => {
      this.children.push(object);
    });
    traverse = vi.fn((callback: (object: MockMesh) => void) => {
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
    shadowMap = { enabled: false, type: undefined };
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = renderCalls;
    dispose = disposeCalls;

    constructor() {
      if (forceWebGLError.current) {
        throw new Error("WebGL init failed");
      }
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
    PerspectiveCamera: MockPerspectiveCamera,
    WebGLRenderer: MockWebGLRenderer,
    AmbientLight: vi.fn(),
    DirectionalLight: MockDirectionalLight,
    GridHelper: vi.fn(),
    PlaneGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Mesh: MockMesh,
    Color: vi.fn(),
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
    const { container } = render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner backgroundColor="#fafafa" onReady={onReady} enableShadows={false} />
      </div>,
    );

    expect(screen.getByText("Initializing 3D...")).toBeInTheDocument();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
      expect(renderCalls).toHaveBeenCalled();
    });

    expect(container.querySelector("div[style*='min-height: 400px']")).toBeTruthy();
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
