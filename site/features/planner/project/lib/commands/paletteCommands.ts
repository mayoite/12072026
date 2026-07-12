import type { PlannerTool } from "../../../editor/canvasTool";
import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  PALETTE_TOOLS,
} from "../../../editor/canvasTool";
import { feasibilityCommands } from "./registry";

export type PaletteCommandCategory = "tool" | "action" | "navigation";

export interface PaletteCommand {
  id: string;
  label: string;
  shortcut?: string;
  category: PaletteCommandCategory;
  categoryLabel: string;
  keywords?: string[];
}

export interface PaletteCommandHandlers {
  /** Same PlannerTool surface as rail + keyboard. */
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  zoomReset: () => void;
}

/**
 * Tool list = rail (CANVAS_TOOLS) + door/window/text extras.
 * Restored single authority — no separate TOOL_IDS subset.
 */
export function buildPaletteCommands(): PaletteCommand[] {
  const toolCommands: PaletteCommand[] = PALETTE_TOOLS.map((tool) => ({
    id: `tool-${tool}`,
    label: `${CANVAS_TOOL_LABELS[tool]} tool`,
    shortcut: CANVAS_TOOL_SHORTCUTS[tool],
    category: "tool",
    categoryLabel: "Tools",
    keywords: [tool, CANVAS_TOOL_LABELS[tool].toLowerCase()],
  }));

  const actionCommands: PaletteCommand[] = feasibilityCommands.map((command) => ({
    id: `action-${command.id}`,
    label: command.label,
    shortcut: command.shortcut,
    category: "action",
    categoryLabel: "Actions",
    keywords: [command.id],
  }));

  const navigationCommands: PaletteCommand[] = [
    {
      id: "nav-toggle-view",
      label: "Toggle 2D / 3D view",
      shortcut: "Ctrl+Tab",
      category: "navigation",
      categoryLabel: "View",
      keywords: ["2d", "3d", "view", "toggle"],
    },
    {
      id: "nav-open-palette",
      label: "Open command palette",
      shortcut: "Ctrl+K",
      category: "navigation",
      categoryLabel: "View",
      keywords: ["search", "commands", "palette"],
    },
    {
      id: "nav-redo",
      label: "Redo",
      shortcut: "Ctrl+Shift+Z",
      category: "action",
      categoryLabel: "Actions",
      keywords: ["redo"],
    },
  ];

  return [...navigationCommands, ...actionCommands, ...toolCommands];
}

export function filterPaletteCommands(
  commands: readonly PaletteCommand[],
  query: string,
  limit = 20,
): PaletteCommand[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return commands.slice(0, 12);
  return commands
    .filter((command) => {
      const haystack = [
        command.label,
        command.categoryLabel,
        command.shortcut ?? "",
        ...(command.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, limit);
}

export function runPaletteCommand(
  id: string,
  handlers: PaletteCommandHandlers,
): boolean {
  if (id.startsWith("tool-")) {
    const tool = id.slice("tool-".length) as PlannerTool;
    handlers.setTool(tool);
    return true;
  }

  switch (id) {
    case "nav-toggle-view":
      handlers.toggleView();
      return true;
    case "nav-open-palette":
      handlers.openPalette();
      return true;
    case "nav-redo":
      handlers.redo();
      return true;
    case "action-draw-wall":
      handlers.setTool("wall");
      return true;
    case "action-cancel":
      handlers.cancel();
      return true;
    case "action-undo":
      handlers.undo();
      return true;
    case "action-zoom-reset":
      handlers.zoomReset();
      return true;
    default:
      return false;
  }
}
