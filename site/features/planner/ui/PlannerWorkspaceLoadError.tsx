"use client";

/**
 * Deploy P0: never leave guests on a dead white/loading wall when the
 * workspace chunk fails or hangs past a safe timeout.
 */
export function PlannerWorkspaceLoadError({
  message = "The planner workspace failed to load.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex h-[100dvh] min-h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-[color:var(--surface-page)] px-6 text-center"
      role="alert"
      data-testid="planner-workspace-load-error"
    >
      <h1 className="text-xl font-semibold text-strong">Workspace unavailable</h1>
      <p className="max-w-md text-sm text-muted">{message}</p>
      <p className="max-w-md text-xs text-muted">
        Guest plans save in this browser only. If this keeps happening, hard-refresh or try
        another browser.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className="btn-primary min-h-11 px-5"
          onClick={() => {
            if (onRetry) onRetry();
            else if (typeof window !== "undefined") window.location.reload();
          }}
        >
          Retry
        </button>
        <a href="/planner/" className="btn-outline min-h-11 px-5 inline-flex items-center">
          Back to planner home
        </a>
      </div>
    </div>
  );
}
