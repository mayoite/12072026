import { describe, expect, it } from "vitest";

import {
  PLANNER_STAGE_GRID_MM,
  plannerGridOverlayStyle,
} from "@/features/planner/canvas/fabricStageGridOverlay";

describe("plannerGridOverlayStyle", () => {
  it("scales grid spacing with canvas transform", () => {
    const style = plannerGridOverlayStyle({ origin: { x: 0, y: 0 }, scale: 0.1 });
    expect(style["--planner-grid-size-px"]).toBe(`${PLANNER_STAGE_GRID_MM * 0.1}px`);
    expect(style["--planner-grid-offset-x"]).toBe("0px");
    expect(style["--planner-grid-offset-y"]).toBe("0px");
  });

  it("offsets grid lines when the plan origin pans", () => {
    const style = plannerGridOverlayStyle(
      { origin: { x: 50, y: 30 }, scale: 0.1 },
      100,
    );
    expect(style["--planner-grid-size-px"]).toBe("10px");
    expect(style["--planner-grid-offset-x"]).toBe("5px");
    expect(style["--planner-grid-offset-y"]).toBe("7px");
  });
});