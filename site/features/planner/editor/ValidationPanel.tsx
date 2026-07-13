"use client";

import { useCallback } from "react";
import type { ValidationResult } from "@/features/planner/lib/validation/runValidation";
import styles from "./validation-panel.module.css";

export interface ValidationPanelProps {
  result: ValidationResult;
  onFocusIssue?: (focusMm: { x: number; y: number }) => void;
}

export function ValidationPanel({ result, onFocusIssue }: ValidationPanelProps) {
  const handleFocus = useCallback(
    (focusMm: { x: number; y: number } | undefined) => {
      if (!focusMm || !onFocusIssue) return;
      onFocusIssue(focusMm);
    },
    [onFocusIssue],
  );

  const totalIssues = result.issues.length;

  return (
    <div className={styles.panel} role="region" aria-label="Validation issues">
      <div className={styles.header}>
        <span>Validation</span>
        {totalIssues > 0 ? (
          <span className={styles.summary}>
            {result.errors > 0 ? (
              <span>
                <span className={`${styles.severityDot} ${styles.severityDotError}`} />
                {result.errors}
              </span>
            ) : null}
            {result.warnings > 0 ? (
              <span>
                <span className={`${styles.severityDot} ${styles.severityDotWarning}`} />
                {result.warnings}
              </span>
            ) : null}
            {result.advisories > 0 ? (
              <span>
                <span className={`${styles.severityDot} ${styles.severityDotAdvisory}`} />
                {result.advisories}
              </span>
            ) : null}
            {totalIssues} total
          </span>
        ) : (
          <span className={styles.summary}>No issues</span>
        )}
      </div>

      {totalIssues === 0 ? (
        <div className={styles.emptyState}>No validation issues found</div>
      ) : (
        <div className={styles.issueList} role="list">
          {result.issues.map((issue) => (
            <div
              key={issue.id}
              className={styles.issueRow}
              role="listitem"
              data-severity={issue.severity}
              data-has-focus={issue.focusMm && onFocusIssue ? "true" : "false"}
              onClick={() => handleFocus(issue.focusMm)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && issue.focusMm) {
                  e.preventDefault();
                  handleFocus(issue.focusMm);
                }
              }}
              tabIndex={issue.focusMm && onFocusIssue ? 0 : undefined}
            >
              <div className={styles.issueMessage}>{issue.message}</div>
              <div className={styles.issueMeta}>
                <span>{issue.ruleId}</span>
                {issue.focusMm && onFocusIssue ? (
                  <button
                    type="button"
                    className={styles.focusBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFocus(issue.focusMm);
                    }}
                  >
                    Focus
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
