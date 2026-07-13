"use client";

import { useMemo } from "react";
import type { PlannerFloor } from "@/features/planner/project/model/types";
import {
  runFloorValidation,
  type ValidationResult,
} from "@/features/planner/lib/validation/runValidation";

const EMPTY_RESULT: ValidationResult = {
  issues: [],
  errors: 0,
  warnings: 0,
  advisories: 0,
};

/**
 * Live validation hook — re-runs all rules whenever the active floor changes.
 * Returns issues grouped by severity with summary counts.
 */
export function useValidation(floor: PlannerFloor | undefined): ValidationResult {
  return useMemo(() => {
    if (!floor) return EMPTY_RESULT;
    return runFloorValidation(floor);
  }, [floor]);
}
