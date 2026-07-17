"use client";

/**
 * Full-viewport planner loading shell while Fabric/Three lazy-load.
 * Mirrors WorkspaceShell density: slim top bar + canvas + status strip so the
 * page is never a blank strip and layout does not jump on hydrate.
 */

export function PlannerSkeleton() {
  return (
    <div
      className="planner-skeleton flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-[color:var(--surface-page)]"
      aria-label="Loading planner..."
      role="status"
      data-planner-surface="paper"
      data-planner-density="compact"
      data-chrome-mode="slim"
    >
      {/* Left tool rail — compact width matches live CanvasToolRail */}
      <div className="flex w-10 shrink-0 flex-col items-center gap-1.5 border-r border-[color:var(--border-soft)] bg-[color:var(--surface-page)] py-2 sm:w-12 sm:gap-2 sm:py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="planner-skeleton__shimmer h-7 w-7 rounded-md sm:h-8 sm:w-8 sm:rounded-lg" />
        ))}
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — denser on phone/tablet (h-10 / sm:h-11) */}
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[color:var(--border-soft)] px-2 sm:h-11 sm:gap-3 sm:px-3">
          <div className="planner-skeleton__shimmer h-5 w-24 rounded sm:h-6 sm:w-32" />
          <div className="planner-skeleton__shimmer hidden h-5 w-16 rounded sm:block" />
          <div className="flex-1" />
          <div className="planner-skeleton__shimmer h-7 w-16 rounded-md sm:h-8 sm:w-20 sm:rounded-lg" />
          <div className="planner-skeleton__shimmer h-7 w-14 rounded-md sm:h-8 sm:w-20 sm:rounded-lg" />
        </div>

        {/* Workflow strip placeholder (matches PlannerWorkflowBar height) */}
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-[color:var(--border-soft)] px-2 sm:h-10 sm:px-3">
          <div className="planner-skeleton__shimmer h-6 flex-1 rounded-md" />
          <div className="planner-skeleton__shimmer h-6 flex-1 rounded-md" />
          <div className="planner-skeleton__shimmer h-6 flex-1 rounded-md" />
        </div>

        <div className="relative min-h-0 flex-1 bg-[color:var(--surface-canvas,var(--surface-soft))]">
          <div className="planner-skeleton__grid absolute inset-0 opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="planner-skeleton__shimmer h-12 w-12 rounded-lg sm:h-16 sm:w-16 sm:rounded-xl" />
              <p className="text-xs font-medium text-muted sm:text-sm">Loading workspace…</p>
            </div>
          </div>
        </div>

        {/* Status strip — metrics only; save chrome lives in TopBar, not here */}
        <div
          className="flex h-7 shrink-0 items-center gap-2 border-t border-[color:var(--border-soft)] px-2 sm:h-8 sm:px-3"
          data-save-authority="topbar"
          aria-hidden
        >
          <div className="planner-skeleton__shimmer h-3 w-20 rounded" />
          <div className="planner-skeleton__shimmer h-3 w-16 rounded" />
          <div className="flex-1" />
          <div className="planner-skeleton__shimmer hidden h-3 w-12 rounded sm:block" />
        </div>
      </div>

      {/* Right panel — hidden on phone for canvas share */}
      <div className="hidden w-56 shrink-0 flex-col gap-2 border-l border-[color:var(--border-soft)] bg-[color:var(--surface-page)] p-3 md:flex md:w-64 md:gap-3 md:p-4">
        <div className="planner-skeleton__shimmer h-4 w-20 rounded" />
        <div className="planner-skeleton__shimmer h-28 rounded-lg" />
        <div className="planner-skeleton__shimmer h-4 w-16 rounded" />
        <div className="planner-skeleton__shimmer h-7 rounded" />
        <div className="planner-skeleton__shimmer h-7 rounded" />
        <div className="flex-1" />
        <div className="planner-skeleton__shimmer h-9 rounded-lg" />
      </div>
    </div>
  );
}
