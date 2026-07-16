"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ProjectSetupStep } from "./ProjectSetupStep";
import { isProjectSetupCompleteInStorage } from "./projectSetup";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";

type ProjectSetupGateProps = {
  guestMode?: boolean;
  planId?: string;
  children: ReactNode;
};

/** Max time on skeleton before we force setup UI (deploy P0 — no infinite gate). */
const HYDRATE_FAILSAFE_MS = 2_000;

/**
 * Blocks the canvas until project setup is complete.
 * Always exits skeleton: setup form, or children if storage says complete.
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
          setIsFullyComplete(true);
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
