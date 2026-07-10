"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createAutoSaver,
  getPlannerProjectId,
  loadProject,
  migrateGuestProjectToMember,
} from "@/features/planner/persistence/persistence";
import type { Open3dProject } from "../model/types";
import { exportOpen3dProjectJson } from "./projectJson";
import { buildOpen3dSessionEnvelope, parseOpen3dSessionSnapshot } from "./open3dSession";

export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export function useOpen3dWorkspaceAutosave(
  project: Open3dProject,
  guestMode: boolean,
  planId?: string,
  options?: { enabled?: boolean; hydrated?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const hydrated = options?.hydrated ?? true;
  const projectId = getPlannerProjectId(guestMode, planId);
  const [status, setStatus] = useState<Open3dSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saverRef = useRef<ReturnType<typeof createAutoSaver> | null>(null);
  const mountedRef = useRef(false);
  const autosaveGenerationRef = useRef(0);
  const didScheduleAfterHydrationRef = useRef(false);
  /** Always holds the latest project so schedule/flush never close over a stale snapshot. */
  const projectRef = useRef(project);
  projectRef.current = project;

  const schedulePersist = useCallback(() => {
    if (!enabled || !hydrated) return;
    if (!mountedRef.current) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
  }, [enabled, hydrated]);

  useEffect(() => {
    if (!enabled) return;
    mountedRef.current = true;
    const generation = ++autosaveGenerationRef.current;
    saverRef.current = createAutoSaver(projectId, {
      onSaved: () => {
        if (!mountedRef.current || autosaveGenerationRef.current !== generation) return;
        setStatus("saved");
        setLastSavedAt(new Date().toISOString());
      },
      onError: () => {
        if (!mountedRef.current || autosaveGenerationRef.current !== generation) return;
        setStatus("error");
      },
    });

    const flushPending = () => {
      void saverRef.current?.flush?.();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushPending();
    };
    window.addEventListener("pagehide", flushPending);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      autosaveGenerationRef.current += 1;
      window.removeEventListener("pagehide", flushPending);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Flush before cancel so leave/unmount does not drop debounced work.
      const saver = saverRef.current;
      void saver?.flush?.().finally(() => {
        saver?.cancel();
      });
      saverRef.current = null;
    };
  }, [enabled, projectId]);

  useEffect(() => {
    if (!enabled || !hydrated) return;
    if (!didScheduleAfterHydrationRef.current) {
      didScheduleAfterHydrationRef.current = true;
      return;
    }
    setStatus("unsaved");
    schedulePersist();
  }, [enabled, hydrated, project.updatedAt, schedulePersist]);

  const restoreSnapshot = useCallback(async (): Promise<Open3dProject | null> => {
    try {
      if (!guestMode) {
        await migrateGuestProjectToMember();
      }
      const existing = await loadProject(projectId);
      if (!existing?.snapshot?.trim()) return null;
      return parseOpen3dSessionSnapshot(existing.snapshot);
    } catch {
      return null;
    }
  }, [guestMode, projectId]);

  const exportSnapshot = useCallback(
    () => exportOpen3dProjectJson(projectRef.current),
    [],
  );

  const flushPersist = useCallback(async () => {
    if (!enabled || !hydrated) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
    await saverRef.current?.flush?.();
  }, [enabled, hydrated]);

  const isLocalSaved = status === "saved";

  return {
    status,
    lastSavedAt,
    restoreSnapshot,
    schedulePersist,
    flushPersist,
    exportSnapshot,
    storage: "local" as const,
    cloudEnabled: false as const,
    isLocalSaved,
    /** @deprecated Prefer isLocalSaved — temporary alias while consumers migrate. */
    isSynced: isLocalSaved,
    isModified: status === "unsaved" || status === "saving",
  };
}
