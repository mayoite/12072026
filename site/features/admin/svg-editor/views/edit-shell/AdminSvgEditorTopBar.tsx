"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  CircleNotch as Loader2,
} from "@phosphor-icons/react";

import {
  authoringLifecycleBadgeClass,
  authoringLifecycleLabel,
  type AuthoringLifecycle,
} from "../../lifecycle/authoringLifecycle";
import type { CatalogLifecycleState } from "../../lifecycle/catalogLifecycle.shared";
import type { SvgArtifactState } from "../../publish/svgArtifactStatus.server";

interface AdminSvgEditorTopBarProps {
  readonly slug: string;
  readonly updatedAtLabel: string;
  readonly sku: string;
  readonly authoringLifecycle: AuthoringLifecycle;
  readonly lifecycle: CatalogLifecycleState;
  readonly artifactState: SvgArtifactState;
  readonly approving: boolean;
  readonly submitting: boolean;
  readonly formDirty: boolean;
  readonly canPublish: boolean;
  readonly onReset: () => void;
  readonly onApprove: () => void;
  readonly onPublish: () => void;
}

function releasedSymbolLabel(state: SvgArtifactState): string {
  switch (state) {
    case "published":
      return "Symbol released";
    case "missing":
      return "No released symbol";
    case "invalid":
      return "Released symbol invalid";
  }
}

function revisionSourceLabel(
  state: SvgArtifactState,
  updatedAtLabel: string,
): string {
  switch (state) {
    case "missing":
      return "Never published";
    case "invalid":
      return `Released symbol invalid · checked ${updatedAtLabel}`;
    case "published":
      return `Last published ${updatedAtLabel}`;
  }
}

function publishButtonTitle(args: {
  readonly canPublish: boolean;
  readonly submitting: boolean;
  readonly formDirty: boolean;
}): string {
  if (args.submitting) return "Publishing…";
  if (args.canPublish) {
    return "Release this draft as the Planner symbol for this product";
  }
  return "Publish is blocked until the draft is valid and ready to release";
}

export function AdminSvgEditorTopBar({
  slug,
  updatedAtLabel,
  sku,
  authoringLifecycle,
  lifecycle,
  artifactState,
  approving,
  submitting,
  formDirty,
  canPublish,
  onReset,
  onApprove,
  onPublish,
}: AdminSvgEditorTopBarProps) {
  const approveDisabled =
    approving || submitting || lifecycle === "live" || artifactState !== "published";
  const approveTitle = approveDisabled
    ? lifecycle === "live"
      ? "Already approved for buyers"
      : artifactState !== "published"
        ? "Release a symbol with Publish before approving for buyers"
        : approving
          ? "Approving…"
          : "Approve unavailable"
    : "Mark the released symbol as available to buyers";

  return (
    <header
      className="admin-svg-engine-shell__topbar"
      data-testid="admin-shell-header"
    >
      <Link
        href="/admin/svg-editor"
        className="admin-btn admin-btn--outline admin-btn--compact admin-svg-engine-shell__back"
        data-testid="admin-shell-secondary-back"
        aria-label="Back to SVG inventory"
      >
        <ArrowLeft size={14} aria-hidden />
        <span>Inventory</span>
      </Link>

      <div className="admin-svg-engine-shell__divider" aria-hidden />

      <div className="admin-svg-engine-shell__identity">
        <p
          className="admin-svg-engine-shell__eyebrow"
          data-testid="admin-shell-scope"
        >
          Catalog asset · SVG studio
        </p>
        <h1
          className="admin-svg-engine-shell__title"
          data-testid="admin-shell-title"
        >
          {slug || "new"}
          {sku ? (
            <span className="admin-svg-engine-shell__sku">SKU {sku}</span>
          ) : null}
        </h1>
        <p className="admin-svg-engine-shell__source" data-testid="admin-shell-source">
          {artifactState === "published" ? (
            <>
              Last published{" "}
              <time dateTime={updatedAtLabel}>{updatedAtLabel}</time>
            </>
          ) : (
            revisionSourceLabel(artifactState, updatedAtLabel)
          )}
        </p>
        <p className="admin-svg-engine-shell__source" data-testid="admin-shell-state">
          {authoringLifecycleLabel(authoringLifecycle)}
          {" · "}
          {releasedSymbolLabel(artifactState)}
          {lifecycle === "live" ? " · Approved for buyers" : " · Not yet approved for buyers"}
          {formDirty ? " · Unsaved draft changes" : ""}
        </p>
      </div>

      <div className="admin-svg-engine-shell__state-pills" aria-label="Draft and release status">
        <span
          className={`${authoringLifecycleBadgeClass(authoringLifecycle)} admin-badge--compact`}
          data-testid="admin-shell-lifecycle-badge"
        >
          {authoringLifecycleLabel(authoringLifecycle)}
        </span>
        <span
          className={`admin-badge admin-badge--compact ${
            artifactState === "published"
              ? "admin-badge--active"
              : artifactState === "invalid"
                ? "admin-badge--warn"
                : "admin-badge--hidden"
          }`}
          data-testid="admin-shell-symbol-badge"
        >
          {releasedSymbolLabel(artifactState)}
        </span>
        {lifecycle === "live" ? (
          <span className="admin-badge admin-badge--active admin-badge--compact">
            Live for buyers
          </span>
        ) : null}
        {formDirty ? (
          <span
            className="admin-badge admin-badge--warn admin-badge--compact"
            data-testid="admin-shell-dirty-badge"
          >
            Unsaved changes
          </span>
        ) : null}
      </div>

      <div className="admin-svg-engine-shell__divider" aria-hidden />

      <div className="admin-svg-engine-shell__actions" data-testid="admin-shell-actions">
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--compact admin-svg-engine-shell__action-reset"
          onClick={onReset}
          disabled={submitting || !formDirty}
          title={
            formDirty
              ? "Discard draft edits and restore the last published revision"
              : "No unpublished changes to discard"
          }
          data-testid="admin-shell-destructive-reset"
        >
          Reset draft
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--compact admin-svg-engine-shell__action-approve"
          onClick={onApprove}
          disabled={approveDisabled}
          title={approveTitle}
          data-testid="admin-shell-secondary-approve"
        >
          {approving ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : null}
          Approve for buyers
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--compact admin-svg-engine-shell__action-publish"
          onClick={onPublish}
          disabled={!canPublish}
          title={publishButtonTitle({ canPublish, submitting, formDirty })}
          aria-describedby="admin-svg-publication-impact"
          data-testid="admin-shell-primary-action"
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <CheckCircle size={14} aria-hidden />
          )}
          {submitting ? "Publishing…" : "Publish"}
        </button>
      </div>
    </header>
  );
}
