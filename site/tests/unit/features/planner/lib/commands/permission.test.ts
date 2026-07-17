import { describe, expect, it } from "vitest";
import { isCommandBlocked } from "@/features/planner/lib/commands/permission";

describe("permission", () => {
  it("allows geometry commands for guests; blocks persist/export", () => {
    expect(isCommandBlocked("guest", "draw-wall")).toBe(false);
    expect(isCommandBlocked("guest", "undo")).toBe(false);
    expect(isCommandBlocked("guest", "save")).toBe(true);
    expect(isCommandBlocked("guest", "export-plan")).toBe(true);
    expect(isCommandBlocked("guest", "import-plan")).toBe(true);
  });

  it("does not block member context", () => {
    expect(isCommandBlocked("authenticated", "save")).toBe(false);
    expect(isCommandBlocked("authenticated", "export-plan")).toBe(false);
  });
});
