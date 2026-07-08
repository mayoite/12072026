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
    <div className="bg-inverse text-slate-100">
      {topbar}
      <div className="">
        {/* Tool Rail */}
        {toolRail && (
          <div className="sticky top-0 w-14 flex-shrink-0 border-r border-strong bg-inverse" style={{ zIndex: Z.toolbar }}>
            {toolRail}
          </div>
        )}
        
        {/* Left Sidebar */}
        {leftSidebar && (
          <div className="flex-shrink-0 border-r border-strong bg-inverse md:w-60" style={{ zIndex: Z.sidebar }}>
            {leftSidebar}
          </div>
        )}
        
        {/* Main Workspace */}
        <div className="isolate" style={{ zIndex: Z.canvas }}>
          {workspace}
        </div>
        
        {/* Right Sidebar */}
        {rightSidebar && (
          <div className="flex-shrink-0 border-l border-strong bg-inverse md:w-80" style={{ zIndex: Z.sidebar }}>
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

        <PanelResizeHandle className="w-1 bg-slate-600 hover:bg-primary transition-colors cursor-col-resize" />

        <Panel defaultSize={50} minSize={20}>
          <div className="">
            {rightPanel}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
