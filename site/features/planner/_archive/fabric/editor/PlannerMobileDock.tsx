"use client";

import { useMemo, useState } from "react";
import { DotsThree as MoreHorizontal } from "@phosphor-icons/react";
import type { ToolDef, PlannerStoreTool, PlannerToolId } from "@/features/planner/editor/PlannerToolRail";
import { TOOL_GROUPS, isToolActive } from "@/features/planner/editor/PlannerToolRail";
import { BottomSheet } from "@/features/planner/ui/BottomSheet";
import { Tooltip } from "@/features/planner/ui/Tooltip";

const DOCK_VISIBLE_COUNT = 4;

interface PlannerMobileDockProps {
  tools: ToolDef[];
  activeTool: PlannerToolId;
  activePlannerTool?: PlannerStoreTool;
  onSelect: (toolId: PlannerToolId, plannerTool: PlannerStoreTool) => void;
}

function DockToolButton({
  tool,
  active,
  onSelect,
}: {
  tool: ToolDef;
  active: boolean;
  onSelect: PlannerMobileDockProps["onSelect"];
}) {
  const Icon = tool.icon;

  return (
    <Tooltip key={tool.id} content={tool.label} shortcut={tool.shortcut} side="top">
      <button
        type="button"
        className="pw-mobile-dock-btn pwx-dock-btn"
        data-active={active}
        onClick={() => onSelect(tool.toolId, tool.plannerTool)}
        aria-pressed={active}
        aria-label={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
      >
        <Icon size={20} strokeWidth={1.75} aria-hidden />
        <span className="sr-only">{tool.label}</span>
      </button>
    </Tooltip>
  );
}

export function PlannerMobileDock({
  tools,
  activeTool,
  activePlannerTool,
  onSelect,
}: PlannerMobileDockProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  const { dockTools, overflowTools } = useMemo(() => {
    const primary = tools.slice(0, DOCK_VISIBLE_COUNT);
    const overflow = tools.slice(DOCK_VISIBLE_COUNT);
    return { dockTools: primary, overflowTools: overflow };
  }, [tools]);

  const overflowActive = overflowTools.some((tool) =>
    isToolActive(tool, activeTool, activePlannerTool),
  );

  const handleSelect = (toolId: PlannerToolId, plannerTool: PlannerStoreTool) => {
    onSelect(toolId, plannerTool);
    setMoreOpen(false);
  };

  return (
    <>
      <nav className="pw-mobile-dock md:hidden" aria-label="Mobile drawing tools">
        {dockTools.map((tool) => (
          <DockToolButton
            key={tool.id}
            tool={tool}
            active={isToolActive(tool, activeTool, activePlannerTool)}
            onSelect={handleSelect}
          />
        ))}
        {overflowTools.length > 0 ? (
          <Tooltip content="More tools" side="top">
            <button
              type="button"
              className="pw-mobile-dock-btn pwx-dock-btn"
              data-active={overflowActive || moreOpen}
              onClick={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
              aria-haspopup="dialog"
              aria-label="More drawing tools"
            >
              <MoreHorizontal size={20} strokeWidth={1.75} aria-hidden />
              <span className="sr-only">More tools</span>
            </button>
          </Tooltip>
        ) : null}
      </nav>

      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title="Drawing tools">
        <div className="space-y-5 px-4 pb-6">
          {TOOL_GROUPS.map((group) => {
            const groupTools = group.tools.filter((tool) =>
              overflowTools.some((overflowTool) => overflowTool.id === tool.id),
            );
            if (groupTools.length === 0) return null;

            return (
              <div key={group.id}>
                <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {group.label}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {groupTools.map((tool) => {
                    const Icon = tool.icon;
                    const active = isToolActive(tool, activeTool, activePlannerTool);
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        className="pw-mobile-dock-btn gap-1 rounded-xl border border-soft bg-panel p-3"
                        data-active={active}
                        onClick={() => handleSelect(tool.toolId, tool.plannerTool)}
                        aria-pressed={active}
                        aria-label={tool.label}
                      >
                        <Icon size={18} strokeWidth={1.75} aria-hidden />
                        <span className="text-[10px] font-semibold text-body">{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
