"use client";

import { useEffect, useId, useRef } from "react";

import styles from "@/app/css/core/locked/planner/planner-sync-conflict-dialog.module.css";

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

function shortHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

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
  const busyId = useId();

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

  const hasTimestamps = Boolean(details?.localUpdatedAt || details?.remoteUpdatedAt);
  const hasHashes = Boolean(details?.localHash || details?.remoteHash);
  const showMeta = hasTimestamps || hasHashes;

  const handleKeepLocal = () => {
    if (busy) return;
    onKeepLocal();
  };

  const handleKeepCloud = () => {
    if (busy) return;
    onKeepCloud();
  };

  const handleDismiss = () => {
    if (busy) return;
    onDismiss?.();
  };

  return (
    <div className={styles.backdrop} role="presentation">
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={busy ? `${descId} ${busyId}` : descId}
        aria-busy={busy || undefined}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId}>Sync conflict</h2>
          {onDismiss ? (
            <button
              type="button"
              className={styles.close}
              onClick={handleDismiss}
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
          {busy ? (
            <p id={busyId} className={styles.busy} role="status" aria-live="polite">
              Applying your choice…
            </p>
          ) : null}
          {showMeta ? (
            <dl className={styles.meta}>
              {details?.localUpdatedAt || details?.localHash ? (
                <div>
                  <dt>Local</dt>
                  <dd>
                    {details.localUpdatedAt ? (
                      <span data-testid="conflict-local-updated">{details.localUpdatedAt}</span>
                    ) : null}
                    {details.localHash ? (
                      <span
                        data-testid="conflict-local-hash"
                        title={details.localHash}
                        className={styles.hash}
                      >
                        {details.localUpdatedAt ? " · " : null}
                        hash {shortHash(details.localHash)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ) : null}
              {details?.remoteUpdatedAt || details?.remoteHash ? (
                <div>
                  <dt>Cloud</dt>
                  <dd>
                    {details.remoteUpdatedAt ? (
                      <span data-testid="conflict-remote-updated">{details.remoteUpdatedAt}</span>
                    ) : null}
                    {details.remoteHash ? (
                      <span
                        data-testid="conflict-remote-hash"
                        title={details.remoteHash}
                        className={styles.hash}
                      >
                        {details.remoteUpdatedAt ? " · " : null}
                        hash {shortHash(details.remoteHash)}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
        <footer className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={handleKeepLocal}
            disabled={busy}
            data-testid="conflict-keep-local"
          >
            Keep local
          </button>
          <button
            type="button"
            className={styles.primary}
            onClick={handleKeepCloud}
            disabled={busy}
            data-testid="conflict-keep-cloud"
          >
            Keep cloud
          </button>
        </footer>
      </div>
    </div>
  );
}
