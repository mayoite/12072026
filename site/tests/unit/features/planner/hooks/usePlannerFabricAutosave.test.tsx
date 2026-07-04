import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlannerFabricAutosave } from "@/features/planner/hooks/usePlannerFabricAutosave";
import {
  createAutoSaver,
  _getPlannerProjectId,
  loadProject,
  migrateGuestProjectToMember,
} from "@/features/planner/persistence/persistence";
import {
  applySessionWorkspace,
  buildSessionEnvelope,
  parseSessionSnapshot,
} from "@/features/planner/persistence/plannerSession";

vi.mock("@/features/planner/persistence/persistence", () => {
  const mockSaver = {
    scheduleSave: vi.fn(),
    cancel: vi.fn(),
  };
  return {
    createAutoSaver: vi.fn(() => mockSaver),
    getPlannerProjectId: vi.fn((guestMode, planId) => planId || "mock-project-id"),
    loadProject: vi.fn(),
    migrateGuestProjectToMember: vi.fn(),
  };
});

vi.mock("@/features/planner/persistence/plannerSession", () => ({
  applySessionWorkspace: vi.fn(),
  buildSessionEnvelope: vi.fn((data) => ({ store: data })),
  parseSessionSnapshot: vi.fn((snapshot) => ({ store: JSON.parse(snapshot) })),
}));

vi.mock("@/features/planner/store/workspaceStore", () => ({
  usePlannerWorkspaceStore: {
    subscribe: vi.fn(() => vi.fn()),
  },
}));

describe("usePlannerFabricAutosave", () => {
  const mockExportDraft = vi.fn();
  const mockImportDraft = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockExportDraft.mockReturnValue(JSON.stringify({ objects: [] }));
    mockImportDraft.mockResolvedValue(undefined);
  });

  it("initializes with idle status", () => {
    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, true, "plan-123")
    );

    expect(result.current.status).toBe("idle");
    expect(result.current.envelopeStatus.localSaveState).toBe("saved_local");
  });

  it("schedules persistence when schedulePersist is called", () => {
    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, true, "plan-123")
    );

    act(() => {
      result.current.schedulePersist();
    });

    expect(mockExportDraft).toHaveBeenCalledTimes(1);
    expect(buildSessionEnvelope).toHaveBeenCalledWith({ objects: [] });
    const mockSaver = vi.mocked(createAutoSaver).mock.results[0].value;
    expect(mockSaver.scheduleSave).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("saving");
    expect(result.current.envelopeStatus.localSaveState).toBe("saving_local");
  });

  it("updates status to saved when saver onSaved callback is fired", () => {
    let savedCallback: () => void = () => {};
    vi.mocked(createAutoSaver).mockImplementation((id, opts: any) => {
      savedCallback = opts.onSaved;
      return { scheduleSave: vi.fn(), cancel: vi.fn() } as any;
    });

    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, true, "plan-123")
    );

    act(() => {
      savedCallback();
    });

    expect(result.current.status).toBe("saved");
    expect(result.current.lastSavedAt).not.toBeNull();
    expect(result.current.envelopeStatus.localSaveState).toBe("saved_local");
  });

  it("updates status to error when saver onError callback is fired", () => {
    let errorCallback: (err: any) => void = () => {};
    vi.mocked(createAutoSaver).mockImplementation((id, opts: any) => {
      errorCallback = opts.onError;
      return { scheduleSave: vi.fn(), cancel: vi.fn() } as any;
    });

    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, true, "plan-123")
    );

    act(() => {
      errorCallback(new Error("Disk full"));
    });

    expect(result.current.status).toBe("error");
    expect(result.current.envelopeStatus.localSaveState).toBe("local_save_failed");
  });

  it("restores snapshot correctly", async () => {
    const mockProject = {
      snapshot: JSON.stringify({ objects: ["rect"] }),
      updatedAt: "2026-06-26T21:00:00.000Z",
    };
    vi.mocked(loadProject).mockResolvedValue(mockProject as any);

    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, false, "plan-123")
    );

    let restored = false;
    await act(async () => {
      restored = await result.current.restoreSnapshot(mockImportDraft);
    });

    expect(restored).toBe(true);
    expect(migrateGuestProjectToMember).toHaveBeenCalledTimes(1);
    expect(loadProject).toHaveBeenCalledWith("plan-123");
    expect(parseSessionSnapshot).toHaveBeenCalledWith(mockProject.snapshot);
    expect(mockImportDraft).toHaveBeenCalledWith(JSON.stringify({ objects: ["rect"] }));
    expect(applySessionWorkspace).toHaveBeenCalled();
    expect(result.current.status).toBe("saved");
    expect(result.current.lastSavedAt).toBe(new Date(mockProject.updatedAt).toISOString());
  });

  it("handles retrySave by scheduling persistence", () => {
    const { result } = renderHook(() =>
      usePlannerFabricAutosave(mockExportDraft, true, "plan-123")
    );

    act(() => {
      result.current.retrySave();
    });

    const mockSaver = vi.mocked(createAutoSaver).mock.results[0].value;
    expect(mockSaver.scheduleSave).toHaveBeenCalledTimes(1);
  });
});
