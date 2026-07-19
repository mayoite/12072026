"use client";

import { useMemo } from "react";

import {
  PLANNER_STEPS,
  PLANNER_STEP_DETAILS,
  PLANNER_STEP_LABELS,
  derivePlannerStepCompletion,
  plannerForwardWarning,
  type PlannerStep,
} from "@/features/planner/editor/plannerStep";
import type { PlannerAccessContext } from "@/features/planner/lib/commands/plannerAccessContext";
import type { WorkspacePlanMetrics } from "@/features/planner/editor/workspacePlanMetrics";
import styles from "@/app/css/core/locked/planner/workspace-shell.module.css";

/** Shorter guest titles — drop long product essays from the strip. */
const PLANNER_STEP_LABELS_GUEST: Record<PlannerStep, string> = {
  draw: "Draw",
  place: "Place",
  review: "Quote",
};

type PlannerWorkflowBarProps = {
  currentStep: PlannerStep;
  onStepChange: (step: PlannerStep) => void;
  onOpenAssistant?: () => void;
  planMetrics?: WorkspacePlanMetrics;
  /** Guest chrome diet: short titles, no detail essays under each step. */
  accessContext?: PlannerAccessContext;
};

/**
 * Customer workflow steps — completion is derived from the plan, never faked.
 * Dense chrome: only surface "Done" when complete; incomplete stays in aria only
 * so the step bar does not fight the status strip with dual Incomplete essays.
 * Guests get short titles only (no PLANNER_STEP_DETAILS under each button).
 */
export function PlannerWorkflowBar({
  currentStep,
  onStepChange,
  onOpenAssistant,
  planMetrics,
  accessContext = "authenticated",
}: PlannerWorkflowBarProps) {
  const guestMode = accessContext === "guest";
  const completion = useMemo(
    () => derivePlannerStepCompletion(planMetrics),
    [planMetrics],
  );
  // Derive during render — do not mirror props into state via an effect.
  const warning = plannerForwardWarning(currentStep, completion);

  const changeStep = (step: PlannerStep) => {
    onStepChange(step);
  };

  return (
    <nav
      className={`${styles.workflowBar} pw-step-bar`}
      aria-label="Planner workflow"
      data-current={currentStep}
      data-density="compact"
      data-guest-chrome={guestMode ? "true" : undefined}
    >
      <ol className={styles.workflowSteps}>
        {PLANNER_STEPS.map((step, index) => {
          const active = step === currentStep;
          const done = completion[step] === "complete";
          const label = guestMode
            ? PLANNER_STEP_LABELS_GUEST[step]
            : PLANNER_STEP_LABELS[step];
          const detail = PLANNER_STEP_DETAILS[step];
          const ariaLabel = guestMode
            ? `${index + 1}. ${label}. ${completion[step]}`
            : `${index + 1}. ${label}. ${completion[step]}. ${detail}`;
          return (
            <li key={step} className={styles.workflowStep}>
              <button
                type="button"
                className={`${styles.workflowButton} pw-step-bar__btn`}
                data-step={step}
                data-active={active ? "true" : undefined}
                data-completion={completion[step]}
                aria-current={active ? "step" : undefined}
                aria-label={ariaLabel}
                onClick={() => changeStep(step)}
              >
                <span className={styles.workflowNumber}>{index + 1}</span>
                <span className={styles.workflowCopy}>
                  <strong>{label}</strong>
                  {!guestMode ? <small>{detail}</small> : null}
                  {done ? (
                    <span className={styles.workflowCompletion}>Done</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {onOpenAssistant ? (
        <button type="button" className={styles.workflowAssist} onClick={onOpenAssistant}>
          AI assist
        </button>
      ) : null}
      <p
        className={styles.workflowWarning}
        role="status"
        aria-live="polite"
        hidden={!warning}
      >
        {warning}
      </p>
    </nav>
  );
}
