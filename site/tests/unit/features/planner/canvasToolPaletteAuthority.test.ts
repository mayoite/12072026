import { describe, expect, it, vi } from "vitest";

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
  type ToolRequirementTier,
} from "@/features/planner/editor/canvasTool";
import {
  buildPaletteCommands,
  runPaletteCommand,
  type PaletteCommandHandlers,
} from "@/features/planner/lib/commands/paletteCommands";

/** Live tools match CANVAS_TOOL_REQUIREMENT — room is exact-panel live; dimension is two-click live. */
const LIVE_TOOLS: readonly PlannerTool[] = [
  "select",
  "pan",
  "wall",
  "opening",
  "dimension",
  "placement",
  "door",
  "window",
  "room",
];

const DEFERRED_TOOLS: readonly PlannerTool[] = ["text"];

/** Every PlannerTool id — maps must stay exhaustive (no silent omit). */
const ALL_PLANNER_TOOLS: readonly PlannerTool[] = [
  ...LIVE_TOOLS,
  ...DEFERRED_TOOLS,
];

const VALID_TIERS: readonly ToolRequirementTier[] = [
  "live",
  "keyboard",
  "deferred",
];

function makeHandlers(
  overrides: Partial<PaletteCommandHandlers> = {},
): PaletteCommandHandlers {
  return {
    setTool: vi.fn(),
    toggleView: vi.fn(),
    openPalette: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    cancel: vi.fn(),
    zoomReset: vi.fn(),
    ...overrides,
  };
}

describe("canvasTool requirement tiers (authority)", () => {
  it("marks live geometry/nav tools as tier live", () => {
    for (const tool of LIVE_TOOLS) {
      expect(CANVAS_TOOL_REQUIREMENT[tool]).toBe("live");
    }
  });

  it("marks text as deferred; room and dimension are live", () => {
    for (const tool of DEFERRED_TOOLS) {
      expect(CANVAS_TOOL_REQUIREMENT[tool]).toBe("deferred");
    }
    expect(CANVAS_TOOL_REQUIREMENT.room).toBe("live");
    expect(CANVAS_TOOL_REQUIREMENT.dimension).toBe("live");
  });

  it("LIVE_GEOMETRY_TOOLS is exactly the live-tier tools", () => {
    expect(new Set(LIVE_GEOMETRY_TOOLS)).toEqual(new Set(LIVE_TOOLS));
    for (const tool of LIVE_GEOMETRY_TOOLS) {
      expect(CANVAS_TOOL_REQUIREMENT[tool]).toBe("live");
    }
    for (const tool of DEFERRED_TOOLS) {
      expect(LIVE_GEOMETRY_TOOLS).not.toContain(tool);
    }
  });

  it("covers every PlannerTool with a known tier (no orphan / unknown)", () => {
    const requirementKeys = Object.keys(CANVAS_TOOL_REQUIREMENT) as PlannerTool[];
    expect(new Set(requirementKeys)).toEqual(new Set(ALL_PLANNER_TOOLS));
    for (const tool of ALL_PLANNER_TOOLS) {
      expect(VALID_TIERS).toContain(CANVAS_TOOL_REQUIREMENT[tool]);
    }
  });

  it("isLiveGeometryTool matches live tier only", () => {
    for (const tool of LIVE_TOOLS) {
      expect(isLiveGeometryTool(tool)).toBe(true);
    }
    for (const tool of DEFERRED_TOOLS) {
      expect(isLiveGeometryTool(tool)).toBe(false);
    }
  });
});

describe("runtimeToolFor (Fabric pointer path)", () => {
  it("maps opening → door", () => {
    expect(runtimeToolFor("opening")).toBe("door");
  });

  it("maps window → window", () => {
    expect(runtimeToolFor("window")).toBe("window");
  });

  it("maps room → select (exact panel, not freehand draw path)", () => {
    expect(runtimeToolFor("room")).toBe("select");
  });

  it("maps dimension → dimension; text → select (deferred)", () => {
    expect(runtimeToolFor("dimension")).toBe("dimension");
    expect(runtimeToolFor("text")).toBe("select");
  });

  it("maps door → door and keeps other live tools identity", () => {
    expect(runtimeToolFor("door")).toBe("door");
    expect(runtimeToolFor("wall")).toBe("wall");
    expect(runtimeToolFor("select")).toBe("select");
    expect(runtimeToolFor("pan")).toBe("pan");
    expect(runtimeToolFor("placement")).toBe("placement");
  });

  it("never routes deferred tools to a draw/placement runtime path", () => {
    const forbiddenRuntime = new Set([
      "wall",
      "door",
      "window",
      "placement",
      "opening",
      "dimension",
    ]);
    for (const tool of DEFERRED_TOOLS) {
      const runtime = runtimeToolFor(tool);
      expect(runtime).toBe("select");
      expect(forbiddenRuntime.has(runtime)).toBe(false);
    }
  });
});

describe("rail / palette composition (honesty)", () => {
  it("CANVAS_TOOLS is nav + draw + deferred with no duplicates", () => {
    expect(CANVAS_TOOLS).toEqual([
      ...RAIL_NAV_TOOLS,
      ...RAIL_DRAW_TOOLS,
      ...RAIL_DEFERRED_TOOLS,
    ]);
    expect(new Set(CANVAS_TOOLS).size).toBe(CANVAS_TOOLS.length);
  });

  it("RAIL_NAV_TOOLS is select + pan only", () => {
    expect(RAIL_NAV_TOOLS).toEqual(["select", "pan"]);
  });

  it("RAIL_DRAW_TOOLS is live-only including dimension; deferred rail empty", () => {
    expect(RAIL_DRAW_TOOLS).toEqual([
      "room",
      "wall",
      "opening",
      "dimension",
      "placement",
    ]);
    expect(RAIL_DEFERRED_TOOLS).toEqual([]);
    expect(CANVAS_TOOL_REQUIREMENT.room).toBe("live");
    expect(CANVAS_TOOL_REQUIREMENT.dimension).toBe("live");
    expect(CANVAS_TOOL_REQUIREMENT.wall).toBe("live");
    expect(CANVAS_TOOL_REQUIREMENT.opening).toBe("live");
    expect(CANVAS_TOOL_REQUIREMENT.placement).toBe("live");
  });

  it("palette extras are keyboard-path tools not duplicated on the rail", () => {
    expect(PALETTE_EXTRA_TOOLS).toEqual(["door", "window", "text"]);
    for (const tool of PALETTE_EXTRA_TOOLS) {
      expect(CANVAS_TOOLS).not.toContain(tool);
    }
    expect(PALETTE_TOOLS).toEqual([...CANVAS_TOOLS, ...PALETTE_EXTRA_TOOLS]);
  });

  it("label/shortcut/guidance maps are exhaustive for every PlannerTool", () => {
    for (const tool of ALL_PLANNER_TOOLS) {
      expect(CANVAS_TOOL_LABELS[tool].length).toBeGreaterThan(0);
      expect(CANVAS_TOOL_SHORTCUTS[tool].length).toBe(1);
      expect(CANVAS_TOOL_GUIDANCE[tool].length).toBeGreaterThan(10);
    }
  });
});

describe("toolAccessibleName / toolTooltipText (UI honesty helpers)", () => {
  it("live tools: Label (Shortcut) without deferred marker", () => {
    for (const tool of LIVE_TOOLS) {
      const name = toolAccessibleName(tool);
      expect(name).toBe(
        `${CANVAS_TOOL_LABELS[tool]} (${CANVAS_TOOL_SHORTCUTS[tool]})`,
      );
      expect(name.toLowerCase()).not.toContain("deferred");
    }
  });

  it("deferred tools: append ', deferred' for a11y honesty", () => {
    for (const tool of DEFERRED_TOOLS) {
      const name = toolAccessibleName(tool);
      expect(name).toBe(
        `${CANVAS_TOOL_LABELS[tool]} (${CANVAS_TOOL_SHORTCUTS[tool]}), deferred`,
      );
      expect(name).toMatch(/, deferred$/);
    }
  });

  it("toolTooltipText is the authority guidance string", () => {
    for (const tool of ALL_PLANNER_TOOLS) {
      expect(toolTooltipText(tool)).toBe(CANVAS_TOOL_GUIDANCE[tool]);
    }
  });

  it("deferred guidance does not claim Fabric geometry works", () => {
    for (const tool of DEFERRED_TOOLS) {
      const tip = toolTooltipText(tool).toLowerCase();
      expect(tip).toMatch(/deferred/);
      expect(tip).not.toMatch(/click start and end/);
      expect(tip).not.toMatch(/click a wall to add/);
    }
  });

  it("wall guidance is drag-to-draw (host press-drag-release), not two-click", () => {
    const tip = toolTooltipText("wall").toLowerCase();
    expect(tip).toMatch(/drag/);
    expect(tip).not.toMatch(/click start and end/);
    expect(tip).not.toMatch(/start and end points/);
    expect(tip).toBe(CANVAS_TOOL_GUIDANCE.wall.toLowerCase());
  });
});

describe("palette command authority", () => {
  it("buildPaletteCommands includes a tool-* command for every PALETTE_TOOLS id", () => {
    const commands = buildPaletteCommands();
    const toolIds = commands
      .filter((c) => c.category === "tool")
      .map((c) => c.id);

    for (const tool of PALETTE_TOOLS) {
      expect(toolIds).toContain(`tool-${tool}`);
    }

    // No orphan tool-* ids outside PALETTE_TOOLS
    for (const id of toolIds) {
      const tool = id.slice("tool-".length) as PlannerTool;
      expect(PALETTE_TOOLS).toContain(tool);
    }
  });

  it("runPaletteCommand tool-* calls setTool with the PlannerTool id", () => {
    for (const tool of PALETTE_TOOLS) {
      const handlers = makeHandlers();
      const ok = runPaletteCommand(`tool-${tool}`, handlers);

      expect(ok).toBe(true);
      expect(handlers.setTool).toHaveBeenCalledTimes(1);
      expect(handlers.setTool).toHaveBeenCalledWith(tool);
    }
  });
});
