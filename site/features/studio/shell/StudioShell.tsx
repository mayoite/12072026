"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  type ReactNode,
} from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn, panelSurface } from "./shellVariants";
import { DockZone, type DockZonePanel } from "./DockZone";
import {
  useDockLayout,
  type DockArrangement,
  type DockLayout,
  type DockZoneId,
  type StudioPanelDef,
} from "./useDockLayout";

export interface StudioPanel extends StudioPanelDef {
  /** Rendered inside the panel body when not collapsed. */
  readonly content: ReactNode;
}

/** Imperative handle for consumers that drive layout from app state. */
export interface StudioShellHandle {
  showPanel: (id: string) => void;
  hidePanel: (id: string) => void;
  toggleCollapse: (id: string) => void;
  movePanel: (id: string, zone: DockZoneId) => void;
  applyArrangement: (arrangement: DockArrangement) => void;
  resetArrangement: () => void;
}

export interface StudioShellProps {
  topbar?: ReactNode;
  subTopbar?: ReactNode;
  /** Vertical icon rail pinned left of the panels (tools live here). */
  leftRail?: ReactNode;
  /** The always-present center stage. */
  canvas: ReactNode;
  /** Dockable panels, each assigned a default zone. */
  panels?: readonly StudioPanel[];
  /** Fired after any layout change (user- or programmatically-driven). */
  onLayoutChange?: (layout: DockLayout) => void;
  className?: string;
}

function StudioShellImpl(
  {
    topbar,
    subTopbar,
    leftRail,
    canvas,
    panels = [],
    onLayoutChange,
    className,
  }: StudioShellProps,
  ref: React.ForwardedRef<StudioShellHandle>,
) {
  // Stable def list feeding the reducer (content is applied separately at render).
  const defs = useMemo<readonly StudioPanelDef[]>(
    () =>
      panels.map((p) => ({
        id: p.id,
        title: p.title,
        defaultZone: p.defaultZone,
        collapsible: p.collapsible,
        defaultCollapsed: p.defaultCollapsed,
        defaultHidden: p.defaultHidden,
      })),
    [panels],
  );

  const dock = useDockLayout(defs);
  const {
    layout,
    showPanel,
    hidePanel,
    toggleCollapse,
    movePanel,
    applyArrangement,
    resetArrangement,
  } = dock;

  useImperativeHandle(
    ref,
    () => ({
      showPanel,
      hidePanel,
      toggleCollapse,
      movePanel,
      applyArrangement,
      resetArrangement,
    }),
    [showPanel, hidePanel, toggleCollapse, movePanel, applyArrangement, resetArrangement],
  );

  useEffect(() => {
    onLayoutChange?.(layout);
  }, [layout, onLayoutChange]);

  // Bucket panels by their current zone, preserving prop order.
  const zoned = useMemo(() => {
    const buckets: Record<DockZoneId, DockZonePanel[]> = { left: [], right: [], bottom: [] };
    for (const p of panels) {
      const state = layout[p.id];
      if (!state) continue;
      buckets[state.zone].push({
        def: {
          id: p.id,
          title: p.title,
          defaultZone: p.defaultZone,
          collapsible: p.collapsible,
          defaultCollapsed: p.defaultCollapsed,
          defaultHidden: p.defaultHidden,
        },
        state,
        content: p.content,
      });
    }
    return buckets;
  }, [panels, layout]);

  const hasVisible = (zone: DockZoneId) =>
    zoned[zone].some((p) => !p.state.hidden);
  const leftVisible = hasVisible("left");
  const rightVisible = hasVisible("right");
  const bottomVisible = hasVisible("bottom");

  const zoneProps = {
    onToggleCollapse: toggleCollapse,
    onMove: movePanel,
    onHide: hidePanel,
  };

  return (
    <div className={cn("studio-shell", className)}>
      {topbar ? <div className="studio-topbar">{topbar}</div> : null}
      {subTopbar ? <div className="studio-subtopbar">{subTopbar}</div> : null}

      <div className="studio-main">
        {leftRail ? <div className="studio-rail">{leftRail}</div> : null}

        <Group orientation="horizontal" className="studio-panels">
          {leftVisible ? (
            <>
              <Panel
                id="studio-left-panel"
                defaultSize="22%"
                minSize="14%"
                maxSize="40%"
                className={panelSurface({ side: "left" })}
              >
                <DockZone zone="left" panels={zoned.left} {...zoneProps} />
              </Panel>
              <Separator className="studio-resize-handle" />
            </>
          ) : null}

          <Panel id="studio-canvas" minSize="20rem" className="studio-canvas">
            {bottomVisible ? (
              <Group orientation="vertical" className="studio-canvas-stack">
                <Panel id="studio-stage" minSize="8rem" className="studio-stage">
                  {canvas}
                </Panel>
                <Separator className="studio-resize-handle studio-resize-handle--horizontal" />
                <Panel
                  id="studio-bottom-panel"
                  defaultSize="28%"
                  minSize="10%"
                  maxSize="60%"
                  className="studio-panel studio-panel--bottom"
                >
                  <DockZone zone="bottom" panels={zoned.bottom} {...zoneProps} />
                </Panel>
              </Group>
            ) : (
              canvas
            )}
          </Panel>

          {rightVisible ? (
            <>
              <Separator className="studio-resize-handle" />
              <Panel
                id="studio-right-panel"
                defaultSize="20%"
                minSize="14%"
                maxSize="40%"
                className={panelSurface({ side: "right" })}
              >
                <DockZone zone="right" panels={zoned.right} {...zoneProps} />
              </Panel>
            </>
          ) : null}
        </Group>
      </div>
    </div>
  );
}

export const StudioShell = forwardRef(StudioShellImpl);
