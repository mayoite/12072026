import { describe, expect, it } from "vitest";
import type {
  DocumentFurniture,
  DocumentWall,
  PlannerType,
} from "@/features/planner/shared/document/types";

describe("shared/document/types", () => {
  it("accepts planner type union and wall geometry", () => {
    const types: PlannerType[] = ["oando", "buddy"];
    expect(types).toContain("oando");

    const wall: DocumentWall = {
      id: "w1",
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 },
      thickness: 8,
    };
    expect(wall.end.x - wall.start.x).toBe(100);
  });

  it("accepts furniture placement shape", () => {
    const furniture: DocumentFurniture = {
      id: "f1",
      catalogId: "desk-1",
      name: "Desk",
      category: "desks",
      x: 10,
      y: 20,
      width: 120,
      height: 60,
      rotation: 0,
    };
    expect(furniture.catalogId).toBe("desk-1");
    expect(furniture.width * furniture.height).toBe(7200);
  });
});
