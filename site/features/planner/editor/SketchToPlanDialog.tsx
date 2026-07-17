"use client";

import type { SketchRecoveryReason } from "@/features/shared/api/schemas";
import {
  getSketchRecoveryMessage,
  type SketchToPlanResponse,
} from "@/features/planner/ai/sketchToPlan";

import styles from "./sketch-to-plan-dialog.module.css";

export type SketchToPlanUiState =
  | { status: "idle" }
  | { status: "converting"; fileName: string }
  | {
      status: "preview";
      fileName: string;
      objects: SketchToPlanResponse["objects"];
      warnings: string[];
    }
  | {
      status: "fallback";
      fileName: string;
      reason: SketchRecoveryReason;
      message: string;
    }
  | { status: "error"; fileName: string; message: string };

type SketchToPlanDialogProps = {
  state: SketchToPlanUiState;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;
};

export function SketchToPlanDialog({
  state,
  onAccept,
  onReject,
  onDismiss,
}: SketchToPlanDialogProps) {
  if (state.status === "idle") return null;

  const wallCount =
    state.status === "preview"
      ? state.objects.filter((object) => object.type === "wall").length
      : 0;

  return (
    <div className={styles.backdrop} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sketch-to-plan-title"
      >
        <header className={styles.header}>
          <h2 id="sketch-to-plan-title">Sketch to plan</h2>
          <button type="button" className={styles.close} onClick={onDismiss} aria-label="Close">
            Close
          </button>
        </header>

        <div className={styles.body}>
          {state.status === "converting" ? (
            <p role="status">Converting {state.fileName}…</p>
          ) : null}

          {state.status === "preview" ? (
            <>
              <p>
                Preview for <strong>{state.fileName}</strong>: {wallCount} wall
                {wallCount === 1 ? "" : "s"} ready to apply.
              </p>
              <p className={styles.disclaimer}>
                Converted geometry is a drafting aid, not construction-authoritative.
              </p>
              {state.warnings.length > 0 ? (
                <ul className={styles.warnings}>
                  {state.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}

          {state.status === "fallback" ? (
            <p role="status">
              {state.message || getSketchRecoveryMessage(state.reason)}
            </p>
          ) : null}

          {state.status === "error" ? (
            <p role="alert">{state.message}</p>
          ) : null}
        </div>

        <footer className={styles.footer}>
          {state.status === "preview" ? (
            <>
              <button type="button" className={styles.secondary} onClick={onReject}>
                Reject
              </button>
              <button type="button" className={styles.primary} onClick={onAccept}>
                Accept geometry
              </button>
            </>
          ) : (
            <button type="button" className={styles.primary} onClick={onDismiss}>
              {state.status === "converting" ? "Cancel" : "OK"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
