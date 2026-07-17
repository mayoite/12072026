"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CaretDown,
  CheckCircle,
  CircleNotch as Loader2,
  Export,
  SquaresFour,
} from "@phosphor-icons/react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";

import {
  authoringLifecycleBadgeClass,
  authoringLifecycleLabel,
  type AuthoringLifecycle,
} from "../../lifecycle/authoringLifecycle";
import type { CatalogLifecycleState } from "../../lifecycle/catalogLifecycle.shared";
import type { SvgArtifactState } from "../../publish/svgArtifactStatus.server";

export type AdminSvgExportAction =
  | "download-svg"
  | "download-descriptor"
  | "open-planner";

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
  /** Planner-style export menu (download / open Planner). */
  readonly onExportAction?: (action: AdminSvgExportAction) => void;
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
    return "Publish to disk (live authority). Supabase catalog mirror is best-effort and does not undo disk success.";
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
  onExportAction,
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
          Planner catalog · SVG studio
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
          Local disk (live publish authority)
          {" · "}
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
        {/* Planner-style export menu (same RAC pattern as TopBar Export). */}
        {onExportAction ? (
          <MenuTrigger>
            <Button
              className="admin-btn admin-btn--outline admin-btn--compact"
              aria-label="Export — download symbol or open Planner"
              data-testid="admin-shell-export-menu"
            >
              <Export size={14} aria-hidden />
              <span className="admin-svg-engine-shell__action-label-long">Export</span>
              <CaretDown size={12} weight="bold" aria-hidden />
            </Button>
            <Popover className="admin-svg-engine-shell__menu-popover" placement="bottom end">
              <Menu
                className="admin-svg-engine-shell__menu"
                aria-label="Export options"
                onAction={(key) => onExportAction(String(key) as AdminSvgExportAction)}
              >
                <MenuItem id="download-svg" className="admin-svg-engine-shell__menu-item">
                  Download symbol (SVG)
                </MenuItem>
                <MenuItem id="download-descriptor" className="admin-svg-engine-shell__menu-item">
                  Download descriptor (JSON)
                </MenuItem>
                <MenuItem id="open-planner" className="admin-svg-engine-shell__menu-item">
                  <SquaresFour size={14} aria-hidden /> Open in Planner
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        ) : null}
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
          aria-label="Reset draft"
        >
          <span className="admin-svg-engine-shell__action-label-long">Reset draft</span>
          <span className="admin-svg-engine-shell__action-label-short" aria-hidden="true">Reset</span>
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--compact admin-svg-engine-shell__action-approve"
          onClick={onApprove}
          disabled={approveDisabled}
          title={approveTitle}
          data-testid="admin-shell-secondary-approve"
          aria-label="Approve for buyers"
        >
          {approving ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : null}
          <span className="admin-svg-engine-shell__action-label-long">Approve for buyers</span>
          <span className="admin-svg-engine-shell__action-label-short" aria-hidden="true">Approve</span>
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
          {submitting ? "Publishing…" : "Publish to Planner"}
        </button>
      </div>
    </header>
  );
}
