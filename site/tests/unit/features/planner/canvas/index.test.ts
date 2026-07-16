import { describe, expect, it } from "vitest";
import {
  isPlannerFabricFurnitureEnabled,
  PLANNER_FABRIC_FURNITURE_ENV,
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  MIN_WALL_SEGMENT_MM,
  shouldCommitWallSegment,
  wallSegmentLengthMm,
  writeFurnitureEntityId,
  readFurnitureEntityId,
  FURNITURE_ENTITY_ID_PROP,
  PlannerFabricStage,
  FurnitureFabricLayer,
} from "@/features/planner/canvas";

describe("canvas/index barrel", () => {
  it("re-exports fabric furniture flag", () => {
    expect(PLANNER_FABRIC_FURNITURE_ENV).toContain("FABRIC_FURNITURE");
    expect(isPlannerFabricFurnitureEnabled({ [PLANNER_FABRIC_FURNITURE_ENV]: "1" })).toBe(
      true,
    );
  });

  it("re-exports wall geometry helpers", () => {
    expect(MIN_WALL_SEGMENT_MM).toBeGreaterThan(0);
    expect(wallSegmentLengthMm({ x: 0, y: 0 }, { x: 1000, y: 0 })).toBe(1000);
    expect(
      shouldCommitWallSegment({ x: 0, y: 0 }, { x: MIN_WALL_SEGMENT_MM + 1, y: 0 }),
    ).toBe(true);
  });

  it("re-exports furniture mapper helpers", () => {
    expect(DEFAULT_FABRIC_STAGE_TRANSFORM.scale).toBeGreaterThan(0);
    const store = new Map<string, string>();
    const target = {
      set: (key: string, value: string) => {
        store.set(key, value);
        return target;
      },
      get: (key: string) => store.get(key),
    };
    writeFurnitureEntityId(target, "ent-1");
    expect(readFurnitureEntityId(target as never)).toBe("ent-1");
    expect(FURNITURE_ENTITY_ID_PROP).toBeDefined();
  });

  it("exports stage components", () => {
    expect(["function", "object"]).toContain(typeof PlannerFabricStage);
    expect(typeof FurnitureFabricLayer).toBe("function");
  });
});
