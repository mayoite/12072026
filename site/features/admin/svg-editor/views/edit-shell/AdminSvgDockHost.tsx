"use client";

/**
 * Admin SVG studio chrome: dockview-react (same package as Planner).
 * Panels: Preview | stage (Studio canvas or Form) | Details.
 * Not Planner Fabric place toolbars.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
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

import styles from "@/app/css/core/locked/chrome/admin-svg-dock.module.css";
import {
  persistAdminSvgFactoryLayout,
  seedAdminSvgFactoryLayout,
  tryRestoreAdminSvgFactoryLayout,
} from "./adminSvgDockPresets";

export type AdminSvgDockSlot =
  | "preview"
  | "stage"
  | "details"
  | "tools"
  | "properties"
  | "canvas";

export type AdminSvgDockSlots = {
  readonly preview: ReactNode;
  readonly stage: ReactNode;
  readonly details: ReactNode;
};

export type AdminSvgFactoryDockSlots = {
  readonly tools: ReactNode;
  readonly properties: ReactNode;
  readonly canvas: ReactNode;
};

export type AdminSvgDockPanelTitles = {
  readonly preview: string;
  readonly stage: string;
  readonly details: string;
};

const DEFAULT_TITLES: AdminSvgDockPanelTitles = {
  preview: "Preview",
  stage: "Studio",
  details: "Details",
};

type AdminSvgDockConfig = {
  readonly stageScrollable: boolean;
  readonly layoutMode: "freehand" | "factory";
};

const AdminSvgDockSlotsContext = createContext<
  Partial<Record<AdminSvgDockSlot, ReactNode>> | null
>(null);
const AdminSvgDockConfigContext = createContext<AdminSvgDockConfig>({
  stageScrollable: false,
  layoutMode: "freehand",
});

function useSlot(slot: AdminSvgDockSlot): ReactNode {
  const slots = useContext(AdminSvgDockSlotsContext);
  if (!slots) return null;
  return slots[slot];
}

function SlotPanel({
  slot,
  stage,
}: {
  slot: AdminSvgDockSlot;
  stage?: boolean;
}) {
  const node = useSlot(slot);
  const { stageScrollable } = useContext(AdminSvgDockConfigContext);
  const fillClass =
    stage && !stageScrollable ? styles.panelFillStage : styles.panelFill;
  return (
    <div
      className={fillClass}
      data-testid={`admin-svg-dock-panel-${slot}`}
      data-stage-scrollable={stage ? String(stageScrollable) : undefined}
      data-required={slot === "canvas" ? "true" : undefined}
    >
      {node}
    </div>
  );
}

function PreviewPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="preview" />;
}
function StagePanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="stage" stage />;
}
function DetailsPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="details" />;
}
function ToolsPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="tools" />;
}
function PropertiesPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="properties" />;
}
function CanvasPanel(_props: IDockviewPanelProps) {
  return <SlotPanel slot="canvas" stage />;
}

function AdminSvgDockTab(props: IDockviewPanelHeaderProps) {
  return (
    <DockviewDefaultTab
      {...props}
      hideClose={props.api.id === "stage" || props.api.id === "canvas"}
    />
  );
}

const DOCK_COMPONENTS = {
  preview: PreviewPanel,
  stage: StagePanel,
  details: DetailsPanel,
  tools: ToolsPanel,
  properties: PropertiesPanel,
  canvas: CanvasPanel,
};

function seedAdminSvgLayout(
  api: DockviewApi,
  titles: AdminSvgDockPanelTitles,
): void {
  if (api.panels.length > 0) return;

  api.addPanel({
    id: "stage",
    component: "stage",
    title: titles.stage,
    params: {},
  });

  api.addPanel({
    id: "preview",
    component: "preview",
    title: titles.preview,
    position: { referencePanel: "stage", direction: "left" },
    initialWidth: 280,
    params: {},
  });

  api.addPanel({
    id: "details",
    component: "details",
    title: titles.details,
    position: { referencePanel: "stage", direction: "right" },
    initialWidth: 340,
    params: {},
  });
}

export type AdminSvgFreehandDockHostProps = {
  readonly layoutMode?: "freehand";
  readonly slots: AdminSvgDockSlots;
  readonly className?: string;
  /** Tab titles. Defaults: Preview / Studio / Details. Parametric uses Form for stage. */
  readonly titles?: Partial<AdminSvgDockPanelTitles>;
  /**
   * Stage scrolls (form+Maker engines). Default false = canvas fill (Excalidraw).
   */
  readonly stageScrollable?: boolean;
};

export type AdminSvgFactoryDockHostProps = {
  readonly layoutMode: "factory";
  readonly factorySlots: AdminSvgFactoryDockSlots;
  readonly className?: string;
};

export type AdminSvgDockHostProps =
  | AdminSvgFreehandDockHostProps
  | AdminSvgFactoryDockHostProps;

/**
 * Dockable Admin SVG chrome (Dockview + Phosphor tab titles via seed).
 * Freehand: Excalidraw inside stage. Parametric: field form inside stage.
 */
export function AdminSvgDockHost(props: AdminSvgDockHostProps) {
  const layoutMode = props.layoutMode ?? "freehand";
  const slots =
    layoutMode === "factory"
      ? (props as AdminSvgFactoryDockHostProps).factorySlots
      : (props as AdminSvgFreehandDockHostProps).slots;
  const className = props.className;
  const titlesPartial =
    layoutMode === "freehand"
      ? (props as AdminSvgFreehandDockHostProps).titles
      : undefined;
  const stageScrollable =
    layoutMode === "freehand"
      ? ((props as AdminSvgFreehandDockHostProps).stageScrollable ?? false)
      : false;
  const apiRef = useRef<DockviewApi | null>(null);
  const disposablesRef = useRef<Array<{ dispose: () => void }>>([]);

  const titles = useMemo<AdminSvgDockPanelTitles>(
    () => ({
      preview: titlesPartial?.preview ?? DEFAULT_TITLES.preview,
      stage: titlesPartial?.stage ?? DEFAULT_TITLES.stage,
      details: titlesPartial?.details ?? DEFAULT_TITLES.details,
    }),
    [titlesPartial?.preview, titlesPartial?.stage, titlesPartial?.details],
  );

  const dockConfig = useMemo<AdminSvgDockConfig>(
    () => ({ stageScrollable, layoutMode }),
    [layoutMode, stageScrollable],
  );

  const onReady = useCallback(
    (event: DockviewReadyEvent) => {
      apiRef.current = event.api;
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];

      if (layoutMode === "factory") {
        if (!tryRestoreAdminSvgFactoryLayout(event.api)) {
          seedAdminSvgFactoryLayout(event.api);
        }
      } else {
        seedAdminSvgLayout(event.api, titles);
      }

      disposablesRef.current.push(
        event.api.onDidRemovePanel((removed) => {
          if (
            layoutMode === "freehand" &&
            removed.id === "stage" &&
            event.api.getPanel("stage") === null
          ) {
            event.api.addPanel({
              id: "stage",
              component: "stage",
              title: titles.stage,
              params: {},
            });
          }
          if (
            layoutMode === "factory" &&
            removed.id === "canvas" &&
            event.api.getPanel("canvas") === null
          ) {
            event.api.addPanel({
              id: "canvas",
              component: "canvas",
              title: "Canvas",
              minimumWidth: 480,
              minimumHeight: 320,
            });
          }
        }),
      );
      if (layoutMode === "factory") {
        disposablesRef.current.push(
          event.api.onDidLayoutChange(() =>
            persistAdminSvgFactoryLayout(event.api),
          ),
        );
      }
    },
    [layoutMode, titles],
  );

  useEffect(() => {
    return () => {
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];
    };
  }, []);

  const components = useMemo(() => DOCK_COMPONENTS, []);

  return (
    <AdminSvgDockConfigContext.Provider value={dockConfig}>
      <AdminSvgDockSlotsContext.Provider value={slots}>
        <div
          className={`${styles.host} dockview-theme-light ${className ?? ""}`.trim()}
          data-testid="admin-svg-dock-host"
          data-chrome="dockview-react"
          data-stage-scrollable={String(stageScrollable)}
          data-layout-mode={layoutMode}
          data-required-panel={layoutMode === "factory" ? "canvas" : undefined}
          aria-label="SVG studio dock"
        >
          <span className="sr-only">
            {layoutMode === "factory"
              ? "Panels: Tools, Properties, Canvas"
              : `Panels: ${titles.preview}, ${titles.stage}, ${titles.details}`}
          </span>
          <DockviewReact
            className={styles.dockview}
            components={components}
            defaultTabComponent={AdminSvgDockTab}
            onReady={onReady}
            theme={themeLight}
            disableFloatingGroups={false}
            singleTabMode="fullwidth"
          />
        </div>
      </AdminSvgDockSlotsContext.Provider>
    </AdminSvgDockConfigContext.Provider>
  );
}
