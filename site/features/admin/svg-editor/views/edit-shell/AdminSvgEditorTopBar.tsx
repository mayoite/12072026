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
import type { SvgArtifactStatus } from "../../publish/svgArtifactStatus.server";

interface AdminSvgEditorTopBarProps {
  readonly slug: string;
  readonly updatedAtLabel: string;
  readonly sku: string;
  readonly authoringLifecycle: AuthoringLifecycle;
  readonly lifecycle: CatalogLifecycleState;
  readonly artifactState: SvgArtifactStatus["state"];
  readonly approving: boolean;
  readonly submitting: boolean;
  readonly formDirty: boolean;
  readonly canPublish: boolean;
  readonly onReset: () => void;
  readonly onApprove: () => void;
  readonly onPublish: () => void;
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
  return (
    <header
      className="admin-svg-engine-shell__topbar"
      data-testid="admin-shell-header"
    >
      <Link
        href="/admin/svg-editor"
        className="admin-btn admin-btn--outline admin-btn--compact"
        data-testid="admin-shell-secondary-back"
      >
        <ArrowLeft size={13} aria-hidden />
        Back
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
          Published <time dateTime={updatedAtLabel}>{updatedAtLabel}</time>
        </p>
        <p className="admin-svg-engine-shell__source" data-testid="admin-shell-state">
          State: {authoringLifecycleLabel(authoringLifecycle)} · artifact{" "}
          {artifactState}
          {lifecycle === "live" ? " · approved for buyers" : ""}
          {formDirty ? " · draft changed" : ""}
        </p>
      </div>

      <div className="admin-svg-engine-shell__state-pills">
        <span
          className={`${authoringLifecycleBadgeClass(authoringLifecycle)} admin-badge--compact`}
          data-testid="admin-shell-lifecycle-badge"
        >
          {authoringLifecycleLabel(authoringLifecycle)}
        </span>
        {lifecycle === "live" ? (
          <span className="admin-badge admin-badge--active admin-badge--compact">
            Live
          </span>
        ) : null}
      </div>

      <div className="admin-svg-engine-shell__divider" aria-hidden />

      <div className="admin-svg-engine-shell__actions" data-testid="admin-shell-actions">
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--compact"
          onClick={onReset}
          disabled={submitting || !formDirty}
          data-testid="admin-shell-destructive-reset"
        >
          Reset
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--compact"
          onClick={onApprove}
          disabled={
            approving || submitting || lifecycle === "live" || artifactState !== "published"
          }
          data-testid="admin-shell-secondary-approve"
        >
          Approve
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--compact"
          onClick={onPublish}
          disabled={!canPublish}
          aria-describedby="admin-svg-publication-impact"
          data-testid="admin-shell-primary-action"
        >
          {submitting ? (
            <Loader2 size={13} className="animate-spin" aria-hidden />
          ) : (
            <CheckCircle size={13} aria-hidden />
          )}
          Publish
        </button>
      </div>
    </header>
  );
}

