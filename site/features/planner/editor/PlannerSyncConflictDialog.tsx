"use client";

import { useEffect, useId, useRef } from "react";

import styles from "./planner-sync-conflict-dialog.module.css";

export type SyncConflictDetails = {
  localUpdatedAt?: string;
  remoteUpdatedAt?: string;
  localHash?: string;
  remoteHash?: string;
};

type PlannerSyncConflictDialogProps = {
  open: boolean;
  details?: SyncConflictDetails | null;
  busy?: boolean;
  onKeepLocal: () => void;
  onKeepCloud: () => void;
  onDismiss?: () => void;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PlannerSyncConflictDialog({
  open,
  details,
  busy = false,
  onKeepLocal,
  onKeepCloud,
  onDismiss,
}: PlannerSyncConflictDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

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
    // Defer so the dialog is in the DOM and buttons are focusable.
    const frame = window.requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (busy) return;
        if (!onDismiss) return;
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
  }, [open, busy, onDismiss]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId}>Sync conflict</h2>
          {onDismiss ? (
            <button
              type="button"
              className={styles.close}
              onClick={onDismiss}
              aria-label="Close conflict dialog"
              disabled={busy}
            >
              Close
            </button>
          ) : null}
        </header>
        <div className={styles.body}>
          <p id={descId}>
            This plan changed on this device and in the cloud. Choose which version to keep.
            The other version is not deleted from your draft history, but only one becomes active.
          </p>
          {details?.localUpdatedAt || details?.remoteUpdatedAt ? (
            <dl className={styles.meta}>
              {details.localUpdatedAt ? (
                <div>
                  <dt>Local</dt>
                  <dd>{details.localUpdatedAt}</dd>
                </div>
              ) : null}
              {details.remoteUpdatedAt ? (
                <div>
                  <dt>Cloud</dt>
                  <dd>{details.remoteUpdatedAt}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
        <footer className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={onKeepLocal}
            disabled={busy}
          >
            Keep local
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={onKeepCloud}
            disabled={busy}
          >
            Keep cloud
          </button>
        </footer>
      </div>
    </div>
  );
}
