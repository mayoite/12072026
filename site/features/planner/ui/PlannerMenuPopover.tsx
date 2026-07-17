"use client";

import { Popover, type PopoverProps } from "react-aria-components";

export type PlannerMenuPopoverProps = Omit<PopoverProps, "className">;

/**
 * Portal-safe menu surface for Planner chrome.
 *
 * React Aria renders popovers outside the workspace subtree. Keeping the
 * surface class here prevents individual menus from silently losing their
 * background, border, stacking, or positioning contract.
 */
export function PlannerMenuPopover(props: PlannerMenuPopoverProps) {
  return <Popover {...props} className="pw-planner-menu-popover" />;
}
