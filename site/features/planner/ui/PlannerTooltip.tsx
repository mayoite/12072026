"use client";

import type { ReactElement, ReactNode } from "react";
import { Tooltip, type TooltipSide } from "@/features/planner/ui/Tooltip";

export type PlannerTooltipSide = TooltipSide;

interface PlannerTooltipProps {
  label: string;
  hint?: string;
  shortcut?: string;
  side?: PlannerTooltipSide;
  disabled?: boolean;
  children: ReactElement;
}

export function PlannerTooltip({
  label,
  hint,
  shortcut,
  side = "right",
  disabled = false,
  children,
}: PlannerTooltipProps) {
  if (disabled) return children;

  return (
    <Tooltip content={hint ? `${label}: ${hint}` : label} shortcut={shortcut} side={side}>
      {children}
    </Tooltip>
  );
}

export function PlannerIconButton({
  label,
  hint,
  shortcut,
  tooltipSide,
  className = "pw-icon-btn min-w-[2.75rem] min-h-[2.75rem] focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  hint?: string;
  shortcut?: string;
  tooltipSide?: PlannerTooltipSide;
  children: ReactNode;
}) {
  return (
    <PlannerTooltip label={label} hint={hint} shortcut={shortcut} side={tooltipSide}>
      <button type="button" className={className} aria-label={label} {...props}>
        {children}
      </button>
    </PlannerTooltip>
  );
}
