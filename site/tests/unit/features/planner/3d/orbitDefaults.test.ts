import { describe, expect, it } from "vitest";
import {
  PLANNER_ORBIT_DEFAULT_ENABLED,
  getPlannerViewerControlProps,
} from "@/features/planner/3d/orbitDefaults";

describe("orbitDefaults", () => {
  it("defaults orbit controls ON", () => {
    expect(PLANNER_ORBIT_DEFAULT_ENABLED).toBe(true);
  });

  it("returns enableControls: true for product mounts", () => {
    const props = getPlannerViewerControlProps();
    expect(props).toEqual({ enableControls: true });
    const enabled: true = props.enableControls;
    expect(enabled).toBe(true);
  });
});
