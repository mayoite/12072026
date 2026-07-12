/**
 * Admin P06 — list on-disk descriptor revisions for one slug.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { BLOCK_DESCRIPTORS_DIR_DEFAULT } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import {
  parseBlockDescriptor,
} from "@/features/planner/project/catalog/svg/svgTypes";
import {
  readLatestPointer,
  resolveCurrentVersion,
  versionedDescriptorPath,
} from "@/features/planner/project/catalog/svg/descriptorPointer";

export type DescriptorRevisionEntry = {
  readonly version: number;
  readonly checksum: string;
  readonly generatedAt: number | null;
  readonly isCurrent: boolean;
};

export function listDescriptorRevisions(
  slug: string,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): DescriptorRevisionEntry[] {
  const current = resolveCurrentVersion(slug, dir);
  const pointer = readLatestPointer(slug, dir);
  const versions = new Set<number>();
  if (current > 0) versions.add(current);

  if (existsSync(dir)) {
    const prefix = `${slug}.`;
    for (const entry of readdirSync(dir)) {
      if (!entry.startsWith(prefix) || !entry.endsWith(".json") || entry.endsWith(".latest.json")) {
        continue;
      }
      const versionText = entry.slice(prefix.length, -".json".length);
      const version = Number(versionText);
      if (Number.isInteger(version) && version > 0) versions.add(version);
    }
  }

  const entries: DescriptorRevisionEntry[] = [];
  for (const version of [...versions].sort((a, b) => b - a)) {
    const filePath = versionedDescriptorPath(slug, version, dir);
    if (!existsSync(filePath)) continue;
    try {
      const raw = readFileSync(filePath, "utf8");
      const parsed = parseBlockDescriptor(JSON.parse(raw) as unknown);
      if (!parsed.ok) continue;
      entries.push({
        version,
        checksum: parsed.value.checksum,
        generatedAt: parsed.value.generatedAt ?? null,
        isCurrent: pointer?.n === version,
      });
    } catch {
      // skip unreadable revision
    }
  }
  return entries;
}

export function readDescriptorAtVersion(
  slug: string,
  version: number,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): Record<string, unknown> | null {
  const filePath = versionedDescriptorPath(slug, version, dir);
  if (!existsSync(filePath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}