import { useEffect, useState } from "react";
import { usePlannerCatalogStore } from "@/features/planner/catalog/catalogStore";
import {
  readPlannerWorkspacePreferences,
  writePlannerWorkspacePreferences,
} from "@/features/planner/editor/plannerWorkspacePreferences";

export function usePlannerShellVisible() {
  const [shellVisible, setShellVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setShellVisible(true);
      performance.mark("planner-shell-visible");
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return shellVisible;
}

export function usePlannerWorkspacePreferences() {
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "split">("2d");
  const [preferencesHydrated, setPreferencesHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const saved = readPlannerWorkspacePreferences();
      setViewMode(saved.viewMode);
      usePlannerCatalogStore.getState().setQuery(saved.catalogQuery);
      setPreferencesHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!preferencesHydrated) return;
    writePlannerWorkspacePreferences({ viewMode });
  }, [preferencesHydrated, viewMode]);

  useEffect(() => usePlannerCatalogStore.subscribe((state) => {
    writePlannerWorkspacePreferences({ catalogQuery: state.query });
  }), []);

  return {
    viewMode,
    setViewMode,
    preferencesHydrated,
  };
}
