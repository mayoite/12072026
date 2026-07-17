import { describe, expect, it } from "vitest";
import {
  projectPointFromGripScreen,
  readWallGripMeta,
  resolveWallForEndpointGrips,
  WALL_GRIP_ENDPOINT_PROP,
  WALL_GRIP_KIND_PROP,
  WALL_GRIP_RADIUS_PX,
  wallEndpointGripScreens,
  wallEndpointsAfterGripMove,
  wallGripAnchorPoint,
  wallGripFabricOptions,
  writeWallGripMeta,
} from "@/features/planner/canvas/wallEndpointGrips";
import type { PlannerWall } from "@/features/planner/model/types";
import type { CanvasTransform } from "@/features/planner/lib/geometry/snapping";

const transform: CanvasTransform = {
  origin: { x: 0, y: 0 },
  scale: 0.1,
};

function wall(partial: Partial<PlannerWall> & Pick<PlannerWall, "id">): PlannerWall {
  return {
    start: { x: 0, y: 0 },
    end: { x: 4000, y: 0 },
    thickness: 150,
    height: 2400,
    color: "#64748b",
    ...partial,
  };
}

describe("wallEndpointGrips", () => {
  it("maps wall endpoints to screen centres", () => {
    const screens = wallEndpointGripScreens(
      wall({ id: "w1", start: { x: 1000, y: 2000 }, end: { x: 3000, y: 2000 } }),
      transform,
    );
    expect(screens.start).toEqual({ x: 100, y: 200 });
    expect(screens.end).toEqual({ x: 300, y: 200 });
  });

  it("maps grip screen centres back to project millimetres", () => {
    expect(projectPointFromGripScreen({ x: 100, y: 200 }, transform)).toEqual({
      x: 1000,
      y: 2000,
    });
  });

  it("round-trips project→screen→project with origin offset", () => {
    const offsetTransform: CanvasTransform = {
      origin: { x: 500, y: -200 },
      scale: 0.05,
    };
    const project = { x: 2500, y: 1800 };
    const screen = {
      x: (project.x - offsetTransform.origin.x) * offsetTransform.scale,
      y: (project.y - offsetTransform.origin.y) * offsetTransform.scale,
    };
    expect(projectPointFromGripScreen(screen, offsetTransform)).toEqual(project);
  });

  it("resolves a single selected wall and rejects multi-select", () => {
    const walls = [wall({ id: "a" }), wall({ id: "b" })];
    expect(
      resolveWallForEndpointGrips(walls, { type: "wall", ids: ["b"] })?.id,
    ).toBe("b");
    expect(
      resolveWallForEndpointGrips(walls, { type: "wall", ids: ["a", "b"] }),
    ).toBeNull();
    expect(
      resolveWallForEndpointGrips(walls, { type: "furniture", ids: ["a"] }),
    ).toBeNull();
    expect(resolveWallForEndpointGrips(walls, { type: "none", ids: [] })).toBeNull();
    expect(resolveWallForEndpointGrips(walls, null)).toBeNull();
    expect(resolveWallForEndpointGrips(walls, undefined)).toBeNull();
    expect(
      resolveWallForEndpointGrips(walls, { type: "wall", ids: ["missing"] }),
    ).toBeNull();
    expect(
      resolveWallForEndpointGrips(walls, { type: "wall", ids: [""] }),
    ).toBeNull();
  });

  it("round-trips grip metadata on a Fabric-like carrier", () => {
    const store = new Map<string, unknown>();
    const target = {
      set: (key: string, value: string) => {
        store.set(key, value);
      },
      get: (key: string) => store.get(key),
    };
    writeWallGripMeta(target, { wallId: "wall-9", endpoint: "end" });
    expect(store.get(WALL_GRIP_KIND_PROP)).toBe("1");
    expect(store.get(WALL_GRIP_ENDPOINT_PROP)).toBe("end");
    expect(readWallGripMeta(target)).toEqual({
      wallId: "wall-9",
      endpoint: "end",
    });
    expect(readWallGripMeta({})).toBeNull();
    expect(readWallGripMeta(null)).toBeNull();
    // Boolean kind flag (Fabric may coerce) still accepted.
    store.set(WALL_GRIP_KIND_PROP, true);
    store.set(WALL_GRIP_ENDPOINT_PROP, "start");
    store.set("entityId", "wall-9");
    expect(readWallGripMeta(target)).toEqual({
      wallId: "wall-9",
      endpoint: "start",
    });
    store.set(WALL_GRIP_ENDPOINT_PROP, "middle");
    expect(readWallGripMeta(target)).toBeNull();
    store.set(WALL_GRIP_ENDPOINT_PROP, "end");
    store.set("entityId", "");
    expect(readWallGripMeta(target)).toBeNull();
  });

  it("builds non-scaling grip fabric options at a fixed pixel radius", () => {
    const options = wallGripFabricOptions({
      screen: { x: 12, y: 34 },
      stroke: "#2563eb",
      fill: "#ffffff",
    });
    expect(options.radius).toBe(WALL_GRIP_RADIUS_PX);
    expect(options.left).toBe(12);
    expect(options.top).toBe(34);
    expect(options.hasControls).toBe(false);
    expect(options.selectable).toBe(true);
    expect(options.lockScalingX).toBe(true);
    expect(options.originX).toBe("center");
  });

  it("anchors the opposite endpoint while a grip moves", () => {
    const w = wall({
      id: "w",
      start: { x: 0, y: 0 },
      end: { x: 4000, y: 2000 },
    });
    expect(wallGripAnchorPoint(w, "start")).toEqual({ x: 4000, y: 2000 });
    expect(wallGripAnchorPoint(w, "end")).toEqual({ x: 0, y: 0 });
    // Returns a copy — mutating the result must not mutate the wall.
    const anchor = wallGripAnchorPoint(w, "start");
    anchor.x = 1;
    expect(w.end.x).toBe(4000);
  });

  it("builds wall endpoints after a grip move without mutating the source wall", () => {
    const w = wall({
      id: "w",
      start: { x: 100, y: 200 },
      end: { x: 4100, y: 200 },
    });
    const startMoved = wallEndpointsAfterGripMove(w, "start", {
      x: 50,
      y: 300,
    });
    expect(startMoved).toEqual({
      start: { x: 50, y: 300 },
      end: { x: 4100, y: 200 },
    });
    const endMoved = wallEndpointsAfterGripMove(w, "end", { x: 5000, y: 0 });
    expect(endMoved).toEqual({
      start: { x: 100, y: 200 },
      end: { x: 5000, y: 0 },
    });
    expect(w.start).toEqual({ x: 100, y: 200 });
    expect(w.end).toEqual({ x: 4100, y: 200 });
  });
});
