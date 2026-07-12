import { describe, expect, it } from "vitest";

import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
  plannerSaveStatusBarLabel,
  plannerSaveStatusLabel,
  type PlannerPersistStorage,
} from "@/features/planner/editor/workspaceStatusLabels";
import type { PlannerSaveStatus } from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";

/** Buyer-facing lies when open3d is local-IDB only (cloudEnabled=false). */
const FORBIDDEN_LOCAL_HONESTY = [
  /^Saved$/,
  /\bsynced to account\b/i,
  /\bsynced to server\b/i,
  /\bsaved to cloud\b/i,
  /\bsaved to account\b/i,
  /\bcloud ok\b/i,
  /\bnamed save slots\b/i,
];

function assertLocalHonesty(label: string) {
  expect(label).not.toMatch(/^Saved$/);
  expect(label.toLowerCase()).not.toContain("account");
  expect(label.toLowerCase()).not.toContain("cloud");
  expect(label.toLowerCase()).not.toMatch(/\bsynced\b/);
  for (const pattern of FORBIDDEN_LOCAL_HONESTY) {
    expect(label).not.toMatch(pattern);
  }
}

describe("workspaceStatusLabels", () => {
  it("formats compact tool · shortcut · view (no multi-sentence guidance)", () => {
    expect(formatToolStatus("wall", "2d")).toBe("Wall · W · 2D");
    expect(formatToolStatus("select", "3d")).toBe("Select · V · 3D");
    expect(formatToolStatus("wall", "2d")).not.toMatch(/click|drag|draw/i);
  });

  it("formats snap status only when active", () => {
    expect(formatSnapStatus("none")).toBeNull();
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
  });

  it("formats selection counts", () => {
    expect(formatSelectionStatus({ type: "wall", ids: ["w1"] })).toBe("Wall selected");
    expect(formatSelectionStatus({ type: "furniture", ids: ["a", "b"] })).toBe(
      "2 furnitures selected",
    );
    expect(formatSelectionStatus({ type: "none", ids: [] })).toBeNull();
  });

  it("formats autosave status for guest and member sessions", () => {
    expect(formatAutosaveStatus("saved", true)).toBe("Draft saved locally");
    expect(formatAutosaveStatus("unsaved", false)).toBe("Unsaved changes");
  });
});

describe("workspaceStatusLabels full branches (TDD)", () => {
  it("covers all autosave statuses (honest local labels)", () => {
    expect(formatAutosaveStatus("saving", false)).toBe("Saving locally…");
    expect(formatAutosaveStatus("saved", false)).toBe("Saved locally");
    expect(formatAutosaveStatus("unsaved", true)).toBe("Unsaved draft");
    expect(formatAutosaveStatus("error", true)).toBe("Local save failed");
    expect(formatAutosaveStatus("idle", false)).toBe("Ready (local)");
    expect(formatAutosaveStatus("idle", true)).toBe("Guest session (local)");
  });

  it("covers selection multi and snap variants", () => {
    expect(formatSelectionStatus({ type: "door", ids: ["d1", "d2"] })).toBe("2 doors selected");
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
    expect(formatSnapStatus("endpoint")).toBe("Snap: endpoint");
  });
});

describe("plannerSaveStatusLabel — local-only default (W6)", () => {
  const local: PlannerPersistStorage = "local";

  const cases: Array<{
    status: PlannerSaveStatus;
    guestMode: boolean;
    expected: string;
  }> = [
    { status: "idle", guestMode: true, expected: "Guest session (local)" },
    { status: "idle", guestMode: false, expected: "Ready (local)" },
    { status: "unsaved", guestMode: true, expected: "Unsaved draft" },
    { status: "unsaved", guestMode: false, expected: "Unsaved changes" },
    { status: "saving", guestMode: true, expected: "Saving locally…" },
    { status: "saving", guestMode: false, expected: "Saving locally…" },
    { status: "saved", guestMode: true, expected: "Draft saved locally" },
    { status: "saved", guestMode: false, expected: "Saved locally" },
    { status: "error", guestMode: true, expected: "Local save failed" },
    { status: "error", guestMode: false, expected: "Local save failed" },
  ];

  it.each(cases)(
    "$status guest=$guestMode → $expected",
    ({ status, guestMode, expected }) => {
      const label = plannerSaveStatusLabel({
        status,
        storage: local,
        lastSavedAt: status === "saved" ? "2026-07-10T12:00:00.000Z" : null,
        cloudEnabled: false,
        guestMode,
      });
      expect(label).toBe(expected);
      assertLocalHonesty(label);
    },
  );

  it("never returns cloud account labels when cloudEnabled is false even if storage claims cloud", () => {
    const label = plannerSaveStatusLabel({
      status: "saved",
      storage: "cloud",
      lastSavedAt: "2026-07-10T12:00:00.000Z",
      cloudEnabled: false,
      guestMode: false,
    });
    expect(label).toBe("Saved locally");
    assertLocalHonesty(label);
  });

  it("cloud branches only when cloudEnabled true", () => {
    expect(
      plannerSaveStatusLabel({
        status: "saving",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saving to account…");
    expect(
      plannerSaveStatusLabel({
        status: "saved",
        storage: "cloud",
        lastSavedAt: "2026-07-10T12:00:00.000Z",
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saved to account");
    expect(
      plannerSaveStatusLabel({
        status: "error",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Account save failed");
  });

  it("forbids synced-to-account style lies across every local status", () => {
    const statuses: PlannerSaveStatus[] = ["idle", "unsaved", "saving", "saved", "error"];
    for (const status of statuses) {
      for (const guestMode of [true, false]) {
        const label = plannerSaveStatusLabel({
          status,
          storage: "local",
          lastSavedAt: null,
          cloudEnabled: false,
          guestMode,
        });
        assertLocalHonesty(label);
        expect(formatAutosaveStatus(status, guestMode)).toBe(label);
      }
    }
  });
});

describe("formatAutosaveStatus delegates to same table (no dual drift)", () => {
  it("matches plannerSaveStatusLabel for guest/member local", () => {
    expect(formatAutosaveStatus("saved", true)).toBe(
      plannerSaveStatusLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: true,
      }),
    );
    expect(formatAutosaveStatus("saved", false)).toBe(
      plannerSaveStatusLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: false,
      }),
    );
    expect(formatAutosaveStatus("error", false)).toBe("Local save failed");
  });
});

describe("plannerSaveStatusBarLabel — compact status strip (not TopBar essay)", () => {
  const local: PlannerPersistStorage = "local";

  const barCases: Array<{
    status: PlannerSaveStatus;
    guestMode: boolean;
    expected: string;
  }> = [
    { status: "idle", guestMode: true, expected: "Guest · local" },
    { status: "idle", guestMode: false, expected: "Local" },
    { status: "unsaved", guestMode: true, expected: "Unsaved" },
    { status: "unsaved", guestMode: false, expected: "Unsaved" },
    { status: "saving", guestMode: true, expected: "Saving…" },
    { status: "saving", guestMode: false, expected: "Saving…" },
    { status: "saved", guestMode: true, expected: "Draft local" },
    { status: "saved", guestMode: false, expected: "Saved local" },
    { status: "error", guestMode: true, expected: "Save failed" },
    { status: "error", guestMode: false, expected: "Save failed" },
  ];

  it.each(barCases)(
    "bar $status guest=$guestMode → $expected",
    ({ status, guestMode, expected }) => {
      const label = plannerSaveStatusBarLabel({
        status,
        storage: local,
        lastSavedAt: status === "saved" ? "2026-07-10T12:00:00.000Z" : null,
        cloudEnabled: false,
        guestMode,
      });
      expect(label).toBe(expected);
      assertLocalHonesty(label);
      // Shorter than full TopBar table (or equal only if already short).
      const full = plannerSaveStatusLabel({
        status,
        storage: local,
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode,
      });
      expect(label.length).toBeLessThanOrEqual(full.length);
    },
  );

  it("never returns bare Saved on local bar path", () => {
    const label = plannerSaveStatusBarLabel({
      status: "saved",
      storage: "local",
      lastSavedAt: "2026-07-10T12:00:00.000Z",
      cloudEnabled: false,
      guestMode: false,
    });
    expect(label).not.toMatch(/^Saved$/);
    expect(label).toBe("Saved local");
  });

  it("forces local bar wording when cloudEnabled is false even if storage claims cloud", () => {
    const label = plannerSaveStatusBarLabel({
      status: "saved",
      storage: "cloud",
      lastSavedAt: "2026-07-10T12:00:00.000Z",
      cloudEnabled: false,
      guestMode: false,
    });
    expect(label).toBe("Saved local");
    expect(label).not.toMatch(/^Saved$/);
    assertLocalHonesty(label);
  });
});
