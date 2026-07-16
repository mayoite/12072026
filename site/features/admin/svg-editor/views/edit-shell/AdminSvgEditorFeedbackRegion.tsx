"use client";

import Link from "next/link";
import {
  CheckCircle,
  CircleNotch as Loader2,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

import type { FeedbackState } from "./useAdminSvgEditorPublish";

interface AdminSvgEditorFeedbackRegionProps {
  readonly feedback: FeedbackState;
  readonly slug: string;
  readonly plannerVerifyHref: string;
  readonly publishArtifactHref: (productSlug: string) => string;
  readonly onDismiss: () => void;
}

export function AdminSvgEditorFeedbackRegion({
  feedback,
  slug,
  plannerVerifyHref,
  publishArtifactHref,
  onDismiss,
}: AdminSvgEditorFeedbackRegionProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="admin-svg-engine-feedback"
      data-testid="admin-svg-a11y-live-feedback"
    >
      {feedback.submitting ? (
        <div
          role="status"
          className="admin-alert admin-alert--info admin-svg-engine-feedback__item"
          aria-busy="true"
        >
          <Loader2 size={16} className="animate-spin shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            Publishing <strong>{slug || "symbol"}</strong>… saving the draft and
            releasing the Planner symbol. Keep this page open until finish.
          </span>
        </div>
      ) : null}

      {feedback.errorMessage ? (
        <div
          role="alert"
          className="admin-alert admin-alert--error admin-svg-engine-feedback__item"
          data-testid="admin-svg-publish-failure"
        >
          <WarningCircle size={16} className="shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">{feedback.errorMessage}</span>
          <button
            type="button"
            className="admin-btn admin-btn--outline admin-btn--compact"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X size={14} aria-hidden />
            Dismiss
          </button>
        </div>
      ) : null}

      {feedback.successMessage ? (
        <div
          role="status"
          className="admin-alert admin-alert--success admin-svg-engine-feedback__item"
          data-testid="admin-svg-publish-success"
        >
          <CheckCircle size={16} className="shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            {feedback.successMessage}
            {feedback.publishedSlug ? (
              <>
                {" "}
                <a
                  href={publishArtifactHref(feedback.publishedSlug)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="admin-svg-publish-success-artifact"
                >
                  Open released SVG
                </a>
                {" · "}
                <Link
                  href={plannerVerifyHref}
                  data-testid="admin-svg-publish-success-planner"
                >
                  Verify in Planner
                </Link>
              </>
            ) : null}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--outline admin-btn--compact"
            onClick={onDismiss}
            aria-label="Dismiss success message"
          >
            <X size={14} aria-hidden />
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
