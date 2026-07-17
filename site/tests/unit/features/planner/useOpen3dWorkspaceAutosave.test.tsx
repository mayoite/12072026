/**
 * P06-A2 — usePlannerWorkspaceAutosave: projectRef freshness + visibilitychange cleanup
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";

import { usePlannerWorkspaceAutosave } from "@/features/planner/persistence/usePlannerWorkspaceAutosave";
import { createPlannerProject } from "@/features/planner/model/project";
import {
  createAutoSaver,
  getPlannerProjectId,
  loadProject,
  migrateGuestProjectToMember,
} from "@/features/planner/persistence/persistence";
import { buildPlannerSessionEnvelope } from "@/features/planner/persistence/open3dSession";
import type { PlannerProject } from "@/features/planner/model/types";

const scheduleSave = vi.fn();
const flush = vi.fn(() => Promise.resolve());
const cancel = vi.fn();

vi.mock("@/features/planner/persistence/persistence", () => ({
  createAutoSaver: vi.fn(() => ({
    scheduleSave,
    flush,
    cancel,
  })),
  getPlannerProjectId: vi.fn((guestMode: boolean, planId?: string) =>
    planId ?? (guestMode ? "guest-project" : "member-project"),
  ),
  loadProject: vi.fn(),
  migrateGuestProjectToMember: vi.fn(),
}));

describe("usePlannerWorkspaceAutosave", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    scheduleSave.mockClear();
    flush.mockClear();
    cancel.mockClear();
    vi.mocked(createAutoSaver).mockImplementation(() => ({
      scheduleSave,
      flush,
      cancel,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function parseScheduledProject(callIndex = 0): PlannerProject {
    const raw = scheduleSave.mock.calls[callIndex]?.[0] as string;
    expect(typeof raw).toBe("string");
    const envelope = JSON.parse(raw) as { project: PlannerProject };
    return envelope.project;
  }

  it("does not overwrite a restored draft during Strict Mode hydration", () => {
    const empty = createPlannerProject({
      name: "empty-before-restore",
      now: "2026-07-10T09:00:00.000Z",
    });
    const restored = createPlannerProject({
      name: "restored-from-disk",
      now: "2026-07-10T09:05:00.000Z",
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <StrictMode>{children}</StrictMode>
    );
    const { rerender } = renderHook(
      ({ project, hydrated }: { project: PlannerProject; hydrated: boolean }) =>
        usePlannerWorkspaceAutosave(project, true, "plan-hydration", {
          hydrated,
        }),
      {
        initialProps: { project: empty, hydrated: false },
        wrapper,
      },
    );

    expect(scheduleSave).not.toHaveBeenCalled();

    rerender({ project: restored, hydrated: true });

    expect(scheduleSave).not.toHaveBeenCalled();

    rerender({
      project: {
        ...restored,
        name: "edited-after-restore",
        updatedAt: "2026-07-10T09:06:00.000Z",
      },
      hydrated: true,
    });

    expect(scheduleSave).toHaveBeenCalledTimes(1);
    expect(parseScheduledProject().name).toBe("edited-after-restore");
  });

  it("exports local storage flags and isLocalSaved alias", () => {
    const project = createPlannerProject({ name: "Local flags" });
    const { result } = renderHook(() =>
      usePlannerWorkspaceAutosave(project, true, undefined, { hydrated: true }),
    );

    expect(result.current.storage).toBe("local");
    expect(result.current.cloudEnabled).toBe(false);
    expect(result.current.isLocalSaved).toBe(false);
    expect(result.current.isSynced).toBe(result.current.isLocalSaved);
    expect(result.current.status).toBe("idle");
  });

  it("schedulePersist builds envelope from latest project after mutation (projectRef)", () => {
    const initial = createPlannerProject({
      name: "v1",
      now: "2026-07-10T10:00:00.000Z",
    });
    const { result, rerender } = renderHook(
      ({ project }: { project: PlannerProject }) =>
        usePlannerWorkspaceAutosave(project, true, "plan-a", { hydrated: true }),
      { initialProps: { project: initial } },
    );

    // Skip first updatedAt effect (hydration skip) by mutating once via effect path already;
    // call schedulePersist with a stale-closure-proof mutation after rerender.
    const mutated: PlannerProject = {
      ...initial,
      name: "v2-latest",
      updatedAt: "2026-07-10T10:05:00.000Z",
    };
    rerender({ project: mutated });

    // Clear scheduleSave from the updatedAt effect so we only assert manual schedule.
    scheduleSave.mockClear();

    act(() => {
      result.current.schedulePersist();
    });

    expect(scheduleSave).toHaveBeenCalledTimes(1);
    const scheduled = parseScheduledProject(0);
    expect(scheduled.name).toBe("v2-latest");
    expect(scheduled.updatedAt).toBe("2026-07-10T10:05:00.000Z");
    expect(result.current.status).toBe("saving");
  });

  it("flushPersist builds envelope from latest project after mutation (projectRef)", async () => {
    const initial = createPlannerProject({
      name: "flush-v1",
      now: "2026-07-10T11:00:00.000Z",
    });
    const { result, rerender } = renderHook(
      ({ project }: { project: PlannerProject }) =>
        usePlannerWorkspaceAutosave(project, true, "plan-flush", { hydrated: true }),
      { initialProps: { project: initial } },
    );

    const mutated: PlannerProject = {
      ...initial,
      name: "flush-v2-latest",
      updatedAt: "2026-07-10T11:30:00.000Z",
    };
    rerender({ project: mutated });
    scheduleSave.mockClear();
    flush.mockClear();

    await act(async () => {
      await result.current.flushPersist();
    });

    expect(scheduleSave).toHaveBeenCalledTimes(1);
    expect(flush).toHaveBeenCalledTimes(1);
    const scheduled = parseScheduledProject(0);
    expect(scheduled.name).toBe("flush-v2-latest");
    expect(scheduled.updatedAt).toBe("2026-07-10T11:30:00.000Z");
  });

  it("does not capture stale project when schedulePersist identity is stable across renames", () => {
    const initial = createPlannerProject({
      name: "stable-fn-v1",
      now: "2026-07-10T12:00:00.000Z",
    });
    const { result, rerender } = renderHook(
      ({ project }: { project: PlannerProject }) =>
        usePlannerWorkspaceAutosave(project, true, "plan-stable", {
          hydrated: true,
          // Keep enabled/hydrated fixed so schedulePersist deps do not change.
        }),
      { initialProps: { project: initial } },
    );

    const scheduleFn = result.current.schedulePersist;

    const mutated: PlannerProject = {
      ...initial,
      name: "stable-fn-v2",
      // Same updatedAt so the auto effect does not fire schedulePersist.
      updatedAt: initial.updatedAt,
    };
    rerender({ project: mutated });

    expect(result.current.schedulePersist).toBe(scheduleFn);

    scheduleSave.mockClear();
    act(() => {
      // Invoke the original function reference (stale-closure trap without projectRef).
      scheduleFn();
    });

    expect(scheduleSave).toHaveBeenCalledTimes(1);
    expect(parseScheduledProject(0).name).toBe("stable-fn-v2");
  });

  it("registers and removes named visibilitychange + pagehide listeners", () => {
    const addWindow = vi.spyOn(window, "addEventListener");
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const addDoc = vi.spyOn(document, "addEventListener");
    const removeDoc = vi.spyOn(document, "removeEventListener");

    const project = createPlannerProject({ name: "listeners" });
    const { unmount } = renderHook(() =>
      usePlannerWorkspaceAutosave(project, true, "plan-listen", { hydrated: true }),
    );

    const pagehideAdd = addWindow.mock.calls.find((c) => c[0] === "pagehide");
    const pagehideRemove = () =>
      removeWindow.mock.calls.find((c) => c[0] === "pagehide");
    const visAdd = addDoc.mock.calls.find((c) => c[0] === "visibilitychange");

    expect(pagehideAdd).toBeDefined();
    expect(visAdd).toBeDefined();
    expect(typeof pagehideAdd?.[1]).toBe("function");
    expect(typeof visAdd?.[1]).toBe("function");

    const pagehideHandler = pagehideAdd![1];
    const visHandler = visAdd![1];

    unmount();

    const pagehideRem = pagehideRemove();
    const visRem = removeDoc.mock.calls.find((c) => c[0] === "visibilitychange");
    expect(pagehideRem).toBeDefined();
    expect(visRem).toBeDefined();
    // Same function reference must be removed (anonymous lambdas would fail this).
    expect(pagehideRem![1]).toBe(pagehideHandler);
    expect(visRem![1]).toBe(visHandler);
  });

  it("flushPending on visibility hidden calls saver.flush", () => {
    const project = createPlannerProject({ name: "vis-flush" });
    renderHook(() =>
      usePlannerWorkspaceAutosave(project, true, "plan-vis", { hydrated: true }),
    );

    flush.mockClear();
    const visibilityState = vi.spyOn(document, "visibilityState", "get");
    visibilityState.mockReturnValue("hidden");

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(flush).toHaveBeenCalled();
    visibilityState.mockRestore();
  });

  it("marks isLocalSaved true when onSaved fires", () => {
    let onSaved: (() => void) | undefined;
    vi.mocked(createAutoSaver).mockImplementation((_id, opts) => {
      onSaved = opts?.onSaved;
      return { scheduleSave, flush, cancel };
    });

    const project = createPlannerProject({ name: "saved" });
    const { result } = renderHook(() =>
      usePlannerWorkspaceAutosave(project, true, "plan-saved", { hydrated: true }),
    );

    act(() => {
      onSaved?.();
    });

    expect(result.current.status).toBe("saved");
    expect(result.current.isLocalSaved).toBe(true);
    expect(result.current.isSynced).toBe(true);
    expect(result.current.lastSavedAt).not.toBeNull();
  });

  it("wires createAutoSaver with planner project id", () => {
    const project = createPlannerProject({ name: "id-wire" });
    renderHook(() =>
      usePlannerWorkspaceAutosave(project, false, "member-plan-9", {
        hydrated: true,
        ownerId: "owner-9",
      }),
    );

    expect(getPlannerProjectId).toHaveBeenCalledWith(
      false,
      "member-plan-9",
      "owner-9",
    );
    expect(createAutoSaver).toHaveBeenCalledWith(
      "member-plan-9",
      expect.objectContaining({
        onSaved: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it("buildPlannerSessionEnvelope shape is what scheduleSave receives", () => {
    const project = createPlannerProject({
      name: "envelope-shape",
      now: "2026-07-10T13:00:00.000Z",
    });
    const { result, rerender } = renderHook(
      ({ project: p }: { project: PlannerProject }) =>
        usePlannerWorkspaceAutosave(p, true, "plan-env", { hydrated: true }),
      { initialProps: { project } },
    );

    // Advance past hydration skip.
    rerender({
      project: { ...project, updatedAt: "2026-07-10T13:01:00.000Z", name: "envelope-shape" },
    });
    scheduleSave.mockClear();

    act(() => {
      result.current.schedulePersist();
    });

    const raw = scheduleSave.mock.calls[0]?.[0] as string;
    const parsed = JSON.parse(raw) as ReturnType<typeof buildPlannerSessionEnvelope>;
    expect(parsed.version).toBe("open3d-1");
    expect(parsed.engine).toBe("open3d");
    expect(parsed.project.name).toBe("envelope-shape");
    expect(typeof parsed.updatedAt).toBe("string");
  });

  it("restoreSnapshot loads via persistence and returns parsed project", async () => {
    const live = createPlannerProject({ name: "from-disk", now: "2026-07-10T14:00:00.000Z" });
    const envelope = buildPlannerSessionEnvelope(live);
    vi.mocked(loadProject).mockResolvedValue({
      snapshot: JSON.stringify(envelope),
      updatedAt: live.updatedAt,
    } as Awaited<ReturnType<typeof loadProject>>);

    const { result } = renderHook(() =>
      usePlannerWorkspaceAutosave(live, false, "plan-restore", { hydrated: true }),
    );

    let restored: PlannerProject | null = null;
    await act(async () => {
      restored = await result.current.restoreSnapshot();
    });

    expect(migrateGuestProjectToMember).toHaveBeenCalledWith(
      undefined,
      "plan-restore",
      undefined,
    );
    expect(loadProject).toHaveBeenCalledWith("plan-restore");
    expect(restored?.name).toBe("from-disk");
  });
});
