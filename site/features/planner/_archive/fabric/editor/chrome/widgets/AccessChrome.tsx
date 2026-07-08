"use client";

import { SidebarSimple as PanelLeftClose, Sidebar as PanelLeftOpen, Sidebar as PanelRightOpen, ArrowCounterClockwise as RotateCcw } from "@phosphor-icons/react";
import { Tooltip } from "@/features/planner/ui/Tooltip";

const TOOLBAR_BUTTON_CLASS = "min-w-[2.75rem] min-h-[2.75rem] focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors";

interface AccessChromeProps {
  leftOpen: boolean;
  rightOpen: boolean;
  leftCollapsed?: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleLeftCollapsed?: () => void;
  onResetLayout?: () => void;
}

export function AccessChrome({
  leftOpen,
  rightOpen,
  leftCollapsed = false,
  onToggleLeft,
  onToggleRight,
  onToggleLeftCollapsed,
  onResetLayout,
}: AccessChromeProps) {
  return (
    <div className="pw-access-chrome" role="group" aria-label="Workspace panels and layout">
      <Tooltip content={leftOpen ? "Close library panel" : "Open library panel"} side="bottom">
        <button
          type="button"
          className={`pw-access-chrome__btn pw-icon-btn ${TOOLBAR_BUTTON_CLASS}`}
          data-active={leftOpen || undefined}
          aria-label={leftOpen ? "Close library panel" : "Open library panel"}
          aria-pressed={leftOpen}
          onClick={onToggleLeft}
        >
          <PanelLeftOpen size={16} strokeWidth={2} aria-hidden />
        </button>
      </Tooltip>
      <Tooltip content={rightOpen ? "Close properties panel" : "Open properties panel"} side="bottom">
        <button
          type="button"
          className={`pw-access-chrome__btn pw-icon-btn ${TOOLBAR_BUTTON_CLASS}`}
          data-active={rightOpen || undefined}
          aria-label={rightOpen ? "Close properties panel" : "Open properties panel"}
          aria-pressed={rightOpen}
          onClick={onToggleRight}
        >
          <PanelRightOpen size={16} strokeWidth={2} aria-hidden />
        </button>
      </Tooltip>
      <Tooltip content="Reset planner chrome layout" side="bottom">
        <button
          type="button"
          className={`pw-access-chrome__btn pw-icon-btn ${TOOLBAR_BUTTON_CLASS}`}
          aria-label="Reset planner chrome layout"
          disabled={!onResetLayout}
          onClick={onResetLayout}
        >
          <RotateCcw size={16} strokeWidth={2} aria-hidden />
        </button>
      </Tooltip>
      <Tooltip content={leftCollapsed ? "Expand left panel rail" : "Collapse left panel rail"} side="bottom">
        <button
          type="button"
          className={`pw-access-chrome__btn pw-icon-btn ${TOOLBAR_BUTTON_CLASS}`}
          data-active={leftCollapsed || undefined}
          aria-label={leftCollapsed ? "Expand left panel rail" : "Collapse left panel rail"}
          aria-pressed={leftCollapsed}
          disabled={!onToggleLeftCollapsed}
          onClick={onToggleLeftCollapsed}
        >
          <PanelLeftClose size={16} strokeWidth={2} aria-hidden />
        </button>
      </Tooltip>
    </div>
  );
}
