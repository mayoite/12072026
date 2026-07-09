/**
 * W4 orbit three-layer contract:
 * 1) enableControls defaults ON (Lazy + Inner)
 * 2) product helper forces enableControls: true for workspace
 * 3) OrbitControls constructed when enabled; data-orbit-enabled attribute
 *
 * Furniture document rotation remains degrees (normalizeDegrees) — not part of
 * this file's scope beyond noting the contract stays intact.
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "@/features/planner/open3d/3d/orbitDefaults";
import { ThreeViewerInner } from "@/features/planner/open3d/3d/ThreeViewerInner";
import { normalizeDegrees } from "@/features/planner/open3d/model/units";

const {
  renderCalls,
  disposeCalls,
  geometryDispose,
  materialDispose,
  OrbitControlsCtor,
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
    OrbitControlsCtor,
  };
});

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
    shadowMap = { enabled: false, type: undefined };
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = renderCalls;
    dispose = disposeCalls;
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
    PCFSoftShadowMap: "PCFSoftShadowMap",
    DoubleSide: "DoubleSide",
  };
});

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: OrbitControlsCtor,
}));

describe("orbitControlsDefault — product helper / prop contract", () => {
  it("OPEN3D_ORBIT_DEFAULT_ENABLED is true", () => {
    expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
  });

  it("getOpen3dViewerControlProps forces enableControls: true", () => {
    const props = getOpen3dViewerControlProps();
    expect(props).toEqual({ enableControls: true });
    expect(props.enableControls).toBe(OPEN3D_ORBIT_DEFAULT_ENABLED);
  });

  it("furniture document rotation stays degrees via normalizeDegrees", () => {
    // Document model contract (W4 expert pass): degrees, not radians.
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(90)).toBe(90);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(-90)).toBe(270);
  });
});

describe("orbitControlsDefault — ThreeViewerInner construct + data-orbit-enabled", () => {
  beforeEach(() => {
    OrbitControlsCtor.mockClear();
    renderCalls.mockClear();
    disposeCalls.mockClear();
    geometryDispose.mockClear();
    materialDispose.mockClear();
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

  it("omitted enableControls (default ON) constructs OrbitControls and sets data-orbit-enabled=true", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} />
      </div>,
    );

    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
      expect(OrbitControlsCtor).toHaveBeenCalledTimes(1);
    });

    const container = screen.getByTestId("three-viewer-container");
    await waitFor(() => {
      expect(container.getAttribute("data-orbit-enabled")).toBe("true");
    });
  });

  it("enableControls={false} does not construct OrbitControls and sets data-orbit-enabled=false", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} enableControls={false} />
      </div>,
    );

    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
    });

    // Allow async setup to settle without constructing orbit.
    await waitFor(() => {
      const container = screen.getByTestId("three-viewer-container");
      expect(container.getAttribute("data-orbit-enabled")).toBe("false");
    });
    expect(OrbitControlsCtor).not.toHaveBeenCalled();
  });

  it("enableControls={true} explicit construct + data-orbit-enabled=true", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} enableControls={true} />
      </div>,
    );

    await waitFor(() => {
      expect(OrbitControlsCtor).toHaveBeenCalledTimes(1);
    });

    const container = screen.getByTestId("three-viewer-container");
    await waitFor(() => {
      expect(container.getAttribute("data-orbit-enabled")).toBe("true");
    });
  });
});
