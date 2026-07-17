"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  GUEST_DEFAULT_PROJECT_NAME,
  applyProjectSetup,
  createDefaultProjectSetupDraft,
  isProjectSetupCompleteInStorage,
  markProjectSetupCompleteInStorage,
  metadataToSpaceSuggestInput,
  resolveGuestSetupSubmit,
  writePlannerStartupIntent,
  type PlannerProjectMetadata,
} from "./projectSetup";
import { ProjectSetupStep } from "./ProjectSetupStep";
import { suggestLayoutGridPack } from "@/features/planner/ai/spaceSuggest";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

type ProjectSetupGateProps = {
  guestMode?: boolean;
  planId?: string;
  children: ReactNode;
};

/** Max time on skeleton before we force setup UI (deploy P0 — no infinite gate). */
const HYDRATE_FAILSAFE_MS = 2_000;

/**
 * Guest path: defaults fill every required field, so skip the multi-field essay.
 * Marks storage complete and seeds a starter layout (template).
 * Returns false on storage failure so the form can still show.
 */
export function tryCompleteGuestSetupWithDefaults(planId?: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const draft = {
      ...createDefaultProjectSetupDraft({ guestMode: true }),
      projectName: GUEST_DEFAULT_PROJECT_NAME,
    };
    const resolved = resolveGuestSetupSubmit(draft);
    const metadata: PlannerProjectMetadata = {
      ...draft,
      projectName: resolved.projectName,
      floorAreaSqFt: resolved.floorAreaSqFt,
      seatTarget: resolved.seatTarget,
      completedAt: new Date().toISOString(),
    };

    applyProjectSetup(metadata);
    usePlannerWorkspaceStore.getState().setPendingBootstrapLayout(
      suggestLayoutGridPack(metadataToSpaceSuggestInput(metadata)),
    );
    writePlannerStartupIntent("template", true, planId);
    markProjectSetupCompleteInStorage(true, planId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Blocks the canvas until project setup is complete.
 * Guest: skip form when storage says complete, or auto-apply defaults (one-step canvas).
 * Member: always exits skeleton → setup form, or children if storage says complete.
 */
export function ProjectSetupGate({
  guestMode = false,
  planId,
  children,
}: ProjectSetupGateProps) {
  const [isFullyComplete, setIsFullyComplete] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let done = false;

    const finishHydrate = () => {
      if (cancelled || done) return;
      done = true;
      try {
        if (isProjectSetupCompleteInStorage(guestMode, planId)) {
          // Prefer skip when guest (or member) already has a completed draft.
          setIsFullyComplete(true);
        } else if (guestMode) {
          // Guest: no required fields missing under defaults — skip multi-field essay.
          if (tryCompleteGuestSetupWithDefaults(planId)) {
            setIsFullyComplete(true);
          }
        }
      } catch {
        setIsFullyComplete(false);
      }
      setIsHydrated(true);
    };

    // Immediate tick (tests + snappy guest) + failsafe if timers are delayed.
    const quick = window.setTimeout(finishHydrate, 0);
    const failsafe = window.setTimeout(finishHydrate, HYDRATE_FAILSAFE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(quick);
      window.clearTimeout(failsafe);
    };
  }, [guestMode, planId]);

  if (!isHydrated) {
    return <PlannerSkeleton />;
  }

  if (isFullyComplete) {
    return <>{children}</>;
  }

  return (
    <ProjectSetupStep
      guestMode={guestMode}
      planId={planId}
      onComplete={() => setIsFullyComplete(true)}
    />
  );
}
