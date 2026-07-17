/**
 * Admin P02 — per-slug catalog lifecycle (live / draft / retired).
 * Server-only manifest I/O; client code imports `catalogLifecycle.shared.ts`.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { BLOCK_DESCRIPTORS_DIR_DEFAULT,
  clearLoaderCache,
  loadAll,
  type BlockDescriptor,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { ADMIN_CATALOG_OPS_DIR_DEFAULT } from "@/lib/paths/adminCatalogOps";

export type {
  CatalogLifecycleEntry,
  CatalogLifecycleManifest,
  CatalogLifecycleState,
} from "./catalogLifecycle.shared";
export {
  CATALOG_LIFECYCLE_MANIFEST,
  inferLifecycleFromArtifact,
  isBuyerVisibleLifecycle,
  isBuyerVisibleSlug,
  resolveCatalogLifecycle,
} from "./catalogLifecycle.shared";

import {
  CATALOG_LIFECYCLE_MANIFEST,
  isBuyerVisibleSlug,
  type CatalogLifecycleEntry,
  type CatalogLifecycleManifest,
  type CatalogLifecycleState,
} from "./catalogLifecycle.shared";

export function lifecycleManifestPath(dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT): string {
  return path.resolve(dir, CATALOG_LIFECYCLE_MANIFEST);
}

function maybeMigrateLegacyLifecycleManifest(
  opsDir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
): void {
  const opsPath = lifecycleManifestPath(opsDir);
  if (existsSync(opsPath)) return;
  const legacyPath = path.resolve(BLOCK_DESCRIPTORS_DIR_DEFAULT, CATALOG_LIFECYCLE_MANIFEST);
  if (!existsSync(legacyPath)) return;
  mkdirSync(opsDir, { recursive: true });
  copyFileSync(legacyPath, opsPath);
}

export function readLifecycleManifest(
  dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
): CatalogLifecycleManifest {
  maybeMigrateLegacyLifecycleManifest(dir);
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
  dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
): void {
  const manifestPath = lifecycleManifestPath(dir);
  mkdirSync(dir, { recursive: true });
  const temp = `${manifestPath}.tmp-${randomBytes(4).toString("hex")}`;
  writeFileSync(temp, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  renameSync(temp, manifestPath);
}

export function setCatalogLifecycle(
  slug: string,
  state: CatalogLifecycleState,
  dir: string = ADMIN_CATALOG_OPS_DIR_DEFAULT,
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

export function loadBuyerVisibleDescriptors(
  options?: { dir?: string; forceReload?: boolean },
): BlockDescriptor[] {
  const manifestDir = options?.dir ?? ADMIN_CATALOG_OPS_DIR_DEFAULT;
  const manifest = readLifecycleManifest(manifestDir);
  return loadAll(options).filter((descriptor) => isBuyerVisibleSlug(descriptor.slug, manifest));
}