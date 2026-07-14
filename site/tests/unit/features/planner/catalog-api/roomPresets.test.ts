import { describe, expect, it } from "vitest";
import { ROOM_PRESETS } from "@/features/planner/catalog-api/roomPresets";

describe("roomPresets", () => {
  it("exports a non-empty list of room presets with unique ids", () => {
    expect(ROOM_PRESETS.length).toBeGreaterThanOrEqual(5);
    const ids = ROOM_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires positive dimensions and zone widths that sum to room width", () => {
    for (const preset of ROOM_PRESETS) {
      expect(preset.widthMm).toBeGreaterThan(0);
      expect(preset.heightMm).toBeGreaterThan(0);
      expect(preset.name.length).toBeGreaterThan(0);
      if (preset.zones?.length) {
        const zoneSum = preset.zones.reduce((sum, z) => sum + z.widthMm, 0);
        expect(zoneSum).toBe(preset.widthMm);
        for (const zone of preset.zones) {
          expect(zone.label.length).toBeGreaterThan(0);
          expect(zone.widthMm).toBeGreaterThan(0);
        }
      }
    }
  });

  it("includes multi-zone full office suite", () => {
    const suite = ROOM_PRESETS.find((p) => p.id === "full-office-suite");
    expect(suite).toBeDefined();
    expect(suite?.zones).toHaveLength(5);
    expect(suite?.widthMm).toBe(18000);
  });
});
