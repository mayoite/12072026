"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  DockviewDefaultTab,
  DockviewReact,
  themeLight,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewPanelHeaderProps,
  type IDockviewPanelProps,
} from "dockview-react";
import "dockview-react/dist/styles/dockview.css";

import type { LayoutPresetId } from "../workspaceLayout";
import {
  applyPlannerDockPreset,
  ensurePlannerDockPanel,
  persistDockLayout,
  tryRestoreDockLayout,
  type PlannerDockPanelId,
} from "./plannerDockPresets";
import {
  PlannerDockSlotsProvider,
  usePlannerDockSlot,
  type PlannerDockSlots,
} from "./plannerDockSlots";
import styles from "./planner-dock.module.css";

type Disposable = { dispose: () => void };

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

function PlannerDockTab(props: IDockviewPanelHeaderProps) {
  return <DockviewDefaultTab {...props} hideClose={props.api.id === "canvas"} />;
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

function seedLayout(api: DockviewApi, layoutPresetId: LayoutPresetId | "custom"): void {
  if (api.panels.length > 0) return;
  const restored = tryRestoreDockLayout(api);
  if (!restored || api.panels.length === 0) {
    applyPlannerDockPreset(
      api,
      layoutPresetId === "custom" ? "default" : layoutPresetId,
    );
  }
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
  const layoutPresetIdRef = useRef(layoutPresetId);
  layoutPresetIdRef.current = layoutPresetId;
  const disposablesRef = useRef<Disposable[]>([]);
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

      // Strict Mode remounts Dockview empty while this host instance survives —
      // always re-seed when the API has no panels.
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];

      seedLayout(event.api, layoutPresetIdRef.current);

      disposablesRef.current.push(
        event.api.onDidRemovePanel((removed) => {
          if (removed.id === "canvas") {
            ensurePlannerDockPanel(event.api, "canvas");
          }
          schedulePersist();
        }),
        event.api.onDidLayoutChange(() => schedulePersist()),
      );
    },
    [onApiReady, schedulePersist],
  );

  useEffect(() => {
    const api = apiRef.current;
    if (!api || layoutPresetId === "custom") return;
    applyPlannerDockPreset(api, layoutPresetId);
    persistDockLayout(api);
  }, [layoutPresetId, layoutEpoch]);

  useEffect(() => {
    return () => {
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];
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
          defaultTabComponent={PlannerDockTab}
          onReady={onReady}
          theme={themeLight}
          disableFloatingGroups={false}
          singleTabMode="fullwidth"
        />
      </div>
    </PlannerDockSlotsProvider>
  );
}

export type { DockviewApi, PlannerDockPanelId };
export { ensurePlannerDockPanel };
