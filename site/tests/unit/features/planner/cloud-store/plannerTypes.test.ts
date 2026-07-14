import { describe, expect, it } from "vitest";
import {
  MAX_TAGS,
  MAX_TAG_LENGTH,
  ZONE_COLORS,
  type FurnitureItem,
  type ZoneType,
} from "@/features/planner/cloud-store/plannerTypes";

describe("plannerTypes", () => {
  it("defines tag limits used by UI and utils", () => {
    expect(MAX_TAGS).toBe(20);
    expect(MAX_TAG_LENGTH).toBe(30);
  });

  it("maps every ZoneType to a color string", () => {
    const types: ZoneType[] = Object.keys(ZONE_COLORS) as ZoneType[];
    expect(types.length).toBeGreaterThanOrEqual(4);
    for (const type of types) {
      expect(typeof ZONE_COLORS[type]).toBe("string");
      expect(ZONE_COLORS[type].length).toBeGreaterThan(0);
    }
  });

  it("accepts a FurnitureItem value shape", () => {
    const item: FurnitureItem = {
      id: "f1",
      catalogId: "desk-1",
      name: "Desk",
      x: 10,
      y: 20,
      width: 120,
      height: 60,
      rotation: 0,
      color: "#ccc",
      shape: "rect",
      zIndex: 1,
    };
    expect(item.catalogId).toBe("desk-1");
    expect(item.zIndex).toBe(1);
  });
});
