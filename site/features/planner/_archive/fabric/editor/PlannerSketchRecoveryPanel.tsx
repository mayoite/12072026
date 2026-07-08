"use client";

import type { SketchRecoveryState } from "@/features/planner/ai/sketchToPlan";
import { Z } from "@/lib/z-index";

type PlannerSketchRecoveryPanelProps = {
  recovery: SketchRecoveryState;
  onTraceManual: () => void;
  onRetry: () => void;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;
};

export function PlannerSketchRecoveryPanel({
  recovery,
  onTraceManual,
  onRetry,
  onAccept,
  onReject,
  onDismiss,
}: PlannerSketchRecoveryPanelProps) {
  if (recovery.status === "idle") return null;

  const isPreview = recovery.status === "preview";
  const isFallback = recovery.status === "fallback";
  const isConverting = recovery.status === "converting";
  const isAccepted = recovery.status === "accepted";
  const isRejected = recovery.status === "rejected";
  const title =
    recovery.status === "preview"
      ? `Preview ready: ${recovery.fileName}`
      : recovery.status === "fallback"
        ? `Trace from reference: ${recovery.fileName}`
        : recovery.status === "converting"
          ? `Converting sketch: ${recovery.fileName}`
          : recovery.status === "accepted"
            ? `Sketch conversion accepted: ${recovery.fileName}`
            : `Sketch kept as reference: ${recovery.fileName}`;
  const body =
    recovery.status === "preview"
      ? "Review the generated geometry before it becomes the working draft."
      : recovery.status === "fallback"
        ? recovery.message
        : recovery.status === "converting"
          ? "The sketch is already underlaid so you can keep tracing while conversion runs."
          : recovery.status === "accepted"
            ? "The generated plan is now the active draft."
            : "The previous draft has been restored and the sketch stays visible as a reference.";

  return (
    <div
      className="right-4 top-20 w-[min(34rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-950/95"
      style={{ zIndex: Z.panel }}
    >
      <div className="items-start gap-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Sketch recovery
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        {isFallback || isAccepted || isRejected ? (
          <button
            type="button"
            className="rounded-full border border-slate-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>

      {recovery.status === "preview" && recovery.warnings.length ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Warnings</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {recovery.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex-wrap gap-2">
        {isPreview ? (
          <>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={onAccept}
            >
              Accept preview
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={onReject}
            >
              Reject preview
            </button>
          </>
        ) : null}
        {isFallback || isRejected ? (
          <>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={onTraceManual}
            >
              Trace manually
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={onRetry}
            >
              Retry conversion
            </button>
          </>
        ) : null}
        {isAccepted ? (
          <button
            type="button"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onDismiss}
          >
            Close
          </button>
        ) : null}
        {isConverting ? (
          <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Waiting for conversion...
          </span>
        ) : null}
      </div>
    </div>
  );
}
