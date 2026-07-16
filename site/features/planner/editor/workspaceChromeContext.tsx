"use client";

import { createContext, useContext } from "react";

import type {
  ChromePackId,
  ChromePackLayout,
  ChromePackPlacement,
  LayoutPresetId,
  RailLayoutConfig,
} from "./workspaceLayout";

export interface WorkspaceChromeContextValue {
  chrome: ChromePackLayout[];
  rail: RailLayoutConfig;
  presetId: LayoutPresetId | "custom";
  applyPreset: (presetId: LayoutPresetId) => void;
  setChromePlacement: (
    packId: ChromePackId,
    placement: ChromePackPlacement,
    pos?: { x: number; y: number },
  ) => void;
  moveChromePack: (packId: ChromePackId, x: number, y: number) => void;
  setRailLayout: (patch: Partial<RailLayoutConfig>) => void;
  resetLayout: () => void;
}

const WorkspaceChromeContext = createContext<WorkspaceChromeContextValue | null>(null);

export function WorkspaceChromeProvider({
  value,
  children,
}: {
  value: WorkspaceChromeContextValue;
  children: React.ReactNode;
}) {
  return (
    <WorkspaceChromeContext.Provider value={value}>{children}</WorkspaceChromeContext.Provider>
  );
}

export function useWorkspaceChrome(): WorkspaceChromeContextValue | null {
  return useContext(WorkspaceChromeContext);
}

export function useWorkspaceChromeRequired(): WorkspaceChromeContextValue {
  const ctx = useContext(WorkspaceChromeContext);
  if (!ctx) {
    throw new Error("useWorkspaceChromeRequired requires WorkspaceChromeProvider");
  }
  return ctx;
}
