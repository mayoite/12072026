import { describe, expect, it } from "vitest";
import type {
  SuggestedLayoutJson,
  CanvasPlacementSummary,
  SpaceSuggestInput,
} from "@/features/planner/ai/types";

describe("ai/types", () => {
  it("accepts a version-1 suggested layout shape", () => {
    const layout: SuggestedLayoutJson = {
      version: 1,
      source: "llm",
      summary: "24 seats",
      room: { label: "Open", x: 0, y: 0, widthMm: 10000, depthMm: 8000 },
      walls: [
        {
          type: "planner-wall",
          x: 0,
          y: 0,
          endX: 100,
          endY: 0,
          lengthMm: 10000,
        },
      ],
      zones: [
        {
          label: "Focus",
          x: 10,
          y: 10,
          widthMm: 3000,
          heightMm: 2000,
          zoneType: "focus",
        },
      ],
      furniture: [
        {
          catalogItemId: "desk-1",
          label: "Desk",
          x: 20,
          y: 20,
          rotation: 0,
        },
      ],
    };
    expect(layout.version).toBe(1);
    expect(layout.furniture).toHaveLength(1);
  });

  it("accepts placement and suggest input shapes", () => {
    const placement: CanvasPlacementSummary = {
      shapeId: "s1",
      kind: "workstation",
      label: "Desk",
      widthMm: 1200,
      heightMm: 600,
    };
    const input: SpaceSuggestInput = {
      seatCount: 12,
      purpose: "workstations",
      floorAreaSqFt: 2000,
    };
    expect(placement.kind).toBe("workstation");
    expect(input.seatCount).toBe(12);
  });
});
