"use client";

/**
 * Admin SVG studio chrome: dockview-react (same package as Planner).
 * Panels: preview | stage (Excalidraw own tools) | details.
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
import { Eye, PencilSimple, ListBullets } from "@phosphor-icons/react";

import styles from "@/app/css/core/locked/chrome/admin-svg-dock.module.css";

export type AdminSvgDockSlot = "preview" | "stage" | "details";

export type AdminSvgDockSlots = {
  readonly preview: ReactNode;
  readonly stage: ReactNode;
  readonly details: ReactNode;
};

const AdminSvgDockSlotsContext = createContext<AdminSvgDockSlots | null>(null);

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
  return (
    <div
      className={stage ? styles.panelFillStage : styles.panelFill}
      data-testid={`admin-svg-dock-panel-${slot}`}
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

function seedAdminSvgLayout(api: DockviewApi): void {
  if (api.panels.length > 0) return;

  api.addPanel({
    id: "stage",
    component: "stage",
    title: "Studio",
    params: {},
  });

  api.addPanel({
    id: "preview",
    component: "preview",
    title: "Preview",
    position: { referencePanel: "stage", direction: "left" },
    initialWidth: 280,
    params: {},
  });

  api.addPanel({
    id: "details",
    component: "details",
    title: "Details",
    position: { referencePanel: "stage", direction: "right" },
    initialWidth: 340,
    params: {},
  });
}

export type AdminSvgDockHostProps = {
  readonly slots: AdminSvgDockSlots;
  readonly className?: string;
};

/**
 * Dockable Admin SVG chrome (Dockview + Phosphor tab titles via seed).
 * Excalidraw keeps its own sketch toolbar inside the stage panel.
 */
export function AdminSvgDockHost({ slots, className }: AdminSvgDockHostProps) {
  const apiRef = useRef<DockviewApi | null>(null);
  const disposablesRef = useRef<Array<{ dispose: () => void }>>([]);

  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;
    for (const d of disposablesRef.current) d.dispose();
    disposablesRef.current = [];

    seedAdminSvgLayout(event.api);

    disposablesRef.current.push(
      event.api.onDidRemovePanel((removed) => {
        if (removed.id === "stage" && event.api.getPanel("stage") == null) {
          event.api.addPanel({
            id: "stage",
            component: "stage",
            title: "Studio",
            params: {},
          });
        }
      }),
    );
  }, []);

  useEffect(() => {
    return () => {
      for (const d of disposablesRef.current) d.dispose();
      disposablesRef.current = [];
    };
  }, []);

  const components = useMemo(() => DOCK_COMPONENTS, []);

  return (
    <AdminSvgDockSlotsContext.Provider value={slots}>
      <div
        className={`${styles.host} dockview-theme-light ${className ?? ""}`}
        data-testid="admin-svg-dock-host"
        data-chrome="dockview-react"
        aria-label="SVG studio dock"
      >
        {/* Phosphor icon legend for chrome (screen-reader + visual consistency with Planner) */}
        <span className="sr-only">
          Panels: Preview <Eye aria-hidden />, Studio <PencilSimple aria-hidden />,
          Details <ListBullets aria-hidden />
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
  );
}
