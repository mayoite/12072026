import { describe, expect, it, vi } from "vitest";

import {
  CANVAS_TOOL_REQUIREMENT,
  LIVE_GEOMETRY_TOOLS,
  PALETTE_TOOLS,
  type PlannerTool,
  runtimeToolFor,
} from "@/features/planner/editor/canvasTool";
import {
  buildPaletteCommands,
  runPaletteCommand,
  type PaletteCommandHandlers,
} from "@/features/planner/project/lib/commands/paletteCommands";

const LIVE_TOOLS: readonly PlannerTool[] = [
  "select",
  "pan",
  "wall",
  "opening",
  "placement",
  "door",
  "window",
];

const DEFERRED_TOOLS: readonly PlannerTool[] = ["room", "dimension", "text"];

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

  it("marks room, dimension, and text as deferred", () => {
    for (const tool of DEFERRED_TOOLS) {
      expect(CANVAS_TOOL_REQUIREMENT[tool]).toBe("deferred");
    }
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
});

describe("runtimeToolFor (Fabric pointer path)", () => {
  it("maps opening → door", () => {
    expect(runtimeToolFor("opening")).toBe("door");
  });

  it("maps window → window", () => {
    expect(runtimeToolFor("window")).toBe("window");
  });

  it("maps room → select (deferred, no fake geometry)", () => {
    expect(runtimeToolFor("room")).toBe("select");
  });

  it("maps dimension and text → select (deferred)", () => {
    expect(runtimeToolFor("dimension")).toBe("select");
    expect(runtimeToolFor("text")).toBe("select");
  });

  it("maps door → door and keeps other live tools identity", () => {
    expect(runtimeToolFor("door")).toBe("door");
    expect(runtimeToolFor("wall")).toBe("wall");
    expect(runtimeToolFor("select")).toBe("select");
    expect(runtimeToolFor("pan")).toBe("pan");
    expect(runtimeToolFor("placement")).toBe("placement");
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
