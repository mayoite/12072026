"use client";

import { useEffect, useId, useRef } from "react";

import type { SketchRecoveryReason } from "@/features/shared/api/schemas";
import {
  getSketchRecoveryMessage,
  type SketchToPlanResponse,
} from "@/features/planner/ai/sketchToPlan";

import styles from "./sketch-to-plan-dialog.module.css";

export type SketchUnderlayPayload = {
  dataUrl: string;
  width: number;
  height: number;
};

export type SketchToPlanUiState =
  | { status: "idle" }
  | { status: "converting"; fileName: string }
  | {
      status: "preview";
      fileName: string;
      objects: SketchToPlanResponse["objects"];
      warnings: string[];
      /** Original image kept as locked underlay on accept. */
      underlay?: SketchUnderlayPayload;
    }
  | {
      status: "fallback";
      fileName: string;
      reason: SketchRecoveryReason;
      message: string;
      underlay?: SketchUnderlayPayload;
    }
  | { status: "error"; fileName: string; message: string };

type SketchToPlanDialogProps = {
  state: SketchToPlanUiState;
  onAccept: () => void;
  onReject: () => void;
  onDismiss: () => void;
  /** Place image as underlay without converted walls (fallback path). */
  onPlaceUnderlayOnly?: () => void;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SketchToPlanDialog({
  state,
  onAccept,
  onReject,
  onDismiss,
  onPlaceUnderlayOnly,
}: SketchToPlanDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const open = state.status !== "idle";

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const dialog = dialogRef.current;
    const focusInitial = () => {
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const target = focusables[0] ?? dialog;
      target.focus();
    };
    const frame = window.requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onDismiss();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
      previouslyFocused.current = null;
    };
  }, [open, onDismiss, state.status]);

  if (state.status === "idle") return null;

  const wallCount =
    state.status === "preview"
      ? state.objects.filter((object) => object.type === "wall").length
      : 0;

  return (
    <div className={styles.backdrop} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId}>Sketch to plan</h2>
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
              {state.underlay ? (
                <p className={styles.disclaimer}>
                  Accept also keeps the sketch as a locked underlay (trace reference). Scale
                  defaults to a 10&nbsp;m room width — recalibrate from Properties when needed.
                </p>
              ) : null}
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
            <>
              <p role="status">
                {state.message || getSketchRecoveryMessage(state.reason)}
              </p>
              {state.underlay ? (
                <p className={styles.disclaimer}>
                  Conversion failed, but you can still place the image as a locked underlay.
                </p>
              ) : null}
            </>
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
          ) : state.status === "fallback" && state.underlay && onPlaceUnderlayOnly ? (
            <>
              <button type="button" className={styles.secondary} onClick={onDismiss}>
                Dismiss
              </button>
              <button type="button" className={styles.primary} onClick={onPlaceUnderlayOnly}>
                Place underlay only
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
