import { describe, expect, it, vi } from "vitest";
import {
  feasibilityCommands,
  getFeasibilityCommand,
} from "@/features/planner/project/lib/commands/registry";

describe("commands registry", () => {
  it("lists feasibility commands and executes draw-wall", () => {
    expect(feasibilityCommands.length).toBeGreaterThanOrEqual(6);
    const draw = getFeasibilityCommand("draw-wall");
    expect(draw.label).toMatch(/wall/i);
    const activateDrawWall = vi.fn();
    const result = draw.execute({
      activateDrawWall,
      cancel: vi.fn(),
      undo: vi.fn().mockReturnValue(true),
      zoomBy: vi.fn(),
      resetZoom: vi.fn(),
    });
    expect(result.status).toBe("activated");
    expect(activateDrawWall).toHaveBeenCalled();
    expect(() => getFeasibilityCommand("missing" as "draw-wall")).toThrow(/unknown/i);
  });
});
