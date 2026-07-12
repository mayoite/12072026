import type { PlannerProject, PlannerSceneEnvelope } from "../types";

export interface MigrationResult {
  success: boolean;
  project: PlannerProject;
  backup: PlannerSceneEnvelope;
  report: string[];
  errors?: string[];
}

export type MigrationFn = (project: PlannerProject) => { project: PlannerProject; report: string[] };

interface MigrationRegistryEntry {
  fromVersion: number;
  toVersion: number;
  migrate: MigrationFn;
}

const registry: MigrationRegistryEntry[] = [];

export function registerMigration(fromVersion: number, toVersion: number, migrate: MigrationFn): void {
  registry.push({ fromVersion, toVersion, migrate });
}

export function resetMigrations(): void {
  registry.length = 0;
}

export function getRegisteredMigrations(): readonly MigrationRegistryEntry[] {
  return [...registry];
}

export function migrateEnvelope(
  envelope: PlannerSceneEnvelope,
  targetVersion: number = 1,
): MigrationResult {
  const backup: PlannerSceneEnvelope = JSON.parse(JSON.stringify(envelope));
  const report: string[] = [];
  let currentProject = JSON.parse(JSON.stringify(envelope.project)) as PlannerProject;

  let currentVersion: number = envelope.version;

  while (currentVersion < targetVersion) {
    const next = registry.find((m) => m.fromVersion === currentVersion);
    if (!next) {
      return {
        success: false,
        project: currentProject,
        backup,
        report,
        errors: [`No migration path from version ${currentVersion} to ${targetVersion}`],
      };
    }
    try {
      const result = next.migrate(currentProject);
      currentProject = result.project;
      report.push(`Migrated from v${currentVersion} to v${next.toVersion}`);
      report.push(...result.report);
      currentVersion = next.toVersion;
    } catch (e) {
      return {
        success: false,
        project: currentProject,
        backup,
        report,
        errors: [
          `Migration from v${currentVersion} to v${next.toVersion} failed: ${e instanceof Error ? e.message : String(e)}`,
        ],
      };
    }
  }

  return {
    success: true,
    project: currentProject,
    backup,
    report,
  };
}

export function createEnvelopeV1(project: PlannerProject): PlannerSceneEnvelope {
  return {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm",
    displayUnit: project.displayUnit,
    source: "native-open3d",
    project,
  };
}

export function validateEnvelope(envelope: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof envelope !== "object" || envelope === null) {
    errors.push("Envelope must be an object");
    return { valid: false, errors };
  }
  const e = envelope as Record<string, unknown>;
  if (e.type !== "open3d-floorplan-project") errors.push('Missing or invalid type: expected "open3d-floorplan-project"');
  if (typeof e.version !== "number") errors.push("Missing or invalid version: expected number");
  if (e.units !== "mm") errors.push('Missing or invalid units: expected "mm"');
  if (typeof e.displayUnit !== "string") errors.push("Missing or invalid displayUnit");
  if (typeof e.source !== "string") errors.push("Missing or invalid source");
  if (!e.project || typeof e.project !== "object") errors.push("Missing or invalid project");
  return { valid: errors.length === 0, errors };
}
