import type { Open3dProject } from "../../model/types";

export type Open3dExportFormat = "json" | "svg" | "png" | "pdf" | "dxf";
export type Open3dExportStatus = "ready" | "unsupported" | "blocked";

export interface Open3dExportPreflight {
  status: Open3dExportStatus;
  format: string;
  filename: string;
  messages: string[];
}

export type Open3dExportJobStatus = "queued" | "running" | "complete" | "cancelled" | "failed";

export interface Open3dExportJob {
  token: string;
  format: Open3dExportFormat;
  filename: string;
  status: Open3dExportJobStatus;
  progress: number;
  createdAt: string;
  updatedAt?: string;
  message?: string;
}

export type ExportJobProgressCallback = (job: Open3dExportJob) => void;

export type ExportJobAnnouncementKind = "started" | "progress" | "complete" | "cancelled" | "failed";

export interface ExportJobAnnouncement {
  kind: ExportJobAnnouncementKind;
  message: string;
  politeness: "polite" | "assertive";
}

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

export function createOpen3dExportJob(
  project: Open3dProject,
  format: Open3dExportFormat,
  now = new Date().toISOString(),
): Open3dExportJob {
  return {
    token: `${format}:${project.id}:${project.activeFloorId}:${now}`,
    format,
    filename: buildExportFilename(project, format),
    status: "queued",
    progress: 0,
    createdAt: now,
  };
}

/** Clamp progress and transition job status for background export runners. */
export function updateExportJobProgress(
  job: Open3dExportJob,
  progress: number,
  onProgress?: ExportJobProgressCallback,
  now = new Date().toISOString(),
): Open3dExportJob {
  const clamped = Math.min(100, Math.max(0, progress));
  const next: Open3dExportJob = {
    ...job,
    status: clamped >= 100 ? "complete" : "running",
    progress: clamped,
    updatedAt: now,
  };
  onProgress?.(next);
  return next;
}

/** Mark an export job cancelled without mutating the original reference. */
export function cancelExportJob(
  job: Open3dExportJob,
  onProgress?: ExportJobProgressCallback,
  now = new Date().toISOString(),
): Open3dExportJob {
  const next: Open3dExportJob = {
    ...job,
    status: "cancelled",
    updatedAt: now,
    message: "Export cancelled",
  };
  onProgress?.(next);
  return next;
}

/** Build screen-reader text for export job lifecycle changes. */
export function formatExportJobAnnouncement(job: Open3dExportJob): ExportJobAnnouncement {
  switch (job.status) {
    case "queued":
      return {
        kind: "started",
        message: `Export started: ${job.filename}`,
        politeness: "polite",
      };
    case "running":
      return {
        kind: "progress",
        message: `Exporting ${job.filename}: ${Math.round(job.progress)}%`,
        politeness: "polite",
      };
    case "complete":
      return {
        kind: "complete",
        message: `Export complete: ${job.filename}`,
        politeness: "polite",
      };
    case "cancelled":
      return {
        kind: "cancelled",
        message: `Export cancelled: ${job.filename}`,
        politeness: "polite",
      };
    case "failed":
      return {
        kind: "failed",
        message: job.message ?? `Export failed: ${job.filename}`,
        politeness: "assertive",
      };
    default: {
      const exhaustive: never = job.status;
      return {
        kind: "failed",
        message: `Export failed: ${String(exhaustive)}`,
        politeness: "assertive",
      };
    }
  }
}

function slug(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "untitled";
}
