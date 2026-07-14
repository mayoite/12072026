import { describe, expect, it } from "vitest";
import {
  PLANNER_FABRIC_FURNITURE_ENV,
  isPlannerFabricFurnitureEnabled,
} from "@/features/planner/canvas/fabricFurnitureFlag";

describe("fabricFurnitureFlag", () => {
  it("exports env key constant", () => {
    expect(PLANNER_FABRIC_FURNITURE_ENV).toBe(
      "NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE",
    );
  });

  it("is true only when env is exactly 1", () => {
    expect(isPlannerFabricFurnitureEnabled({})).toBe(false);
    expect(
      isPlannerFabricFurnitureEnabled({
        NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE: "0",
      }),
    ).toBe(false);
    expect(
      isPlannerFabricFurnitureEnabled({
        NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE: "true",
      }),
    ).toBe(false);
    expect(
      isPlannerFabricFurnitureEnabled({
        NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE: "1",
      }),
    ).toBe(true);
  });
});
