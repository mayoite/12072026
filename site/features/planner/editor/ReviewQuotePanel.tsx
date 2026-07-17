"use client";

import type { ValidationResult } from "@/features/planner/lib/validation/runValidation";
import type { ValidationIssue } from "@/features/planner/lib/validation/types";
import { ValidationPanel } from "./ValidationPanel";

import styles from "./review-quote-panel.module.css";

type ReviewQuotePanelProps = {
  validation: ValidationResult;
  furnitureCount: number;
  workstationSeats: number;
  onDownloadBoq: () => void;
  onAddWorkstationsToQuote: () => void;
  onFocusIssue?: (issue: ValidationIssue) => void;
};

export function ReviewQuotePanel({
  validation,
  furnitureCount,
  workstationSeats,
  onDownloadBoq,
  onAddWorkstationsToQuote,
  onFocusIssue,
}: ReviewQuotePanelProps) {
  const hasBlockingErrors = validation.errors > 0;
  const canDownloadBoq = furnitureCount > 0 && !hasBlockingErrors;
  const canAddToQuote = workstationSeats > 0 && !hasBlockingErrors;

  return (
    <section className={styles.panel} aria-label="Review and quote">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Step 3</p>
          <h2 className={styles.title}>Review &amp; quote</h2>
        </div>
        <span className={hasBlockingErrors ? styles.blocked : styles.ready}>
          {hasBlockingErrors
            ? `${validation.errors} error${validation.errors === 1 ? "" : "s"}`
            : "Ready to review"}
        </span>
      </header>

      <div className={styles.content}>
        <dl className={styles.metrics}>
          <div>
            <dt>Furniture</dt>
            <dd>{furnitureCount}</dd>
          </div>
          <div>
            <dt>Workstation seats</dt>
            <dd>{workstationSeats}</dd>
          </div>
          <div>
            <dt>Checks</dt>
            <dd>
              {validation.issues.length === 0
                ? "Clear"
                : `${validation.issues.length} issue${validation.issues.length === 1 ? "" : "s"}`}
            </dd>
          </div>
        </dl>

        <ValidationPanel result={validation} onFocusIssue={onFocusIssue} />

        <div className={styles.actions}>
          <button type="button" className={styles.primaryAction} disabled={!canDownloadBoq} onClick={onDownloadBoq}>
            Download BOQ CSV
          </button>
          <button type="button" className={styles.secondaryAction} disabled={!canAddToQuote} onClick={onAddWorkstationsToQuote}>
            Add workstations to quote
          </button>
        </div>

        {hasBlockingErrors ? (
          <p className={styles.hint}>Resolve the validation errors before creating the BOQ or quote.</p>
        ) : workstationSeats === 0 ? (
          <p className={styles.hint}>A BOQ supports all furniture. The quote cart currently supports workstation systems.</p>
        ) : null}
      </div>
    </section>
  );
}
