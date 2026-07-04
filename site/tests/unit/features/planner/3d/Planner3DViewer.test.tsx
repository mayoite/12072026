import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Planner3DViewer, computePlanner3DSceneMetrics } from "@/features/planner/3d/Planner3DViewer";

// Mock R3F and Drei
vi.mock("@react-three/fiber", () => {
  return {
    Canvas: ({ onCreated }: any) => {
      React.useEffect(() => {
        onCreated?.({
          gl: {
            forceContextLoss: vi.fn(),
            dispose: vi.fn(),
            getContext: () => ({
              drawingBufferWidth: 100,
              drawingBufferHeight: 100,
              RGBA: 1,
              UNSIGNED_BYTE: 1,
              readPixels: (
                _x: number,
                _y: number,
                _w: number,
                _h: number,
                _format: any,
                _type: any,
                pixels: Uint8Array
              ) => {
                pixels[0] = 255; // trigger luma reported
              },
            }),
          },
        });
      }, [onCreated]);
      return <div data-testid="mock-three-canvas" />;
    },
    useThree: () => ({
      gl: {
        getContext: () => ({
          drawingBufferWidth: 100,
          drawingBufferHeight: 100,
          RGBA: 1,
          UNSIGNED_BYTE: 1,
          readPixels: (
            _x: number,
            _y: number,
            _w: number,
            _h: number,
            _format: any,
            _type: any,
            pixels: Uint8Array
          ) => {
            pixels[0] = 255;
          },
        }),
      },
    }),
    useFrame: vi.fn(),
    addAfterEffect: vi.fn((callback) => {
      callback();
      return () => {};
    }),
  };
});

vi.mock("@react-three/drei", () => ({
  ContactShadows: ({ children }: any) => <div data-testid="contact-shadows">{children}</div>,
  Html: ({ children, position }: any) => (
    <div data-testid="html-overlay" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
  OrbitControls: React.forwardRef((_props, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      target: { x: 0, y: 0, z: 0, set: vi.fn() },
      update: vi.fn(),
    }));
    return <div data-testid="orbit-controls" />;
  }),
  PerspectiveCamera: React.forwardRef((_props, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      position: { x: 0, y: 0, z: 0, set: vi.fn() },
      lookAt: vi.fn(),
      quaternion: { setFromEuler: vi.fn() },
    }));
    return <div data-testid="perspective-camera" />;
  }),
}));

vi.mock("@/lib/errorLogger", () => ({
  logClientError: vi.fn().mockResolvedValue(undefined),
}));

describe("Planner3DViewer", () => {
  const mockDocument: any = {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Standard Office Layout",
    projectName: "Office Relocation",
    clientName: "Acme Corp",
    roomWidthMm: 8000,
    roomDepthMm: 6000,
    sceneJson: {
      room: {
        widthMm: 8000,
        depthMm: 6000,
        wallHeightMm: 2400,
        wallThicknessMm: 150,
        floorThicknessMm: 50,
      },
      items: [
        {
          id: "item-1",
          name: "Manager Desk",
          category: "desks",
          centerMm: { xMm: 2000, yMm: 3000 },
          sizeMm: { widthMm: 1600, depthMm: 800, heightMm: 750 },
        },
      ],
    },
  };

  let getContextSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, "getContext");
  });

  afterEach(() => {
    getContextSpy.mockRestore();
  });

  it("computes scene metrics correctly", () => {
    const sceneDoc = {
      id: "test",
      title: "Test Scene",
      room: {
        widthMm: 8000,
        depthMm: 6000,
        wallHeightMm: 2400,
        wallThicknessMm: 150,
        floorThicknessMm: 50,
      },
      items: [
        {
          id: "item-1",
          name: "Desk",
          category: "desks",
          centerMm: { xMm: 2000, yMm: 3000 },
          sizeMm: { widthMm: 1600, depthMm: 800, heightMm: 750 },
        },
      ],
    };
    const metrics = computePlanner3DSceneMetrics(sceneDoc);
    expect(metrics.roomHeightWorld).toBe(2.4);
    expect(metrics.cameraFar).toBeGreaterThan(0);
    expect(metrics.target).toBeDefined();
  });

  it("renders 3D unavailable fallback if WebGL context creation fails", () => {
    getContextSpy.mockReturnValue(null);

    render(<Planner3DViewer document={mockDocument} />);

    expect(screen.getByTestId("planner-3d-fallback")).toBeInTheDocument();
    expect(screen.getByText("3D unavailable")).toBeInTheDocument();
    expect(screen.getByTestId("planner-3d-renderer")).toHaveTextContent("Fallback mode");
  });

  it("renders 3D Canvas when WebGL is available", () => {
    getContextSpy.mockImplementation((contextId) => {
      if (contextId === "webgl" || contextId === "webgl2") {
        return {
          getExtension: vi.fn().mockReturnValue({ UNMASKED_RENDERER_WEBGL: 1 }),
          getParameter: vi.fn().mockReturnValue("GeForce RTX"),
        } as any;
      }
      return null;
    });

    render(<Planner3DViewer document={mockDocument} />);

    expect(screen.getByTestId("planner-3d-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("mock-three-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("planner-3d-renderer")).toHaveTextContent("WEBGL2 · GeForce RTX");
  });

  it("toggles camera mode between Orbit and Walk", () => {
    getContextSpy.mockImplementation((contextId) => {
      if (contextId === "webgl" || contextId === "webgl2") {
        return {
          getExtension: vi.fn().mockReturnValue({ UNMASKED_RENDERER_WEBGL: 1 }),
          getParameter: vi.fn().mockReturnValue("GeForce RTX"),
        } as any;
      }
      return null;
    });

    render(<Planner3DViewer document={mockDocument} />);

    const walkButton = screen.getByRole("button", { name: /Walk/i });
    const orbitButton = screen.getByRole("button", { name: /Orbit/i });

    expect(orbitButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(walkButton);
    expect(walkButton).toHaveAttribute("aria-pressed", "true");
    expect(orbitButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(orbitButton);
    expect(orbitButton).toHaveAttribute("aria-pressed", "true");
  });

  it("displays warnings for empty mapped scene when no items exist", () => {
    getContextSpy.mockReturnValue(null); // use fallback wrapper for ease
    const emptyDoc = {
      ...mockDocument,
      sceneJson: {
        room: mockDocument.sceneJson.room,
        items: [],
      },
    };

    render(<Planner3DViewer document={emptyDoc} />);
    expect(screen.getByText("Empty mapped scene")).toBeInTheDocument();
  });
});
