/**
 * Admin P02 — per-slug catalog lifecycle (live / draft / retired).
 * Sidecar manifest; retire hides from buyer routes without deleting descriptor history.
 */

import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

import {
  BLOCK_DESCRIPTORS_DIR_DEFAULT,
  clearLoaderCache,
  loadAll,
  type BlockDescriptor,
} from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import type { SvgArtifactStatus } from "./svgArtifactStatus.server";

export type CatalogLifecycleState = "live" | "draft" | "retired";

export const CATALOG_LIFECYCLE_MANIFEST = "_catalog-lifecycle.json";

export interface CatalogLifecycleEntry {
  readonly state: CatalogLifecycleState;
  readonly updatedAt: string;
}

export type CatalogLifecycleManifest = Record<string, CatalogLifecycleEntry>;

export function lifecycleManifestPath(dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT): string {
  return path.resolve(dir, CATALOG_LIFECYCLE_MANIFEST);
}

export function readLifecycleManifest(
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): CatalogLifecycleManifest {
  const manifestPath = lifecycleManifestPath(dir);
  if (!existsSync(manifestPath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: CatalogLifecycleManifest = {};
    for (const [slug, entry] of Object.entries(parsed as Record<string, unknown>)) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const state = row.state;
      const updatedAt = row.updatedAt;
      if (
        (state === "live" || state === "draft" || state === "retired") &&
        typeof updatedAt === "string"
      ) {
        out[slug] = { state, updatedAt };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function writeLifecycleManifest(
  manifest: CatalogLifecycleManifest,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): void {
  const manifestPath = lifecycleManifestPath(dir);
  const temp = `${manifestPath}.tmp-${randomBytes(4).toString("hex")}`;
  writeFileSync(temp, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  renameSync(temp, manifestPath);
}

export function inferLifecycleFromArtifact(
  artifactState: SvgArtifactStatus["state"] | undefined,
): CatalogLifecycleState {
  if (artifactState === "published") return "live";
  return "draft";
}

export function resolveCatalogLifecycle(
  slug: string,
  artifactState: SvgArtifactStatus["state"] | undefined,
  manifest: CatalogLifecycleManifest = readLifecycleManifest(),
): CatalogLifecycleState {
  const entry = manifest[slug];
  if (entry) return entry.state;
  return inferLifecycleFromArtifact(artifactState);
}

export function isBuyerVisibleLifecycle(state: CatalogLifecycleState): boolean {
  return state === "live";
}

export function setCatalogLifecycle(
  slug: string,
  state: CatalogLifecycleState,
  dir: string = BLOCK_DESCRIPTORS_DIR_DEFAULT,
): CatalogLifecycleEntry {
  const manifest = readLifecycleManifest(dir);
  const entry: CatalogLifecycleEntry = {
    state,
    updatedAt: new Date().toISOString(),
  };
  manifest[slug] = entry;
  writeLifecycleManifest(manifest, dir);
  clearLoaderCache();
  return entry;
}

/** Legacy descriptors without a manifest entry remain buyer-visible until explicitly set. */
export function isBuyerVisibleSlug(
  slug: string,
  manifest: CatalogLifecycleManifest = readLifecycleManifest(),
): boolean {
  const entry = manifest[slug];
  if (!entry) return true;
  return entry.state === "live";
}

export function loadBuyerVisibleDescriptors(
  options?: { dir?: string; forceReload?: boolean },
): BlockDescriptor[] {
  const dir = options?.dir ?? BLOCK_DESCRIPTORS_DIR_DEFAULT;
  const manifest = readLifecycleManifest(dir);
  return loadAll(options).filter((descriptor) => isBuyerVisibleSlug(descriptor.slug, manifest));
}