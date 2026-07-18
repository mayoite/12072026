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

export type AdminSvgDockSlot = "preview" | "stage" | "details";

export type AdminSvgDockSlots = {
  readonly preview: ReactNode;
  readonly stage: ReactNode;
  readonly details: ReactNode;
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
};

const AdminSvgDockSlotsContext = createContext<AdminSvgDockSlots | null>(null);
const AdminSvgDockConfigContext = createContext<AdminSvgDockConfig>({
  stageScrollable: false,
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

function AdminSvgDockTab(props: IDockviewPanelHeaderProps) {
  return (
    <DockviewDefaultTab {...props} hideClose={props.api.id === "stage"} />
  );
}

const DOCK_COMPONENTS = {
  preview: PreviewPanel,
  stage: StagePanel,
  details: DetailsPanel,
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

export type AdminSvgDockHostProps = {
  readonly slots: AdminSvgDockSlots;
  readonly className?: string;
  /** Tab titles. Defaults: Preview / Studio / Details. Parametric uses Form for stage. */
  readonly titles?: Partial<AdminSvgDockPanelTitles>;
  /**
   * Stage scrolls (form+Maker engines). Default false = canvas fill (Excalidraw).
   */
  readonly stageScrollable?: boolean;
};

/**
 * Dockable Admin SVG chrome (Dockview + Phosphor tab titles via seed).
 * Freehand: Excalidraw inside stage. Parametric: field form inside stage.
 */
export function AdminSvgDockHost({
  slots,
  className,
  titles: titlesPartial,
  stageScrollable = false,
}: AdminSvgDockHostProps) {
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
    () => ({ stageScrollable }),
    [stageScrollable],
  );

  const onReady = useCallback(
    (event: DockviewReadyEvent) => {
      apiRef.current = event.api;
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];

      seedAdminSvgLayout(event.api, titles);

      disposablesRef.current.push(
        event.api.onDidRemovePanel((removed) => {
          if (removed.id === "stage" && event.api.getPanel("stage") == null) {
            event.api.addPanel({
              id: "stage",
              component: "stage",
              title: titles.stage,
              params: {},
            });
          }
        }),
      );
    },
    [titles],
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
          aria-label="SVG studio dock"
        >
          <span className="sr-only">
            Panels: {titles.preview}, {titles.stage}, {titles.details}
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
