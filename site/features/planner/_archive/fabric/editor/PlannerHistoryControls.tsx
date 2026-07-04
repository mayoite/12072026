"use client";

import { Eraser, Redo2, Undo2 } from "lucide-react";

import { confirmResetPlannerCanvas } from "@/features/planner/editor/resetPlannerCanvas";
import { PlannerIconButton } from "@/features/planner/ui/PlannerTooltip";
import { Z } from "@/lib/z-index";

interface PlannerHistoryControlsProps {
  editor?: null;
  onReset?: () => void;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

export function PlannerHistoryControls({
  onReset,
  tooltipSide = "bottom",
}: PlannerHistoryControlsProps) {
  return (
    <div
      className="sticky top-0 flex items-center gap-1"
      role="toolbar"
      aria-label="Canvas history"
      style={{ zIndex: Z.toolbar }}
    >
      <PlannerIconButton
        label="Undo"
        shortcut="Ctrl+Z"
        tooltipSide={tooltipSide}
        disabled
        aria-disabled
      >
        <Undo2 size={16} aria-hidden />
      </PlannerIconButton>
      <PlannerIconButton
        label="Redo"
        shortcut="Ctrl+Shift+Z"
        tooltipSide={tooltipSide}
        disabled
        aria-disabled
      >
        <Redo2 size={16} aria-hidden />
      </PlannerIconButton>
      <PlannerIconButton
        label="Clear canvas"
        tooltipSide={tooltipSide}
        onClick={() => {
          if (confirmResetPlannerCanvas()) onReset?.();
        }}
      >
        <Eraser size={16} aria-hidden />
      </PlannerIconButton>
    </div>
  );
}
