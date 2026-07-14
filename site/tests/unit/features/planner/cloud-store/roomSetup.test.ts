import { describe, expect, it } from "vitest";
import {
  ROOM_SETUP_STYLES,
  ROOM_SETUP_TYPES,
  buildRoomSetupTemplate,
} from "@/features/planner/cloud-store/roomSetup";

describe("roomSetup", () => {
  it("exposes room types and styles", () => {
    expect(ROOM_SETUP_TYPES.map((t) => t.id)).toContain("office");
    expect(ROOM_SETUP_TYPES.map((t) => t.id)).toContain("meeting");
    expect(ROOM_SETUP_STYLES).toContain("Modern");
    expect(ROOM_SETUP_STYLES).toContain("Minimalist");
  });

  it("builds a closed rectangular room with door and window", () => {
    const template = buildRoomSetupTemplate({
      roomType: "office",
      widthM: 6,
      depthM: 4,
      style: "Modern",
    });
    expect(template.id).toBe("room-setup-office");
    expect(template.name).toBe("Modern Office");
    expect(template.walls).toHaveLength(4);
    expect(template.rooms).toHaveLength(1);
    expect(template.doors).toHaveLength(1);
    expect(template.windows).toHaveLength(1);
    expect(template.furniture).toEqual([]);
    expect(template.description).toContain("6.0m");
    expect(template.rooms[0]?.floorMaterial).toBe("default");
  });

  it("clamps invalid dimensions into safe bounds", () => {
    const tiny = buildRoomSetupTemplate({
      roomType: "custom",
      widthM: 0.1,
      depthM: Number.NaN,
      style: "Traditional",
    });
    expect(tiny.size).toMatch(/1\.5m/);
    expect(tiny.rooms[0]?.floorMaterial).toBe("wood");

    const huge = buildRoomSetupTemplate({
      roomType: "conference",
      widthM: 999,
      depthM: 999,
      style: "Minimalist",
    });
    expect(huge.size).toMatch(/60\.0m/);
    expect(huge.rooms[0]?.floorMaterial).toBe("concrete");
  });

  it("converts metres to canvas px at 100 px/m", () => {
    const template = buildRoomSetupTemplate({
      roomType: "lobby",
      widthM: 5,
      depthM: 3,
      style: "Modern",
    });
    const wall = template.walls[0]!;
    expect(wall.end.x - wall.start.x).toBe(500);
  });
});
