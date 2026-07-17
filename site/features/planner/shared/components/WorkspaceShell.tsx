'use client';

import React from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

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
    <div className="bg-inverse text-inverse-body">
      {topbar}
      <div className="">
        {/* Tool Rail */}
        {toolRail && (
          <div className="pw-layer-toolbar sticky top-0 w-14 flex-shrink-0 border-r border-strong bg-inverse">
            {toolRail}
          </div>
        )}
        
        {/* Left Sidebar */}
        {leftSidebar && (
          <div className="pw-layer-sidebar flex-shrink-0 border-r border-strong bg-inverse md:w-60">
            {leftSidebar}
          </div>
        )}
        
        {/* Main Workspace */}
        <div className="pw-layer-canvas isolate">
          {workspace}
        </div>
        
        {/* Right Sidebar */}
        {rightSidebar && (
          <div className="pw-layer-sidebar flex-shrink-0 border-l border-strong bg-inverse md:w-80">
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
    <div className="">
      <PanelGroup orientation={direction}>
        <Panel defaultSize={50} minSize={20}>
          <div className="">
            {leftPanel}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 cursor-col-resize bg-inverse-soft transition-colors hover:bg-primary" />

        <Panel defaultSize={50} minSize={20}>
          <div className="">
            {rightPanel}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
