import { describe, expect, it } from "vitest";
import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
  plannerSaveButtonLabel,
  plannerSaveStatusBarLabel,
  plannerSaveStatusLabel,
  resolvePlannerSaveChrome,
  toPlannerSaveUiState,
} from "@/features/planner/editor/workspaceStatusLabels";
import type { PlannerSaveStatus } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";

describe("workspaceStatusLabels", () => {
  it("formats tool · shortcut · view compactly", () => {
    expect(formatToolStatus("wall", "2d")).toBe("Wall · W · 2D");
    expect(formatToolStatus("select", "3d")).toBe("Select · V · 3D");
  });

  it("formats snap and selection status", () => {
    expect(formatSnapStatus("none")).toBeNull();
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
    expect(formatSelectionStatus({ type: "wall", ids: ["w1"] })).toBe("Wall selected");
    expect(formatSelectionStatus({ type: "furniture", ids: ["a", "b"] })).toBe(
      "2 furnitures selected",
    );
    expect(formatSelectionStatus({ type: "none", ids: [] })).toBeNull();
  });
});

describe("resolvePlannerSaveChrome — single save UI map", () => {
  const base = {
    storage: "local" as const,
    lastSavedAt: null as string | null,
    cloudEnabled: false,
  };

  it("maps persistence statuses to uiState (dirty + offline)", () => {
    expect(toPlannerSaveUiState("idle")).toBe("idle");
    expect(toPlannerSaveUiState("unsaved")).toBe("dirty");
    expect(toPlannerSaveUiState("saving")).toBe("saving");
    expect(toPlannerSaveUiState("saved")).toBe("saved");
    expect(toPlannerSaveUiState("error")).toBe("error");
    expect(toPlannerSaveUiState("unsaved", true)).toBe("offline");
    expect(toPlannerSaveUiState("saving", true)).toBe("offline");
  });

  it("documents one button + one short status per state (local member)", () => {
    const cases: Array<{
      status: PlannerSaveStatus;
      button: string;
      statusLabel: string;
      uiState: string;
    }> = [
      { status: "idle", button: "Save", statusLabel: "Ready · local", uiState: "idle" },
      { status: "unsaved", button: "Save", statusLabel: "Unsaved", uiState: "dirty" },
      { status: "saving", button: "Saving…", statusLabel: "Local", uiState: "saving" },
      { status: "saved", button: "Save", statusLabel: "Saved local", uiState: "saved" },
      { status: "error", button: "Retry save", statusLabel: "Save failed", uiState: "error" },
    ];

    for (const row of cases) {
      const chrome = resolvePlannerSaveChrome({
        ...base,
        status: row.status,
        guestMode: false,
      });
      expect(chrome.buttonLabel).toBe(row.button);
      expect(chrome.statusLabel).toBe(row.statusLabel);
      expect(chrome.uiState).toBe(row.uiState);
      expect(chrome.dataStatus).toBe(row.status);
    }
  });

  it("guest button stays Save draft except saving/error", () => {
    expect(
      resolvePlannerSaveChrome({ ...base, status: "idle", guestMode: true }).buttonLabel,
    ).toBe("Save draft");
    expect(
      resolvePlannerSaveChrome({ ...base, status: "unsaved", guestMode: true }).buttonLabel,
    ).toBe("Save draft");
    expect(
      resolvePlannerSaveChrome({ ...base, status: "saved", guestMode: true }).buttonLabel,
    ).toBe("Save draft");
    expect(
      resolvePlannerSaveChrome({ ...base, status: "saving", guestMode: true }).buttonLabel,
    ).toBe("Saving…");
    expect(
      resolvePlannerSaveChrome({ ...base, status: "error", guestMode: true }).buttonLabel,
    ).toBe("Retry save");
  });

  it("saving never puts a Saving verb on both button and status", () => {
    for (const guestMode of [true, false]) {
      for (const storage of ["local", "cloud"] as const) {
        const chrome = resolvePlannerSaveChrome({
          status: "saving",
          storage,
          lastSavedAt: null,
          cloudEnabled: storage === "cloud",
          guestMode,
        });
        expect(chrome.buttonLabel).toMatch(/Saving/i);
        expect(chrome.statusLabel).not.toMatch(/Saving/i);
        // Exactly one "Saving" surface in the chrome pair
        const mentions = [chrome.buttonLabel, chrome.statusLabel].filter((s) =>
          /saving/i.test(s),
        );
        expect(mentions).toHaveLength(1);
      }
    }
  });

  it("dirty shows one dirty label on status; button is CTA not Unsaved", () => {
    const chrome = resolvePlannerSaveChrome({
      ...base,
      status: "unsaved",
      guestMode: false,
    });
    expect(chrome.statusLabel).toBe("Unsaved");
    expect(chrome.buttonLabel).not.toMatch(/unsaved/i);
    expect(chrome.uiState).toBe("dirty");
  });

  it("plannerSaveStatusLabel / bar / button all read the same map", () => {
    const input = {
      status: "saving" as const,
      storage: "local" as const,
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: true,
    };
    const chrome = resolvePlannerSaveChrome(input);
    expect(plannerSaveStatusLabel(input)).toBe(chrome.statusLabel);
    expect(plannerSaveStatusBarLabel(input)).toBe(chrome.statusLabel);
    expect(plannerSaveButtonLabel(input)).toBe(chrome.buttonLabel);
    expect(formatAutosaveStatus("saving", true)).toBe(chrome.statusLabel);
  });

  it("never implies cloud when cloudEnabled is false", () => {
    const label = plannerSaveStatusLabel({
      status: "saved",
      storage: "cloud",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: false,
    });
    expect(label).toBe("Saved local");
    expect(label.toLowerCase()).not.toMatch(/account|cloud/);
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
    ).toBe("Account");
    expect(
      plannerSaveStatusLabel({
        status: "saved",
        storage: "cloud",
        lastSavedAt: "2026-07-10T12:00:00.000Z",
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Account OK");
    expect(
      plannerSaveStatusLabel({
        status: "idle",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Ready · account");
  });

  it("offline prefixes short status without hiding base state", () => {
    expect(
      plannerSaveStatusLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: false,
        isOffline: true,
      }),
    ).toBe("Offline · Saved local");
    expect(
      plannerSaveStatusLabel({
        status: "idle",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: false,
        isOffline: true,
      }),
    ).toBe("Offline");
    expect(
      resolvePlannerSaveChrome({
        status: "saving",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: false,
        isOffline: true,
      }).buttonLabel,
    ).toBe("Saving…");
  });

  it("local labels stay honest (no bare Saved, no account lies)", () => {
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
        expect(label).not.toMatch(/^Saved$/);
        expect(label.toLowerCase()).not.toContain("account");
        expect(label.toLowerCase()).not.toContain("cloud");
      }
    }
  });
});
