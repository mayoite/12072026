"use client";

import { SquaresFour as LayoutGrid, Sparkle as Sparkles, type Icon } from "@phosphor-icons/react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

import { AIAssistDrawer } from "@/features/planner/ai/AIAssistDrawer";
import type { WorkspaceAiBridge } from "@/features/planner/ai/workspaceAiBridge";

import { InventoryPanel } from "./InventoryPanel";
import type { Open3dCatalogItem } from "../catalog/catalogTypes";
import type { WorkstationConfigV0 } from "../catalog/workstationSystemV0";
import type { Open3dWorkspaceCatalogStatus } from "../catalog/useOpen3dWorkspaceCatalog";
import styles from "./workspace.module.css";

type WorkspaceLeftTab = "library" | "ai-assist";

const TAB_META: Record<WorkspaceLeftTab, { label: string; Icon: Icon }> = {
  library: { label: "Library", Icon: LayoutGrid },
  "ai-assist": { label: "AI Assist", Icon: Sparkles },
};

export type WorkspaceLeftPanelProps = {
  catalogItems: Open3dCatalogItem[];
  isLoading: boolean;
  catalogStatus: Open3dWorkspaceCatalogStatus;
  onItemPlace: (itemId: string) => void;
  onWorkstationConfigPlace: (config: WorkstationConfigV0) => void;
  onWorkstationConfigBatchPlace: (config: WorkstationConfigV0, count: number) => void;
  workspaceBridge: WorkspaceAiBridge;
};

export function WorkspaceLeftPanel({
  catalogItems,
  isLoading,
  catalogStatus,
  onItemPlace,
  onWorkstationConfigPlace,
  onWorkstationConfigBatchPlace,
  workspaceBridge,
}: WorkspaceLeftPanelProps) {
  return (
    <Tabs
      className={styles.leftPanelStack}
      defaultSelectedKey="library"
    >
      <TabList className={styles.leftPanelTabs} aria-label="Left panel">
        {(Object.keys(TAB_META) as WorkspaceLeftTab[]).map((tabId) => {
          const { label, Icon } = TAB_META[tabId];
          return (
            <Tab key={tabId} id={tabId} className={styles.leftPanelTab}>
              <Icon size={14} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </Tab>
          );
        })}
      </TabList>

      <TabPanel id="library" className={styles.leftPanelBody}>
        <InventoryPanel
          catalogItems={catalogItems}
          isLoading={isLoading}
          catalogStatus={catalogStatus}
          onItemPlace={onItemPlace}
          onWorkstationConfigPlace={onWorkstationConfigPlace}
          onWorkstationConfigBatchPlace={onWorkstationConfigBatchPlace}
        />
      </TabPanel>

      <TabPanel id="ai-assist" className={styles.leftPanelBody}>
        <AIAssistDrawer
          embedded
          defaultExpanded
          defaultTab="chat"
          workspaceBridge={workspaceBridge}
          panelFill
        />
      </TabPanel>
    </Tabs>
  );
}
