"use client";

/**
 * PlannerSkeleton — Premium shimmer loading state while the Fabric workspace lazy-loads.
 * Shows a skeleton mimicking: top toolbar + left sidebar + canvas + right panel.
 */

export function PlannerSkeleton() {
  return (
    <div className="flex h-full w-full overflow-hidden" aria-label="Loading planner..." role="status">
      <div className="flex w-12 shrink-0 flex-col gap-2 border-r border-[color:var(--border-soft)] bg-[color:var(--surface-page)] p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-8 rounded-lg shimmer" />
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex h-12 items-center gap-3 border-b border-[color:var(--border-soft)] px-4">
          <div className="h-6 w-32 rounded shimmer" />
          <div className="h-6 w-20 rounded shimmer" />
          <div className="flex-1" />
          <div className="h-8 w-24 rounded-lg shimmer" />
          <div className="h-8 w-24 rounded-lg shimmer" />
        </div>

        <div className="relative flex-1 bg-[color:var(--surface-canvas)]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, var(--text-muted) 0.0625rem, transparent 0.0625rem)",
              backgroundSize: "1.5rem 1.5rem",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-xl shimmer" />
              <div className="h-4 w-40 rounded shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-64 flex-shrink-0 border-l border-[var(--border-soft,var(--color-bronze-100))] bg-[var(--surface-page,var(--color-white-100))] p-4 flex flex-col gap-3">
        <div className="h-5 w-24 rounded shimmer" />
        <div className="h-32 w-full rounded-lg shimmer" />
        <div className="h-5 w-20 rounded shimmer" />
        <div className="h-8 w-full rounded shimmer" />
        <div className="h-8 w-full rounded shimmer" />
        <div className="h-8 w-full rounded shimmer" />
        <div className="flex-1" />
        <div className="h-10 w-full rounded-lg shimmer" />
      </div>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            var(--surface-page, var(--surface-status-bad)) 25%,
            var(--border-soft, var(--color-bronze-100)) 50%,
            var(--surface-page, var(--surface-status-bad)) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
