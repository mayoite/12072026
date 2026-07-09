import type { Open3dProject } from "../../model/types";

/** Formats that exist in the type system (incl. not-yet-built). */
export type Open3dExportFormat = "json" | "svg" | "png" | "pdf" | "dxf";
export type Open3dExportStatus = "ready" | "unsupported" | "blocked";

export interface Open3dExportPreflight {
  status: Open3dExportStatus;
  format: string;
  filename: string;
  messages: string[];
}

/**
 * Formats that actually download today (not menu theater).
 * PNG / PDF / DXF are known but not shipped — preflight returns unsupported.
 */
export const READY_EXPORT_FORMATS: readonly Open3dExportFormat[] = ["json", "svg"];

/** @deprecated use READY_EXPORT_FORMATS — kept name for existing imports */
export const SUPPORTED_EXPORT_FORMATS = READY_EXPORT_FORMATS;

const NOT_READY_EXPORT_FORMATS: readonly Open3dExportFormat[] = ["png", "pdf", "dxf"];

export function isSupportedExportFormat(format: string): format is Open3dExportFormat {
  return (READY_EXPORT_FORMATS as readonly string[]).includes(format);
}

export function isKnownExportFormat(format: string): format is Open3dExportFormat {
  return (
    (READY_EXPORT_FORMATS as readonly string[]).includes(format) ||
    (NOT_READY_EXPORT_FORMATS as readonly string[]).includes(format)
  );
}

export function buildExportFilename(
  project: Pick<Open3dProject, "name" | "activeFloorId" | "floors">,
  format: Open3dExportFormat,
): string {
  const floor = project.floors.find((entry) => entry.id === project.activeFloorId) ?? project.floors[0];
  const projectName = slug(project.name || "floorplan");
  const floorName = slug(floor?.name || "floor");
  return `${projectName}-${floorName}.${format}`;
}

export function preflightOpen3dExport(project: Open3dProject, format: string): Open3dExportPreflight {
  const normalized = format.toLowerCase();

  if (NOT_READY_EXPORT_FORMATS.includes(normalized as Open3dExportFormat)) {
    return {
      status: "unsupported",
      format: normalized,
      filename: "",
      messages: [
        `${normalized.toUpperCase()} export is not available yet. Use JSON, SVG, workstation BOQ, or quote cart.`,
      ],
    };
  }

  if (!isSupportedExportFormat(normalized)) {
    const message =
      normalized === "dwg"
        ? "DWG is unsupported because it is proprietary; use DXF when available, or JSON/SVG for now."
        : `Unsupported export format: ${format}`;
    return { status: "unsupported", format, filename: "", messages: [message] };
  }

  const filename = buildExportFilename(project, normalized);
  const activeFloor =
    project.floors.find((floor) => floor.id === project.activeFloorId) ?? project.floors[0];
  const messages: string[] = [];

  if (!activeFloor) {
    return { status: "blocked", format: normalized, filename, messages: ["Project has no floors."] };
  }

  if (normalized !== "json" && activeFloor.walls.length === 0 && activeFloor.furniture.length === 0) {
    messages.push("Current floor has no exportable geometry.");
  }

  return {
    status: messages.length > 0 ? "blocked" : "ready",
    format: normalized,
    filename,
    messages,
  };
}

function slug(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "untitled";
}
