"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  DockviewReact,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";

import type { LayoutPresetId } from "../workspaceLayout";
import {
  applyPlannerDockPreset,
  persistDockLayout,
  tryRestoreDockLayout,
} from "./plannerDockPresets";
import {
  PlannerDockSlotsProvider,
  usePlannerDockSlot,
  type PlannerDockSlots,
} from "./plannerDockSlots";
import styles from "./planner-dock.module.css";

function SlotPanel({ slot }: { slot: keyof PlannerDockSlots }) {
  const node = usePlannerDockSlot(slot);
  return <div className={styles.panelFill}>{node}</div>;
}

function CanvasPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="canvas" />;
}
function InventoryPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="inventory" />;
}
function PropertiesPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="properties" />;
}
function LayersPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="layers" />;
}
function ToolsPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="tools" />;
}

const DOCK_COMPONENTS = {
  canvas: CanvasPanel,
  inventory: InventoryPanel,
  properties: PropertiesPanel,
  layers: LayersPanel,
  tools: ToolsPanel,
};

export interface PlannerDockHostProps {
  slots: PlannerDockSlots;
  /** When this changes, apply named preset (clears saved layout). */
  layoutPresetId?: LayoutPresetId | "custom";
  /** Bump to force re-apply presetId. */
  layoutEpoch?: number;
  onApiReady?: (api: DockviewApi) => void;
  className?: string;
}

/**
 * Dockview host for modular planner chrome (option 1).
 * react-resizable-panels stays for 2D/3D split only (option 3).
 */
export function PlannerDockHost({
  slots,
  layoutPresetId = "custom",
  layoutEpoch = 0,
  onApiReady,
  className,
}: PlannerDockHostProps) {
  const apiRef = useRef<DockviewApi | null>(null);
  const primedRef = useRef(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedulePersist = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => persistDockLayout(api), 400);
  }, []);

  const onReady = useCallback(
    (event: DockviewReadyEvent) => {
      apiRef.current = event.api;
      onApiReady?.(event.api);

      if (!primedRef.current) {
        primedRef.current = true;
        const restored = tryRestoreDockLayout(event.api);
        if (!restored) {
          applyPlannerDockPreset(
            event.api,
            layoutPresetId === "custom" ? "default" : layoutPresetId,
          );
        }
      }

      event.api.onDidLayoutChange(() => schedulePersist());
    },
    [layoutPresetId, onApiReady, schedulePersist],
  );

  useEffect(() => {
    const api = apiRef.current;
    if (!api || layoutPresetId === "custom") return;
    applyPlannerDockPreset(api, layoutPresetId);
    persistDockLayout(api);
  }, [layoutPresetId, layoutEpoch]);

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, []);

  const components = useMemo(() => DOCK_COMPONENTS, []);

  return (
    <PlannerDockSlotsProvider slots={slots}>
      <div
        className={`${styles.host} dockview-theme-light ${className ?? ""}`}
        data-testid="planner-dock-host"
      >
        <DockviewReact
          className={styles.dockview}
          components={components}
          onReady={onReady}
          disableFloatingGroups={false}
          singleTabMode="fullwidth"
        />
      </div>
    </PlannerDockSlotsProvider>
  );
}

export type { DockviewApi };
