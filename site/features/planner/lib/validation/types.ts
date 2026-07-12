/**
 * P14 validation issue model — buyer-facing layout-quality checks.
 * Stub types until the full validation pipeline is wired to the workspace.
 */

export type ValidationRuleId =
  | "furniture-overlap"
  | "wall-collision"
  | "opening-obstruction"
  | "room-boundary"
  | "aisle-clearance"
  | "chair-pullback"
  | "accessibility-clearance";

export type ValidationSeverity = "error" | "warning" | "advisory";

export interface ValidationIssue {
  id: string;
  ruleId: ValidationRuleId;
  severity: ValidationSeverity;
  /** Affected planner entity ids (furniture, wall, opening, room). */
  objectIds: string[];
  message: string;
  remedy: string;
  /** Canvas-space focus point for one-click navigation (mm). */
  focusMm?: { x: number; y: number };
}

export interface PlacedFurniture {
  id: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  depthMm: number;
  rotationDeg?: number;
}