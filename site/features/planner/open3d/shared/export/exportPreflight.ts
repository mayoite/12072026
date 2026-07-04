import type { Open3dProject } from "../../model/types";

export type Open3dExportFormat = "json" | "svg" | "png" | "pdf" | "dxf";
export type Open3dExportStatus = "ready" | "unsupported" | "blocked";

export interface Open3dExportPreflight {
  status: Open3dExportStatus;
  format: string;
  filename: string;
  messages: string[];
}

// Job types + fns removed (dead in prod; only tests used). Reduces uncovered source for PLAN-FAIL-0408.

export const SUPPORTED_EXPORT_FORMATS: readonly Open3dExportFormat[] = [
  "json",
  "svg",
  "png",
  "pdf",
  "dxf",
];

export function isSupportedExportFormat(format: string): format is Open3dExportFormat {
  return (SUPPORTED_EXPORT_FORMATS as readonly string[]).includes(format);
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
  if (!isSupportedExportFormat(format)) {
    const message = format.toLowerCase() === "dwg"
      ? "DWG is unsupported because it is proprietary; export DXF instead."
      : `Unsupported export format: ${format}`;
    return { status: "unsupported", format, filename: "", messages: [message] };
  }

  const filename = buildExportFilename(project, format);
  const activeFloor = project.floors.find((floor) => floor.id === project.activeFloorId) ?? project.floors[0];
  const messages: string[] = [];

  if (!activeFloor) {
    return { status: "blocked", format, filename, messages: ["Project has no floors."] };
  }

  if (format !== "json" && activeFloor.walls.length === 0 && activeFloor.furniture.length === 0) {
    messages.push("Current floor has no exportable geometry.");
  }

  return {
    status: messages.length > 0 ? "blocked" : "ready",
    format,
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
