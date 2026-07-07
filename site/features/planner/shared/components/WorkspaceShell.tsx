'use client';

import React from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Z } from "@/lib/z-index";

interface WorkspaceShellProps {
  topbar?: React.ReactNode;
  toolRail?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  workspace: React.ReactNode;
}

export function WorkspaceShell({
  topbar,
  toolRail,
  leftSidebar,
  rightSidebar,
  workspace,
}: WorkspaceShellProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-inverse text-slate-100">
      {topbar}
      <div className="flex flex-1 overflow-hidden">
        {/* Tool Rail */}
        {toolRail && (
          <div className="sticky top-0 flex w-14 flex-shrink-0 flex-col overflow-y-auto border-r border-strong bg-inverse" style={{ zIndex: Z.toolbar }}>
            {toolRail}
          </div>
        )}
        
        {/* Left Sidebar */}
        {leftSidebar && (
          <div className="flex w-full flex-shrink-0 flex-col overflow-y-auto border-r border-strong bg-inverse md:w-60" style={{ zIndex: Z.sidebar }}>
            {leftSidebar}
          </div>
        )}
        
        {/* Main Workspace */}
        <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-white isolate" style={{ zIndex: Z.canvas }}>
          {workspace}
        </div>
        
        {/* Right Sidebar */}
        {rightSidebar && (
          <div className="w-full flex-shrink-0 overflow-y-auto border-l border-strong bg-inverse md:w-80" style={{ zIndex: Z.sidebar }}>
            {rightSidebar}
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkspaceSplitPane({
  leftPanel,
  rightPanel,
  direction = 'horizontal',
}: {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <PanelGroup orientation={direction}>
        <Panel defaultSize={50} minSize={20}>
          <div className="h-full w-full relative">
            {leftPanel}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-slate-600 hover:bg-primary transition-colors cursor-col-resize" />

        <Panel defaultSize={50} minSize={20}>
          <div className="h-full w-full relative">
            {rightPanel}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
