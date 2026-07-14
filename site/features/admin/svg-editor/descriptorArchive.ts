/**
 * Phase 08 — rolling archive retention (`_archive/{slug}.{n}.json`).
 *
 * §08-PERS-11: keep the last five versions exclusive of live `n`.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import path from "node:path";

import { versionedDescriptorPath } from "@/features/planner/project/catalog/svg/descriptorPointer";

export const DESCRIPTOR_ARCHIVE_RETENTION = 5;

export function archiveDirFor(dir: string): string {
  return path.resolve(dir, "_archive");
}

export function retainDescriptorArchive(
  slug: string,
  dir: string,
  liveN: number,
): void {
  if (liveN <= 1) return;
  const archiveDir = archiveDirFor(dir);
  mkdirSync(archiveDir, { recursive: true });

  const minKeep = Math.max(1, liveN - DESCRIPTOR_ARCHIVE_RETENTION);
  for (let version = minKeep; version < liveN; version += 1) {
    const source = versionedDescriptorPath(slug, version, dir);
    if (!existsSync(source)) continue;
    const target = path.resolve(archiveDir, `${slug}.${version}.json`);
    copyFileSync(source, target);
  }

  const prefix = `${slug}.`;
  for (const entry of readdirSync(archiveDir)) {
    if (!entry.startsWith(prefix) || !entry.endsWith(".json")) continue;
    const versionText = entry.slice(prefix.length, -".json".length);
    const version = Number(versionText);
    if (!Number.isInteger(version) || version < minKeep) {
      try {
        unlinkSync(path.resolve(archiveDir, entry));
      } catch {
        // Best-effort eviction.
      }
    }
  }
}

export function listArchiveVersions(slug: string, dir: string): number[] {
  const archiveDir = archiveDirFor(dir);
  if (!existsSync(archiveDir)) return [];
  const prefix = `${slug}.`;
  const versions: number[] = [];
  for (const entry of readdirSync(archiveDir)) {
    if (!entry.startsWith(prefix) || !entry.endsWith(".json")) continue;
    const version = Number(entry.slice(prefix.length, -".json".length));
    if (Number.isInteger(version)) versions.push(version);
  }
  return versions.sort((a, b) => a - b);
}

export function clearDescriptorArchive(slug: string, dir: string): void {
  const archiveDir = archiveDirFor(dir);
  if (!existsSync(archiveDir)) return;
  const prefix = `${slug}.`;
  for (const entry of readdirSync(archiveDir)) {
    if (!entry.startsWith(prefix)) continue;
    try {
      unlinkSync(path.resolve(archiveDir, entry));
    } catch {
      // ignore
    }
  }
}

export function clearDescriptorWorkspace(slug: string, dir: string): void {
  clearDescriptorArchive(slug, dir);
  const patterns = [
    `${slug}.json`,
    `${slug}.latest.json`,
    `${slug}.lock`,
  ];
  for (const entry of readdirSync(dir)) {
    if (entry === `${slug}.lock` || patterns.includes(entry)) {
      try {
        unlinkSync(path.resolve(dir, entry));
      } catch {
        // ignore
      }
      continue;
    }
    if (entry.startsWith(`${slug}.`) && entry.endsWith(".json")) {
      try {
        unlinkSync(path.resolve(dir, entry));
      } catch {
        // ignore
      }
    }
  }
  const archiveDir = archiveDirFor(dir);
  if (existsSync(archiveDir) && readdirSync(archiveDir).length === 0) {
    try {
      rmSync(archiveDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
