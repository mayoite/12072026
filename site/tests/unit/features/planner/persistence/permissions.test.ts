import { describe, expect, it } from "vitest";

import {
  GUEST_BLOCKED_COMMAND_KEYS,
  isCommandBlockedForContext,
  type PlannerCommandKey,
} from "@/features/planner/project/lib/commands/plannerAccessContext";
import {
  executeCommand,
  feasibilityCommands,
  getFeasibilityCommand,
  type FeasibilityCommandContext,
} from "@/features/planner/project/lib/commands/registry";

const mockContext: FeasibilityCommandContext = {
  activateDrawWall: () => undefined,
  cancel: () => undefined,
  undo: () => false,
  zoomBy: (_factor: number) => undefined,
  resetZoom: () => undefined,
};

describe("isCommandBlockedForContext guest blocked commands", () => {
  it('blocks "save" for guest', () => {
    expect(isCommandBlockedForContext("guest", "save")).toBe(true);
  });

  it('blocks "export-plan" for guest', () => {
    expect(isCommandBlockedForContext("guest", "export-plan")).toBe(true);
  });

  it('blocks "import-plan" for guest', () => {
    expect(isCommandBlockedForContext("guest", "import-plan")).toBe(true);
  });

  it('blocks "open-file" for guest', () => {
    expect(isCommandBlockedForContext("guest", "open-file")).toBe(true);
  });

  it('blocks "print" for guest', () => {
    expect(isCommandBlockedForContext("guest", "print")).toBe(true);
  });
});

describe("isCommandBlockedForContext guest allowed drawing commands", () => {
  it('allows "draw-wall" for guest', () => {
    expect(isCommandBlockedForContext("guest", "draw-wall")).toBe(false);
  });

  it('allows "cancel" for guest', () => {
    expect(isCommandBlockedForContext("guest", "cancel")).toBe(false);
  });

  it('allows "undo" for guest', () => {
    expect(isCommandBlockedForContext("guest", "undo")).toBe(false);
  });

  it('allows "zoom-in" for guest', () => {
    expect(isCommandBlockedForContext("guest", "zoom-in")).toBe(false);
  });

  it('allows "zoom-out" for guest', () => {
    expect(isCommandBlockedForContext("guest", "zoom-out")).toBe(false);
  });

  it('allows "zoom-reset" for guest', () => {
    expect(isCommandBlockedForContext("guest", "zoom-reset")).toBe(false);
  });
});

describe("isCommandBlockedForContext non-guest contexts", () => {
  it('does not block "save" for authenticated', () => {
    expect(isCommandBlockedForContext("authenticated", "save")).toBe(false);
  });

  it('does not block "export-plan" for authenticated', () => {
    expect(isCommandBlockedForContext("authenticated", "export-plan")).toBe(false);
  });

  it('does not block "import-plan" for authenticated', () => {
    expect(isCommandBlockedForContext("authenticated", "import-plan")).toBe(false);
  });

  it('does not block "open-file" for authenticated', () => {
    expect(isCommandBlockedForContext("authenticated", "open-file")).toBe(false);
  });

  it('does not block "print" for authenticated', () => {
    expect(isCommandBlockedForContext("authenticated", "print")).toBe(false);
  });

  it('does not block "save" for admin', () => {
    expect(isCommandBlockedForContext("admin", "save")).toBe(false);
  });

  it('does not block "export-plan" for admin', () => {
    expect(isCommandBlockedForContext("admin", "export-plan")).toBe(false);
  });
});

describe("GUEST_BLOCKED_COMMAND_KEYS", () => {
  it("contains exactly five entries", () => {
    expect(GUEST_BLOCKED_COMMAND_KEYS.size).toBe(5);
  });

  it("contains the expected command ids", () => {
    expect([...GUEST_BLOCKED_COMMAND_KEYS]).toEqual([
      "save",
      "export-plan",
      "import-plan",
      "open-file",
      "print",
    ]);
  });
});

describe("executeCommand guest permission gate", () => {
  const blockedCommands = [
    "save",
    "export-plan",
    "import-plan",
    "open-file",
    "print",
  ] as const;

  for (const commandId of blockedCommands) {
    it(`returns blocked-for-guest for "${commandId}"`, () => {
      const outcome = executeCommand("guest", commandId, mockContext);
      expect(outcome).toEqual({
        status: "unavailable",
        commandId,
        reason: "blocked-for-guest",
      });
    });
  }

  it('"draw-wall" activates for guest', () => {
    expect(executeCommand("guest", "draw-wall", mockContext)).toEqual({
      status: "activated",
      commandId: "draw-wall",
    });
  });

  it('"cancel" completes for guest', () => {
    expect(executeCommand("guest", "cancel", mockContext)).toEqual({
      status: "completed",
      commandId: "cancel",
    });
  });

  it('"undo" stays unavailable without history but is not guest-blocked', () => {
    const outcome = executeCommand("guest", "undo", mockContext);
    expect(outcome.status).toBe("unavailable");
    expect(outcome.commandId).toBe("undo");
    if (outcome.status === "unavailable") {
      expect(outcome.reason).toBeUndefined();
    }
  });

  it("allows zoom commands for guest", () => {
    expect(executeCommand("guest", "zoom-in", mockContext).status).toBe("completed");
    expect(executeCommand("guest", "zoom-out", mockContext).status).toBe("completed");
    expect(executeCommand("guest", "zoom-reset", mockContext).status).toBe("completed");
  });
});

describe("executeCommand authenticated and admin contexts", () => {
  it('"save" is not blocked for authenticated', () => {
    const outcome = executeCommand("authenticated", "save", mockContext);
    expect(outcome.status).toBe("unavailable");
    if (outcome.status === "unavailable") {
      expect(outcome.reason).toBeUndefined();
    }
  });

  it('"export-plan" is not blocked for authenticated', () => {
    const outcome = executeCommand("authenticated", "export-plan", mockContext);
    expect(outcome.status).toBe("unavailable");
    if (outcome.status === "unavailable") {
      expect(outcome.reason).toBeUndefined();
    }
  });

  it('"save" is not blocked for admin', () => {
    const outcome = executeCommand("admin", "save", mockContext);
    expect(outcome.status).toBe("unavailable");
    if (outcome.status === "unavailable") {
      expect(outcome.reason).toBeUndefined();
    }
  });
});

describe("registry lookups and unknown ids", () => {
  it("returns known feasibility commands", () => {
    expect(getFeasibilityCommand("draw-wall")).toMatchObject({
      id: "draw-wall",
      label: "Draw wall",
      shortcut: "W",
    });
    expect(getFeasibilityCommand("undo").id).toBe("undo");
  });

  it("throws for a non-feasibility command id", () => {
    expect(() => getFeasibilityCommand("save")).toThrow("Unknown feasibility command: save");
  });

  it("throws for a completely unknown command id", () => {
    const invalidCommandId = "nonexistent-cmd" as unknown as PlannerCommandKey;
    expect(() => getFeasibilityCommand(invalidCommandId)).toThrow("Unknown feasibility command");
  });

  it("returns unavailable for an unregistered command id via executeCommand", () => {
    const invalidCommandId = "nonexistent-cmd" as unknown as PlannerCommandKey;
    const outcome = executeCommand("authenticated", invalidCommandId, mockContext);
    expect(outcome.status).toBe("unavailable");
    expect(outcome.commandId).toBe("nonexistent-cmd");
    if (outcome.status === "unavailable") {
      expect(outcome.reason).toBeUndefined();
    }
  });
});

describe("registry execution details", () => {
  it('"undo" completes when the context can undo', () => {
    const undoSucceeds: FeasibilityCommandContext = {
      ...mockContext,
      undo: () => true,
    };

    expect(executeCommand("authenticated", "undo", undoSucceeds)).toEqual({
      status: "completed",
      commandId: "undo",
    });
  });

  it("executes all authenticated phase-05 stub commands", () => {
    const phase05Commands = ["export-plan", "import-plan", "open-file", "print"] as const;

    for (const commandId of phase05Commands) {
      const outcome = executeCommand("authenticated", commandId, mockContext);
      expect(outcome.status).toBe("unavailable");
      expect(outcome.commandId).toBe(commandId);
      if (outcome.status === "unavailable") {
        expect(outcome.reason).toBeUndefined();
      }
    }
  });

  it("keeps a stable six-command toolbar registry with unique ids", () => {
    expect(feasibilityCommands).toHaveLength(6);
    expect(new Set(feasibilityCommands.map((command) => command.id)).size).toBe(6);
  });

  it("executes draw, cancel, zoom, and reset through command definitions", () => {
    let activated = 0;
    let cancelled = 0;
    const zoomFactors: number[] = [];
    let resetCount = 0;
    const commandContext: FeasibilityCommandContext = {
      activateDrawWall: () => {
        activated += 1;
      },
      cancel: () => {
        cancelled += 1;
      },
      undo: () => true,
      zoomBy: (factor) => {
        zoomFactors.push(factor);
      },
      resetZoom: () => {
        resetCount += 1;
      },
    };

    expect(getFeasibilityCommand("draw-wall").execute(commandContext)).toEqual({
      status: "activated",
      commandId: "draw-wall",
    });
    expect(getFeasibilityCommand("cancel").execute(commandContext)).toEqual({
      status: "completed",
      commandId: "cancel",
    });
    expect(getFeasibilityCommand("zoom-in").execute(commandContext)).toEqual({
      status: "completed",
      commandId: "zoom-in",
    });
    expect(getFeasibilityCommand("zoom-out").execute(commandContext)).toEqual({
      status: "completed",
      commandId: "zoom-out",
    });
    expect(getFeasibilityCommand("zoom-reset").execute(commandContext)).toEqual({
      status: "completed",
      commandId: "zoom-reset",
    });

    expect(activated).toBe(1);
    expect(cancelled).toBe(1);
    expect(zoomFactors).toEqual([1.2, 1 / 1.2]);
    expect(resetCount).toBe(1);
  });
});
