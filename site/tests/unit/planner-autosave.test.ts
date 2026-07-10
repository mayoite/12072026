/**
 * planner-autosave.test.ts
 * P06 — createAutoSaver flush, cancel, debounce, no silent drop (write-proof)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAutoSaver,
  shouldMigrateGuestPlan,
  GUEST_PROJECT_ID,
  MEMBER_PROJECT_ID,
  type PlannerProject,
  type AutoSaverDeps,
} from "@/features/planner/persistence/persistence";

function makeProject(id: string, snapshot = ""): PlannerProject {
  return { id, name: id, createdAt: 1, updatedAt: 2, snapshot };
}

function makeDeps(overrides?: Partial<AutoSaverDeps>): AutoSaverDeps {
  return {
    loadProject: vi.fn().mockResolvedValue(undefined),
    saveProject: vi.fn().mockResolvedValue(undefined),
    saveHistoryEntry: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

// ─── createAutoSaver flush + write semantics (P06 residual) ─────────────────

describe("createAutoSaver flush + write semantics (P06)", () => {
  const snapA = JSON.stringify({ version: 1, tag: "A" });
  const snapB = JSON.stringify({ version: 1, tag: "B" });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns scheduleSave, flush, and cancel", () => {
    const deps = makeDeps();
    const saver = createAutoSaver("any-id", {}, deps);
    expect(typeof saver.scheduleSave).toBe("function");
    expect(typeof saver.flush).toBe("function");
    expect(typeof saver.cancel).toBe("function");
    saver.cancel();
  });

  it("flush() is safe when idle (no write)", async () => {
    const deps = makeDeps();
    const saver = createAutoSaver("idle-flush", {}, deps);
    await expect(saver.flush()).resolves.toBeUndefined();
    expect(deps.saveProject).not.toHaveBeenCalled();
    saver.cancel();
  });

  it("flush after scheduleSave persists last pending without waiting 5s", async () => {
    const deps = makeDeps();
    const onSaved = vi.fn();
    const saver = createAutoSaver("flush-now", { onSaved }, deps);
    saver.scheduleSave(snapA);
    await saver.flush();
    expect(deps.saveProject).toHaveBeenCalledTimes(1);
    expect(deps.saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    expect(deps.saveProject.mock.calls[0]?.[0]?.id).toBe("flush-now");
    expect(onSaved).toHaveBeenCalled();
    expect(onSaved.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    saver.cancel();
  });

  it("scheduleSave then scheduleSave keeps latest snapshot for flush", async () => {
    const deps = makeDeps();
    const saver = createAutoSaver("latest-pending", {}, deps);
    saver.scheduleSave(snapA);
    saver.scheduleSave(snapB);
    await saver.flush();
    expect(deps.saveProject).toHaveBeenCalledTimes(1);
    expect(deps.saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapB);
    saver.cancel();
  });

  it("cancel after schedule does not write", async () => {
    const deps = makeDeps();
    const saver = createAutoSaver("cancel-drop", {}, deps);
    saver.scheduleSave(snapA);
    saver.cancel();
    await vi.advanceTimersByTimeAsync(6000);
    expect(deps.saveProject).not.toHaveBeenCalled();
  });

  it("debounced schedule eventually writes pending snapshot", async () => {
    const deps = makeDeps();
    const saver = createAutoSaver("debounce-write", {}, deps);
    saver.scheduleSave(snapA);
    await vi.advanceTimersByTimeAsync(5000);
    await Promise.resolve();
    await Promise.resolve();
    expect(deps.saveProject).toHaveBeenCalled();
    expect(deps.saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    saver.cancel();
  });

  it("second schedule shortly after save still persists latest (no silent forever drop)", async () => {
    const deps = makeDeps();
    const saver = createAutoSaver("no-double-gate-drop", {}, deps);
    saver.scheduleSave(snapA);
    await saver.flush();
    vi.mocked(deps.saveProject).mockClear();
    saver.scheduleSave(snapB);
    await vi.advanceTimersByTimeAsync(5000);
    await Promise.resolve();
    await Promise.resolve();
    expect(deps.saveProject).toHaveBeenCalled();
    expect(deps.saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapB);
    saver.cancel();
  });

  it("flush writes open3d session envelope snapshot as-is (identity payload)", async () => {
    const envelope = {
      version: "open3d-1",
      engine: "open3d",
      project: {
        id: "project-uuid-1",
        floors: [{ id: "floor-1", walls: [{ id: "wall-uuid-a" }], furniture: [{ id: "furn-uuid-b" }] }],
      },
      updatedAt: "2026-07-10T12:00:00.000Z",
    };
    const snap = JSON.stringify(envelope);
    const deps = makeDeps();
    const saver = createAutoSaver("planner-guest-local", {}, deps);
    saver.scheduleSave(snap);
    await saver.flush();
    expect(deps.saveProject).toHaveBeenCalledTimes(1);
    const written = deps.saveProject.mock.calls[0]?.[0]?.snapshot as string;
    expect(written).toBe(snap);
    const parsed = JSON.parse(written) as typeof envelope;
    expect(parsed.project.id).toBe("project-uuid-1");
    expect(parsed.project.floors[0]?.walls[0]?.id).toBe("wall-uuid-a");
    expect(parsed.project.floors[0]?.furniture[0]?.id).toBe("furn-uuid-b");
    saver.cancel();
  });
});

// ─── shouldMigrateGuestPlan (compact re-run for regression) ──────────────────

describe("shouldMigrateGuestPlan quick regression", () => {
  const snap = JSON.stringify({ v: 1 });

  it("migrates guest→member when member is empty and not claimed", () => {
    expect(shouldMigrateGuestPlan(makeProject(GUEST_PROJECT_ID, snap), undefined, false)).toBe(true);
  });

  it("does not migrate if member already has data", () => {
    expect(
      shouldMigrateGuestPlan(
        makeProject(GUEST_PROJECT_ID, snap),
        makeProject(MEMBER_PROJECT_ID, snap),
        false,
      ),
    ).toBe(false);
  });
});
