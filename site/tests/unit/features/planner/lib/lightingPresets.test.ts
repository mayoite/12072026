import { describe, expect, it } from "vitest";
import {
  MATERIAL_PRESETS,
  LIGHTING_PRESETS,
  MATERIAL_PRESET_LIST,
  LIGHTING_PRESET_LIST,
  getMaterialPreset,
  getLightingPreset,
  DEFAULT_LIGHTING_PRESET,
  DEFAULT_MATERIAL_PRESET,
} from "@/features/planner/lib/lightingPresets";

describe("lightingPresets", () => {
  it("defines wood/concrete/fabric materials", () => {
    expect(MATERIAL_PRESET_LIST).toHaveLength(3);
    expect(getMaterialPreset("wood")).toBe(MATERIAL_PRESETS.wood);
    expect(getMaterialPreset(undefined).id).toBe(DEFAULT_MATERIAL_PRESET);
  });

  it("defines day/night/dusk lighting", () => {
    expect(LIGHTING_PRESET_LIST).toHaveLength(3);
    expect(getLightingPreset("night").id).toBe("night");
    expect(getLightingPreset(undefined).id).toBe(DEFAULT_LIGHTING_PRESET);
    expect(LIGHTING_PRESETS.day.mainLight.intensity).toBeGreaterThan(0);
  });
});
