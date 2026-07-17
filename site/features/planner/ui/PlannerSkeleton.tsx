"use client";

/**
 * Full-viewport planner loading shell while Fabric/Three lazy-load.
 * Must reserve real layout (flex + heights) so the page is never a blank strip.
 */

export function PlannerSkeleton() {
  return (
    <div
      className="planner-skeleton flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-[color:var(--surface-page)]"
      aria-label="Loading planner..."
      role="status"
    >
      {/* Left tool rail */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-[color:var(--border-soft)] bg-[color:var(--surface-page)] py-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="planner-skeleton__shimmer h-8 w-8 rounded-lg" />
        ))}
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[color:var(--border-soft)] px-4">
          <div className="planner-skeleton__shimmer h-6 w-32 rounded" />
          <div className="planner-skeleton__shimmer h-6 w-20 rounded" />
          <div className="flex-1" />
          <div className="planner-skeleton__shimmer h-8 w-24 rounded-lg" />
          <div className="planner-skeleton__shimmer h-8 w-24 rounded-lg" />
        </div>

        <div className="relative min-h-0 flex-1 bg-[color:var(--surface-canvas,var(--surface-soft))]">
          <div className="planner-skeleton__grid absolute inset-0 opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="planner-skeleton__shimmer h-16 w-16 rounded-xl" />
              <p className="text-sm font-medium text-muted">Loading workspace…</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden w-64 shrink-0 flex-col gap-3 border-l border-[color:var(--border-soft)] bg-[color:var(--surface-page)] p-4 sm:flex">
        <div className="planner-skeleton__shimmer h-5 w-24 rounded" />
        <div className="planner-skeleton__shimmer h-32 rounded-lg" />
        <div className="planner-skeleton__shimmer h-5 w-20 rounded" />
        <div className="planner-skeleton__shimmer h-8 rounded" />
        <div className="planner-skeleton__shimmer h-8 rounded" />
        <div className="planner-skeleton__shimmer h-8 rounded" />
        <div className="flex-1" />
        <div className="planner-skeleton__shimmer h-10 rounded-lg" />
      </div>

    </div>
  );
}
