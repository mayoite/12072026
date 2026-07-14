import { describe, expect, it } from "vitest";
import {
  CANVAS_TOOLS,
  CANVAS_TOOL_GUIDANCE,
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_REQUIREMENT,
  CANVAS_TOOL_SHORTCUTS,
  LIVE_GEOMETRY_TOOLS,
  PALETTE_EXTRA_TOOLS,
  PALETTE_TOOLS,
  RAIL_DEFERRED_TOOLS,
  RAIL_DRAW_TOOLS,
  RAIL_NAV_TOOLS,
  isLiveGeometryTool,
  runtimeToolFor,
  toolAccessibleName,
  toolTooltipText,
  type PlannerTool,
} from "@/features/planner/editor/canvasTool";

const LIVE: PlannerTool[] = ["select", "pan", "wall", "opening", "placement", "door", "window"];
const DEFERRED: PlannerTool[] = ["room", "dimension", "text"];

describe("canvasTool authority", () => {
  it("maps every tool to label, shortcut, guidance, and tier", () => {
    for (const tool of [...LIVE, ...DEFERRED]) {
      expect(CANVAS_TOOL_LABELS[tool].length).toBeGreaterThan(0);
      expect(CANVAS_TOOL_SHORTCUTS[tool]).toMatch(/^[A-Z]$/);
      expect(CANVAS_TOOL_GUIDANCE[tool].length).toBeGreaterThan(10);
      expect(["live", "keyboard", "deferred"]).toContain(CANVAS_TOOL_REQUIREMENT[tool]);
    }
  });

  it("keeps rail groups disjoint and palette = rail + extras", () => {
    expect(RAIL_NAV_TOOLS).toEqual(["select", "pan"]);
    expect(RAIL_DRAW_TOOLS).toEqual(["wall", "opening", "placement"]);
    expect(RAIL_DEFERRED_TOOLS).toEqual(["room", "dimension"]);
    expect(CANVAS_TOOLS).toEqual([...RAIL_NAV_TOOLS, ...RAIL_DRAW_TOOLS, ...RAIL_DEFERRED_TOOLS]);
    for (const t of LIVE) {
      if (t === "door" || t === "window") continue;
      if (t === "select" || t === "pan" || t === "wall" || t === "opening" || t === "placement") {
        expect(isLiveGeometryTool(t)).toBe(true);
      }
    }
    expect(LIVE_GEOMETRY_TOOLS.every(isLiveGeometryTool)).toBe(true);
    expect(PALETTE_TOOLS.length).toBe(CANVAS_TOOLS.length + PALETTE_EXTRA_TOOLS.length);
  });

  it("runtimeToolFor maps opening/door→door; deferred tools arm as select", () => {
    expect(runtimeToolFor("door")).toBe("door");
    expect(runtimeToolFor("window")).toBe("window");
    expect(runtimeToolFor("opening")).toBe("door");
    expect(runtimeToolFor("wall")).toBe("wall");
    expect(runtimeToolFor("room")).toBe("select");
    expect(runtimeToolFor("text")).toBe("select");
    expect(toolAccessibleName("wall")).toContain(CANVAS_TOOL_LABELS.wall);
    expect(toolAccessibleName("room")).toMatch(/deferred/i);
    expect(toolTooltipText("wall")).toBe(CANVAS_TOOL_GUIDANCE.wall);
  });
});
