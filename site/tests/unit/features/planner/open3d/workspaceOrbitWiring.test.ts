/**
 * W4 layer 2: product workspace must not ship silent-default-only orbit.
 * Asserts helper contract + source wiring in OOPlannerWorkspace so removal
 * of `{...getOpen3dViewerControlProps()}` fails unit (three-layer rule).
 *
 * Prefer source/helper checks over full app mount (no thrash).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "@/features/planner/open3d/3d/orbitDefaults";

/** Site-root relative path (vitest cwd = site). Never __dirname-relative. */
const WORKSPACE_SOURCE_SEGMENTS = [
  "features",
  "planner",
  "open3d",
  "editor",
  "OOPlannerWorkspace.tsx",
] as const;

const WORKSPACE_SOURCE_PATH = path.join(
  process.cwd(),
  ...WORKSPACE_SOURCE_SEGMENTS,
);

/** Explicit spread of control props into Lazy3DViewer (layer 2 contract). */
const SPREAD_CONTROL_PROPS_PATTERN =
  /\{\s*\.\.\.\s*getOpen3dViewerControlProps\s*\(\s*\)\s*\}/;

/** Product path must never hard-disable orbit on the workspace 3D branch. */
const ENABLE_CONTROLS_FALSE_PATTERN = /enableControls\s*=\s*\{\s*false\s*\}/;

const EXPECTED_CONTROL_PROPS = { enableControls: true } as const;

describe("W4 workspace orbit wiring (layer 2)", () => {
  it("helper forces enableControls true", () => {
    expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
    expect(getOpen3dViewerControlProps()).toEqual(EXPECTED_CONTROL_PROPS);
    // Type-level: return is literally { enableControls: true }
    const props = getOpen3dViewerControlProps();
    expect(props.enableControls).toBe(true);
  });

  it("OOPlannerWorkspace spreads getOpen3dViewerControlProps into Lazy3DViewer", () => {
    const src = readFileSync(WORKSPACE_SOURCE_PATH, "utf8");

    expect(src).toMatch(/getOpen3dViewerControlProps/);
    expect(src).toMatch(/Lazy3DViewer/);
    expect(src).toMatch(SPREAD_CONTROL_PROPS_PATTERN);
    // Product path must not hard-disable orbit
    expect(src).not.toMatch(ENABLE_CONTROLS_FALSE_PATTERN);
  });
});
