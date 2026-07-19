"use client";

import { type ReactNode } from "react";
import { Button } from "react-aria-components";
import {
  CaretDown,
  CaretUp,
  ArrowLineLeft,
  ArrowLineRight,
  ArrowLineDown,
  X,
} from "@phosphor-icons/react";

import { cn } from "./shellVariants";
import type { DockZoneId, PanelLayoutState, StudioPanelDef } from "./useDockLayout";

export interface DockZonePanel {
  readonly def: StudioPanelDef;
  readonly state: PanelLayoutState;
  readonly content: ReactNode;
}

export interface DockZoneProps {
  readonly zone: DockZoneId;
  readonly panels: readonly DockZonePanel[];
  readonly onToggleCollapse: (id: string) => void;
  readonly onMove: (id: string, zone: DockZoneId) => void;
  readonly onHide: (id: string) => void;
  readonly className?: string;
}

/** Zones a panel can move to, excluding the one it's already in. */
const MOVE_TARGETS: Record<DockZoneId, readonly { zone: DockZoneId; label: string; icon: ReactNode }[]> = {
  left: [
    { zone: "right", label: "Move to right", icon: <ArrowLineRight aria-hidden="true" /> },
    { zone: "bottom", label: "Move to bottom", icon: <ArrowLineDown aria-hidden="true" /> },
  ],
  right: [
    { zone: "left", label: "Move to left", icon: <ArrowLineLeft aria-hidden="true" /> },
    { zone: "bottom", label: "Move to bottom", icon: <ArrowLineDown aria-hidden="true" /> },
  ],
  bottom: [
    { zone: "left", label: "Move to left", icon: <ArrowLineLeft aria-hidden="true" /> },
    { zone: "right", label: "Move to right", icon: <ArrowLineRight aria-hidden="true" /> },
  ],
};

/**
 * Renders the visible (non-hidden) panels assigned to one dock zone, each with a
 * header exposing collapse and move-to-zone controls. Collapsed panels show only
 * their header. Rearrangement is header-driven (accessible + reliable); pointer
 * drag can be layered on later without changing this contract.
 */
export function DockZone({
  zone,
  panels,
  onToggleCollapse,
  onMove,
  onHide,
  className,
}: DockZoneProps) {
  const visible = panels.filter((p) => !p.state.hidden);
  if (visible.length === 0) return null;

  return (
    <div className={cn("studio-dock-zone", `studio-dock-zone--${zone}`, className)} data-zone={zone}>
      {visible.map(({ def, state, content }) => {
        const collapsible = def.collapsible ?? true;
        const collapsed = collapsible && state.collapsed;
        const bodyId = `studio-panel-body-${def.id}`;
        return (
          <section
            key={def.id}
            className="studio-dock-panel"
            data-panel-id={def.id}
            data-collapsed={collapsed ? "true" : undefined}
            aria-label={def.title}
          >
            <header className="studio-dock-panel-header">
              {collapsible ? (
                <Button
                  className="studio-dock-panel-toggle"
                  aria-expanded={!collapsed}
                  aria-controls={bodyId}
                  aria-label={collapsed ? `Expand ${def.title}` : `Collapse ${def.title}`}
                  onPress={() => onToggleCollapse(def.id)}
                >
                  <span className="studio-dock-panel-caret" aria-hidden="true">
                    {collapsed ? <CaretDown /> : <CaretUp />}
                  </span>
                  <span className="studio-dock-panel-title">{def.title}</span>
                </Button>
              ) : (
                <span className="studio-dock-panel-title">{def.title}</span>
              )}
              <div className="studio-dock-panel-actions">
                {MOVE_TARGETS[zone].map((target) => (
                  <Button
                    key={target.zone}
                    className="studio-dock-panel-action"
                    aria-label={`${target.label}: ${def.title}`}
                    onPress={() => onMove(def.id, target.zone)}
                  >
                    <span className="studio-dock-panel-action-icon" aria-hidden="true">
                      {target.icon}
                    </span>
                  </Button>
                ))}
                <Button
                  className="studio-dock-panel-action"
                  aria-label={`Hide ${def.title}`}
                  onPress={() => onHide(def.id)}
                >
                  <span className="studio-dock-panel-action-icon" aria-hidden="true">
                    <X />
                  </span>
                </Button>
              </div>
            </header>
            {collapsed ? null : (
              <div id={bodyId} className="studio-dock-panel-body">
                {content}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
