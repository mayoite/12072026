import { describe, expect, it } from "vitest";
import { applyRoomPreset } from "@/features/planner/lib/applyRoomPreset";
import type { RoomPreset } from "@/features/planner/catalog-api/roomPresets";

describe("applyRoomPreset", () => {
  it("is a no-op until wired to planner project", () => {
    const preset: RoomPreset = {
      id: "cabin",
      name: "Cabin",
      summary: "Private office",
      widthMm: 3000,
      heightMm: 3000,
    };
    expect(() => applyRoomPreset(null, preset)).not.toThrow();
  });
});
