"use client";

import { useState } from "react";
import { SquaresFour as LayoutGrid, SidebarSimple as PanelLeftClose, Sparkle as Sparkles, type Icon } from "@phosphor-icons/react";

import { AIAssistDrawer } from "@/features/planner/ai/AIAssistDrawer";
import { CatalogPanel } from "@/features/planner/catalog/CatalogPanel";
import { useIsMobile } from "@/features/planner/hooks/useIsMobile";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import type { MeasurementUnit } from "@/features/planner/lib/measurements";
import type { PlannerStep } from "@/features/planner/editor/plannerStep";
import { Tooltip } from "@/features/planner/ui/Tooltip";

import { getStepLeftEmphasis } from "@/features/planner/editor/usePlannerPanels";
import { getStepLeftTab, type PlannerLeftTab } from "./plannerStepBindings";

const TAB_META: Record<PlannerLeftTab, { label: string; Icon: Icon }> = {
  library: { label: "Library", Icon: LayoutGrid },
  "ai-assist": { label: "AI Assist", Icon: Sparkles },
};

const PANEL_BUTTON_CLASS = "min-w-[2.75rem] min-h-[2.75rem] focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-gray-100 rounded-lg transition-colors";

function getTabsForStep(step: PlannerStep): PlannerLeftTab[] {
  switch (step) {
    case "draw":
      return ["library", "ai-assist"];
    case "place":
      return ["library", "ai-assist"];
    case "review":
      return ["ai-assist", "library"];
    default:
      return ["library", "ai-assist"];
  }
}

function getStepNote(step: PlannerStep, tab: PlannerLeftTab): string {
  switch (step) {
    case "draw":
      return tab === "library"
        ? "Browse Oando SVG symbols — click or drag desks, seating, and storage onto the canvas."
        : tab === "ai-assist"
          ? "Use AI for layout ideas, then return to Library to keep editing."
          : "Start from a blank canvas or open a template before placing products.";
    case "place":
      return tab === "ai-assist"
          ? "Use AI for arrangement ideas, then place products directly on the canvas."
          : "Use the library for furniture, then place doors and windows on the canvas.";
    case "review":
      return "Review measurements, properties, and export on the right. Jump back to Draw or Place anytime.";
    default:
      return "";
  }
}

interface PlannerLeftPanelProps {
  guestMode: boolean;
  editor?: null;
  plannerStep?: PlannerStep;
  panelOpen?: boolean;
  panelCollapsed?: boolean;
  showPanelToggle?: boolean;
  onTogglePanel?: () => void;
  activeTab?: PlannerLeftTab;
  onTabChange?: (tab: PlannerLeftTab) => void;
  onItemClick: (item: CatalogItem) => void;
  onDragStart: (item: CatalogItem) => void;
  onDragEnd?: () => void;
  unitSystem?: MeasurementUnit;
}

export function PlannerLeftPanel({
  guestMode: _guestMode,
  editor = null,
  plannerStep = "draw",
  panelOpen = true,
  panelCollapsed = false,
  showPanelToggle = false,
  onTogglePanel,
  activeTab,
  onTabChange,
  onItemClick,
  onDragStart,
  onDragEnd,
}: PlannerLeftPanelProps) {
  const [pickedTab, setPickedTab] = useState<PlannerLeftTab | null>(null);
  const [lastStep, setLastStep] = useState(plannerStep);

  if (lastStep !== plannerStep) {
    setLastStep(plannerStep);
    if (!activeTab) setPickedTab(null);
  }

  const tab = activeTab ?? pickedTab ?? getStepLeftTab(plannerStep);
  const isMobile = useIsMobile();
  const stepNote = getStepNote(plannerStep, tab);
  const tabs = getTabsForStep(plannerStep);
  const primaryTab = tabs[0];
  const emphasis = getStepLeftEmphasis(plannerStep);

  const selectTab = (next: PlannerLeftTab) => {
    if (onTabChange) onTabChange(next);
    else setPickedTab(next);
  };

  const panelBody = (
    <div className="pw-panel-body" data-active-tab={tab} hidden={panelCollapsed}>
      {tab !== "library" ? <p className="pw-panel-step-note">{stepNote}</p> : null}
      {tab === "library" ? (
        <CatalogPanel
          embedded
          onItemClick={onItemClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          mobileSheetOpen={panelOpen && !panelCollapsed}
          onMobileSheetClose={onTogglePanel}
          mobileSheetTitle={TAB_META[tab].label}
        />
      ) : (
        <AIAssistDrawer editor={editor} embedded defaultExpanded />
      )}
    </div>
  );

  if (isMobile) {
    return panelBody;
  }

  return (
    <aside
      data-coach="catalog"
      data-step={plannerStep}
      data-open={panelOpen ? true : undefined}
      data-collapsed={panelCollapsed ? true : undefined}
      data-emphasis={emphasis}
      className="pw-left-panel"
      aria-label="Planner Sidebar"
    >
      <div className="pw-panel-tabs">
        <div className="pw-panel-tablist" role="tablist" aria-label="Left panel">
          {tabs.map((tabId) => {
            const { label, Icon } = TAB_META[tabId];
            return (
              <Tooltip key={tabId} content={label} side="bottom">
                <button
                  type="button"
                  role="tab"
                  className={`pw-panel-tab pwx-panel-tab ${PANEL_BUTTON_CLASS}`}
                  data-active={tab === tabId}
                  data-relevant={tabId === primaryTab}
                  data-collapsed={panelCollapsed || undefined}
                  aria-selected={tab === tabId}
                  aria-label={label}
                  onClick={() => selectTab(tabId)}
                >
                  <Icon size={14} strokeWidth={2} aria-hidden />
                  <span>{label}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
        {showPanelToggle && onTogglePanel ? (
          <Tooltip content="Close left panel" side="bottom">
            <button
              type="button"
              className={`pw-panel-collapse pw-icon-btn ${PANEL_BUTTON_CLASS}`}
              onClick={onTogglePanel}
              aria-label="Close left panel"
            >
              <PanelLeftClose size={14} strokeWidth={2} aria-hidden />
            </button>
          </Tooltip>
        ) : null}
      </div>
      {panelBody}
    </aside>
  );
}
