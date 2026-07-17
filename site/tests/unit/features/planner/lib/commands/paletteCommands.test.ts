import { describe, expect, it, vi } from "vitest";
import {
  buildPaletteCommands,
  runPaletteCommand,
  filterPaletteCommands,
} from "@/features/planner/lib/commands/paletteCommands";

describe("paletteCommands", () => {
  it("builds tool commands with shortcuts from authority", () => {
    const cmds = buildPaletteCommands();
    expect(cmds.length).toBeGreaterThan(5);
    const wall = cmds.find((c) => c.id === "tool-wall");
    expect(wall?.shortcut).toBe("W");
    expect(wall?.category).toBe("tool");
  });

  it("filters by query and runs handlers", () => {
    const cmds = buildPaletteCommands();
    const filtered = filterPaletteCommands(cmds, "wall");
    expect(filtered.some((c) => c.id.includes("wall"))).toBe(true);
    const setTool = vi.fn();
    runPaletteCommand("tool-wall", {
      setTool,
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    });
    expect(setTool).toHaveBeenCalledWith("wall");
  });
});
