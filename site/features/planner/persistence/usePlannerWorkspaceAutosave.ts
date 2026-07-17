"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createAutoSaver,
  getPlannerProjectId,
  loadProject,
  migrateGuestProjectToMember,
} from "@/features/planner/persistence/persistence";
import type { PlannerProject } from "../model/types";
import { exportPlannerProjectJson } from "./projectJson";
import { buildPlannerSessionEnvelope, parsePlannerSessionSnapshot } from "./open3dSession";

export type PlannerSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export function usePlannerWorkspaceAutosave(
  project: PlannerProject,
  guestMode: boolean,
  planId?: string,
  options?: { enabled?: boolean; hydrated?: boolean; ownerId?: string },
) {
  const enabled = options?.enabled ?? true;
  const hydrated = options?.hydrated ?? true;
  const ownerId = options?.ownerId;
  const projectId = getPlannerProjectId(guestMode, planId, ownerId);
  const [status, setStatus] = useState<PlannerSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );
  const saverRef = useRef<ReturnType<typeof createAutoSaver> | null>(null);
  const mountedRef = useRef(false);
  const autosaveGenerationRef = useRef(0);
  const didScheduleAfterHydrationRef = useRef(false);
  /** Always holds the latest project so schedule/flush never close over a stale snapshot. */
  const projectRef = useRef(project);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    const updateConnection = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  const schedulePersist = useCallback(() => {
    if (!enabled || !hydrated) return;
    if (!mountedRef.current) return;
    const envelope = buildPlannerSessionEnvelope(projectRef.current);
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

  const restoreSnapshot = useCallback(async (): Promise<PlannerProject | null> => {
    try {
      if (!guestMode) {
        await migrateGuestProjectToMember(undefined, planId, ownerId);
      }
      const existing = await loadProject(projectId);
      if (!existing?.snapshot?.trim()) return null;
      return parsePlannerSessionSnapshot(existing.snapshot);
    } catch (error) {
      console.warn(
        "[planner] Autosave restore failed:",
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }, [guestMode, ownerId, planId, projectId]);

  const exportSnapshot = useCallback(
    () => exportPlannerProjectJson(projectRef.current),
    [],
  );

  const flushPersist = useCallback(async () => {
    if (!enabled || !hydrated) return;
    const envelope = buildPlannerSessionEnvelope(projectRef.current);
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
    isOffline,
  };
}
