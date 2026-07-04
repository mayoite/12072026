import { useEffect, useRef } from "react";
import { usePlannerWorkspaceStore } from "@/features/planner/store/workspaceStore";
import { getStepToolBinding } from "@/features/planner/editor/plannerStepBindings";
import type { Tool } from "@/features/planner/store/plannerStore";

type UsePlannerWorkspaceBootstrapOptions = {
  freshRequested: boolean;
  handleStartFreshLayout: () => Promise<void>;
  importDraft: (json: string) => Promise<void>;
  restoreSnapshot: (importDraft: (json: string) => Promise<void>) => Promise<boolean>;
  setPlannerTool: (tool: Tool) => void;
};

export function usePlannerWorkspaceBootstrap({
  freshRequested,
  handleStartFreshLayout,
  importDraft,
  restoreSnapshot,
  setPlannerTool,
}: UsePlannerWorkspaceBootstrapOptions) {
  const didBootstrapRef = useRef(false);

  useEffect(() => {
    if (didBootstrapRef.current) return;
    didBootstrapRef.current = true;
    let cancelled = false;

    const initialBinding = getStepToolBinding(usePlannerWorkspaceStore.getState().plannerStep);
    setPlannerTool(initialBinding.plannerTool);

    void (async () => {
      if (cancelled) return;
      if (freshRequested) {
        await handleStartFreshLayout();
        return;
      }
      if (cancelled) return;
      await restoreSnapshot(importDraft);
    })();
    return () => {
      cancelled = true;
    };
  }, [freshRequested, handleStartFreshLayout, importDraft, restoreSnapshot, setPlannerTool]);
}

export function usePlannerSelectionPanel({
  isCompact,
  rightOpen,
  selectionStatus,
  setRightOpen,
}: {
  isCompact: boolean;
  rightOpen: boolean;
  selectionStatus: unknown;
  setRightOpen: (open: boolean) => void;
}) {
  const selectionOpenedRightPanelRef = useRef(false);

  useEffect(() => {
    if (isCompact) {
      selectionOpenedRightPanelRef.current = false;
      return;
    }

    const hasSelection = Boolean(selectionStatus);
    if (hasSelection && !rightOpen) {
      setRightOpen(true);
      selectionOpenedRightPanelRef.current = true;
      return;
    }

    if (!hasSelection && selectionOpenedRightPanelRef.current) {
      setRightOpen(false);
      selectionOpenedRightPanelRef.current = false;
    }
  }, [isCompact, rightOpen, selectionStatus, setRightOpen]);
}
