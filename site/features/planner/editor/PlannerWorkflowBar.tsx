"use client";

import { useEffect, useMemo, useState } from "react";

import {
  PLANNER_STEPS,
  PLANNER_STEP_DETAILS,
  PLANNER_STEP_LABELS,
  derivePlannerStepCompletion,
  plannerForwardWarning,
  type PlannerStep,
} from "@/features/planner/editor/plannerStep";
import type { WorkspacePlanMetrics } from "@/features/planner/editor/workspacePlanMetrics";
import styles from "./workspace.module.css";

type PlannerWorkflowBarProps = {
  currentStep: PlannerStep;
  onStepChange: (step: PlannerStep) => void;
  onOpenAssistant?: () => void;
  planMetrics?: WorkspacePlanMetrics;
};

/**
 * Customer workflow steps — completion is derived from the plan, never faked.
 */
export function PlannerWorkflowBar({
  currentStep,
  onStepChange,
  onOpenAssistant,
  planMetrics,
}: PlannerWorkflowBarProps) {
  const completion = useMemo(
    () => derivePlannerStepCompletion(planMetrics),
    [planMetrics],
  );
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    setWarning(plannerForwardWarning(currentStep, completion));
  }, [completion, currentStep]);

  const changeStep = (step: PlannerStep) => {
    setWarning(plannerForwardWarning(step, completion));
    onStepChange(step);
  };

  return (
    <nav
      className={`${styles.workflowBar} pw-step-bar`}
      aria-label="Planner workflow"
      data-current={currentStep}
    >
      <ol className={styles.workflowSteps}>
        {PLANNER_STEPS.map((step, index) => {
          const active = step === currentStep;
          return (
            <li key={step} className={styles.workflowStep}>
              <button
                type="button"
                className={`${styles.workflowButton} pw-step-bar__btn`}
                data-step={step}
                data-active={active ? "true" : undefined}
                data-completion={completion[step]}
                aria-current={active ? "step" : undefined}
                aria-label={`${index + 1}. ${PLANNER_STEP_LABELS[step]}. ${completion[step]}. ${PLANNER_STEP_DETAILS[step]}`}
                onClick={() => changeStep(step)}
              >
                <span className={styles.workflowNumber}>{index + 1}</span>
                <span className={styles.workflowCopy}>
                  <strong>{PLANNER_STEP_LABELS[step]}</strong>
                  <small>{PLANNER_STEP_DETAILS[step]}</small>
                  <span className={styles.workflowCompletion}>
                    {completion[step] === "complete" ? "Complete" : "Incomplete"}
                  </span>
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
