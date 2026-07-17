"use client";

import { useCallback } from "react";
import type { ValidationResult } from "@/features/planner/lib/validation/runValidation";
import type { ValidationIssue } from "@/features/planner/lib/validation/types";
import styles from "./validation-panel.module.css";

export interface ValidationPanelProps {
  result: ValidationResult;
  onFocusIssue?: (issue: ValidationIssue) => void;
}

export function ValidationPanel({ result, onFocusIssue }: ValidationPanelProps) {
  const handleFocus = useCallback(
    (issue: ValidationIssue) => {
      if (!onFocusIssue) return;
      onFocusIssue(issue);
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
              data-has-focus={onFocusIssue ? "true" : "false"}
              onClick={() => handleFocus(issue)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onFocusIssue) {
                  e.preventDefault();
                  handleFocus(issue);
                }
              }}
              tabIndex={onFocusIssue ? 0 : undefined}
            >
              <div className={styles.issueMessage}>{issue.message}</div>
              <div className={styles.issueMeta}>
                <span>{issue.ruleId}</span>
                {onFocusIssue ? (
                  <button
                    type="button"
                    className={styles.focusBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFocus(issue);
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
