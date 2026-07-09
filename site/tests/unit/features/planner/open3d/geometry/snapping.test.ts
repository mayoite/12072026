import { describe, expect, it } from "vitest";

import {
  projectToScreen,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
  type CanvasTransform,
} from "@/features/planner/open3d/lib/geometry/snapping";

describe("projectToScreen / screenToProject", () => {
  it("round-trips project mm through screen space", () => {
    const transform: CanvasTransform = { origin: { x: -4000, y: -2500 }, scale: 0.1 };
    const project = { x: 1500.25, y: -800.5 };
    const screen = projectToScreen(project, transform);
    expect(screen.x).toBeCloseTo((1500.25 - -4000) * 0.1, 8);
    expect(screen.y).toBeCloseTo((-800.5 - -2500) * 0.1, 8);
    const back = screenToProject(screen, transform);
    expect(back.x).toBeCloseTo(project.x, 8);
    expect(back.y).toBeCloseTo(project.y, 8);
  });

  it("maps origin to (0,0) screen and inverse", () => {
    const transform: CanvasTransform = { origin: { x: 100, y: 200 }, scale: 2 };
    expect(projectToScreen({ x: 100, y: 200 }, transform)).toEqual({ x: 0, y: 0 });
    expect(screenToProject({ x: 0, y: 0 }, transform)).toEqual({ x: 100, y: 200 });
  });
});

describe("zoomTransformAt anchor invariance", () => {
  it("keeps the world point under the cursor fixed after zoom in/out", () => {
    const transform: CanvasTransform = { origin: { x: -4000, y: -2500 }, scale: 0.1 };
    const screenPoint = { x: 320, y: 240 };
    const worldBefore = screenToProject(screenPoint, transform);

    const zoomedIn = zoomTransformAt(transform, screenPoint, 1.25);
    const worldAfterIn = screenToProject(screenPoint, zoomedIn);
    expect(worldAfterIn.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfterIn.y).toBeCloseTo(worldBefore.y, 8);
    expect(zoomedIn.scale).toBeCloseTo(0.125, 8);

    const zoomedOut = zoomTransformAt(zoomedIn, screenPoint, 0.8);
    const worldAfterOut = screenToProject(screenPoint, zoomedOut);
    expect(worldAfterOut.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfterOut.y).toBeCloseTo(worldBefore.y, 8);
  });

  it("preserves anchor across projectToScreen / screenToProject after zoom clamp", () => {
    const transform: CanvasTransform = { origin: { x: 10, y: 20 }, scale: 2 };
    const screenPoint = { x: 100, y: 50 };
    const world = screenToProject(screenPoint, transform);

    // factor that would exceed maximumScale (2) — clamps scale, still anchors.
    const clamped = zoomTransformAt(transform, screenPoint, 100);
    expect(clamped.scale).toBe(2);
    const worldAfterClamp = screenToProject(screenPoint, clamped);
    expect(worldAfterClamp.x).toBeCloseTo(world.x, 8);
    expect(worldAfterClamp.y).toBeCloseTo(world.y, 8);

    // Round-trip world point through screen after a non-clamp zoom.
    const zoomed = zoomTransformAt(transform, screenPoint, 0.5);
    expect(zoomed.scale).toBe(1);
    const screenOfWorld = projectToScreen(world, zoomed);
    expect(screenOfWorld.x).toBeCloseTo(screenPoint.x, 8);
    expect(screenOfWorld.y).toBeCloseTo(screenPoint.y, 8);
  });

  it("clamps to minimumScale while keeping the cursor world point fixed", () => {
    const transform: CanvasTransform = { origin: { x: 0, y: 0 }, scale: 0.05 };
    const screenPoint = { x: 40, y: 60 };
    const worldBefore = screenToProject(screenPoint, transform);
    const zoomed = zoomTransformAt(transform, screenPoint, 0.001);
    expect(zoomed.scale).toBe(0.02);
    const worldAfter = screenToProject(screenPoint, zoomed);
    expect(worldAfter.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfter.y).toBeCloseTo(worldBefore.y, 8);
  });

  it("honours custom min/max scale bounds", () => {
    const transform: CanvasTransform = { origin: { x: 0, y: 0 }, scale: 1 };
    const screenPoint = { x: 10, y: 10 };
    const up = zoomTransformAt(transform, screenPoint, 10, 0.5, 1.5);
    expect(up.scale).toBe(1.5);
    const down = zoomTransformAt(transform, screenPoint, 0.01, 0.5, 1.5);
    expect(down.scale).toBe(0.5);
  });
});

describe("snapDrawingPoint", () => {
  it("returns raw point when suppress is true", () => {
    const raw = { x: 123, y: 456 };
    expect(
      snapDrawingPoint({
        raw,
        start: null,
        endpoints: [{ x: 0, y: 0 }],
        zoom: 1,
        suppress: true,
      }),
    ).toEqual({ point: raw, kind: "none" });
  });

  it("snaps to nearest endpoint within screen tolerance converted by zoom", () => {
    // toleranceMm = 12 / zoom → zoom 0.1 → 120mm; endpoint at 50mm is in range
    const result = snapDrawingPoint({
      raw: { x: 50, y: 0 },
      start: null,
      endpoints: [{ x: 0, y: 0 }, { x: 1000, y: 0 }],
      zoom: 0.1,
      suppress: false,
    });
    expect(result).toEqual({ point: { x: 0, y: 0 }, kind: "endpoint" });
  });

  it("exposes targetId when endpointTargets are provided", () => {
    const result = snapDrawingPoint({
      raw: { x: 3, y: 0 },
      start: null,
      endpoints: [],
      endpointTargets: [
        { id: "wall-a-start", point: { x: 0, y: 0 } },
        { id: "wall-b-end", point: { x: 10, y: 0 } },
      ],
      zoom: 1,
      suppress: false,
      screenTolerancePx: 20,
    });
    expect(result).toEqual({
      point: { x: 0, y: 0 },
      kind: "endpoint",
      targetId: "wall-a-start",
    });
  });

  it("grid-snaps when no start and no endpoint is in range", () => {
    const result = snapDrawingPoint({
      raw: { x: 106, y: 94 },
      start: null,
      endpoints: [],
      zoom: 1,
      suppress: false,
      gridMm: 50,
    });
    expect(result).toEqual({ point: { x: 100, y: 100 }, kind: "grid" });
  });

  it("grid-snaps when start equals grid point (zero length)", () => {
    const result = snapDrawingPoint({
      raw: { x: 0, y: 0 },
      start: { x: 0, y: 0 },
      endpoints: [],
      zoom: 1,
      suppress: false,
      gridMm: 100,
    });
    expect(result).toEqual({ point: { x: 0, y: 0 }, kind: "grid" });
  });

  it("angle-snaps to 45° steps from start when drawing", () => {
    // raw near (100, 60) → grid (100, 100) with default 100mm? wait raw 100,60 → grid 100,100
    // length from start (0,0) to (100,100) → 45° angle snap stays on diagonal
    const result = snapDrawingPoint({
      raw: { x: 100, y: 60 },
      start: { x: 0, y: 0 },
      endpoints: [],
      zoom: 1,
      suppress: false,
      gridMm: 100,
    });
    expect(result.kind).toBe("angle");
    // atan2 of (100,100) is π/4; length = √(100²+100²)
    const length = Math.hypot(100, 100);
    expect(result.point.x).toBeCloseTo(Math.cos(Math.PI / 4) * length, 8);
    expect(result.point.y).toBeCloseTo(Math.sin(Math.PI / 4) * length, 8);
  });

  it("angle-snaps horizontal when dy is small relative to dx after grid", () => {
    const result = snapDrawingPoint({
      raw: { x: 250, y: 10 },
      start: { x: 0, y: 0 },
      endpoints: [],
      zoom: 1,
      suppress: false,
      gridMm: 100,
    });
    expect(result.kind).toBe("angle");
    // grid → (300, 0); angle 0 → pure +x of length 300
    expect(result.point.x).toBeCloseTo(300, 8);
    expect(result.point.y).toBeCloseTo(0, 8);
  });

  it("misses endpoints outside tolerance and falls through to grid", () => {
    // zoom=1, default 12px → 12mm; endpoint 50mm away is out
    const result = snapDrawingPoint({
      raw: { x: 50, y: 0 },
      start: null,
      endpoints: [{ x: 0, y: 0 }],
      zoom: 1,
      suppress: false,
      gridMm: 25,
    });
    expect(result.kind).toBe("grid");
    expect(result.point).toEqual({ x: 50, y: 0 });
  });
});
