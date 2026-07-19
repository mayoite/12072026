"use client";

import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import type { ParametricAuthoringDefinitionRuntime } from "./authoringTypes";

export type ParametricToolRailAdapterProps = {
  readonly definition: ParametricAuthoringDefinitionRuntime;
  readonly activeToolId: string | null;
  readonly onToolSelect: (toolId: string | null) => void;
  readonly onCommand: (command: string) => void;
  readonly onToggle: (field: string) => void;
  readonly onPartRoleFocus: (partRole: string) => void;
  readonly layout?: "wide" | "compact";
};

export function ParametricToolRailAdapter({
  definition,
  activeToolId,
  onToolSelect,
  onCommand,
  onToggle,
  onPartRoleFocus,
  layout = "wide",
}: ParametricToolRailAdapterProps) {
  return (
    <CanvasToolRail
      mode="parametric"
      activeToolId={activeToolId}
      tools={definition.tools}
      layout={layout}
      onParametricToolChange={(toolId) => {
        const tool = definition.tools.find((candidate) => candidate.id === toolId);
        if (!tool) return;
        if (tool.kind === "toggle") {
          onToolSelect(activeToolId === toolId ? null : toolId);
          onToggle(tool.field);
          return;
        }
        onToolSelect(toolId);
        if (tool.kind === "command") onCommand(tool.command);
        if (tool.kind === "part-focus") onPartRoleFocus(tool.partRole);
      }}
    />
  );
}
