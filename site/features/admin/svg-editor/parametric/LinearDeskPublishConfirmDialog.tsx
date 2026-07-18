"use client";

import { useEffect, useId, useRef } from "react";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

import type { LinearDeskPublishConfirmCopy } from "./linearDeskPublishConfirm";

type Props = {
  readonly open: boolean;
  readonly copy: LinearDeskPublishConfirmCopy;
  readonly pending: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
};

/**
 * Consequence confirm before parametric publish.
 * Plain admin dialog (role=dialog, focus restore) — no second publish API.
 */
export function LinearDeskPublishConfirmDialog({
  open,
  copy,
  pending,
  onCancel,
  onConfirm,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = window.requestAnimationFrame(() => {
      confirmRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        event.preventDefault();
        onCancel();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      const prior = previouslyFocused.current;
      if (prior && document.contains(prior)) {
        prior.focus({ preventScroll: true });
      }
    };
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      data-testid="linear-desk-publish-confirm-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) {
          onCancel();
        }
      }}
    >
      <div
        className="admin-panel admin-modal admin-modal--md"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-testid="linear-desk-publish-confirm"
      >
        <div className="admin-panel__header" id={titleId}>
          {copy.title}
        </div>
        <div className="admin-panel__body admin-stack">
          <p className="admin-page__meta" id={descId}>
            {copy.guestNote}
          </p>
          <dl
            className="admin-parametric-details__dl"
            data-testid="linear-desk-publish-confirm-facts"
          >
            <div>
              <dt>Name</dt>
              <dd data-testid="linear-desk-confirm-name">{copy.name}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd data-testid="linear-desk-confirm-sku">{copy.sku}</dd>
            </div>
            <div>
              <dt>Slug</dt>
              <dd data-testid="linear-desk-confirm-slug">{copy.slug}</dd>
            </div>
            <div>
              <dt>Footprint</dt>
              <dd data-testid="linear-desk-confirm-footprint">
                {copy.footprintMm}
              </dd>
            </div>
          </dl>
          <div className="admin-actions-row admin-actions-row--end">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={onCancel}
              disabled={pending}
              data-testid="linear-desk-publish-confirm-cancel"
            >
              {copy.cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={onConfirm}
              disabled={pending}
              data-testid="linear-desk-publish-confirm-submit"
            >
              {pending ? (
                <>
                  <Loader2 size={14} className="admin-icon-spin" aria-hidden />{" "}
                  Publishing…
                </>
              ) : (
                copy.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
