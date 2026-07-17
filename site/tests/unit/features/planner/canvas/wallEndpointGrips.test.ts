import { describe, expect, it } from "vitest";
import {
  projectPointFromGripScreen,
  readWallGripMeta,
  resolveWallForEndpointGrips,
  WALL_GRIP_ENDPOINT_PROP,
  WALL_GRIP_KIND_PROP,
  WALL_GRIP_RADIUS_PX,
  wallEndpointGripScreens,
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
  });

  it("round-trips grip metadata on a Fabric-like carrier", () => {
    const store = new Map<string, string>();
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
  });
});
