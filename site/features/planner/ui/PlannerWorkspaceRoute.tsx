"use client";

import { Component, useCallback, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

import { Providers } from "@/features/planner/components/Providers";
import { ProjectSetupGate } from "@/features/planner/onboarding/ProjectSetupGate";
import { PlannerHost } from "@/features/planner/ui/PlannerHost";
import { PlannerCanvasEnhancements } from "@/features/planner/ui/PlannerCanvasEnhancements";
import { PlannerSkeleton } from "@/features/planner/ui/PlannerSkeleton";
import { PlannerWorkspaceLoadError } from "@/features/planner/ui/PlannerWorkspaceLoadError";

/** Soft cap so a hung dynamic import cannot block deploy forever. */
const WORKSPACE_LOAD_TIMEOUT_MS = 25_000;

class PlannerHostErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error) => void },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error);
    if (typeof console !== "undefined") {
      console.error("[planner] workspace crash", error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <PlannerWorkspaceLoadError
          message={this.state.error.message || "Planner workspace crashed while starting."}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

function WorkspaceWithLoadTimeout({
  guestMode,
  planId,
}: {
  guestMode: boolean;
  planId?: string;
}) {
  const [timedOut, setTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setTimedOut(false);
    const id = window.setTimeout(() => {
      const hostMounted = Boolean(
        document.querySelector(".planner-route-host, .open3d-route-host"),
      );
      if (!hostMounted) {
        setTimedOut(true);
      }
    }, WORKSPACE_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [retryKey, guestMode, planId]);

  const retry = useCallback(() => {
    setTimedOut(false);
    setRetryKey((k) => k + 1);
  }, []);

  if (timedOut) {
    return (
      <PlannerWorkspaceLoadError
        message="The workspace took too long to start. This is often a slow first load or a blocked script."
        onRetry={retry}
      />
    );
  }

  return (
    <PlannerHostErrorBoundary key={retryKey}>
      {/* TW4 planner-fill + locked host CSS both stretch this under #main-content */}
      <div data-planner-workspace-root className="planner-route-fill planner-fill">
        <PlannerHost guestMode={guestMode} planId={planId} />
        <PlannerCanvasEnhancements guestMode={guestMode} />
      </div>
    </PlannerHostErrorBoundary>
  );
}

/** Live guest/canvas planner shell — workspace feature tree (Fabric + Three). */
export function PlannerWorkspaceRoute({
  guestMode = false,
  planId,
}: {
  guestMode?: boolean;
  planId?: string;
}) {
  return (
    <Providers>
      <ProjectSetupGate guestMode={guestMode} planId={planId}>
        <WorkspaceWithLoadTimeout guestMode={guestMode} planId={planId} />
      </ProjectSetupGate>
    </Providers>
  );
}
