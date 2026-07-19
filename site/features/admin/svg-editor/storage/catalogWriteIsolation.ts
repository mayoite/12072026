/**
 * Catalog write isolation — fail closed under Vitest when a write targets
 * committed `inventory/descriptors` or `public/svg-catalog`.
 *
 * Production (non-test) publishes may write those paths; tests must use
 * temp inventory roots (`mkdtemp` / `createIsolatedAdminSvgWorkspace`).
 */

import path from "node:path";

import {
  resolveBlockDescriptorsDir,
  resolvePublicDir,
} from "@/lib/paths/sitePackageRoot";

export function resolveCanonicalDescriptorDir(): string {
  return path.resolve(resolveBlockDescriptorsDir());
}

export function resolveCanonicalSvgCatalogDir(): string {
  return path.resolve(resolvePublicDir(), "svg-catalog");
}

/** True when `candidate` is `parent` or a nested path under `parent`. */
export function isWithinDir(parent: string, candidate: string): boolean {
  const resolvedParent = path.resolve(parent);
  const resolvedCandidate = path.resolve(candidate);
  const relative = path.relative(resolvedParent, resolvedCandidate);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

/** True when path is under committed descriptors or svg-catalog. */
export function isCanonicalCatalogPath(candidate: string): boolean {
  return (
    isWithinDir(resolveCanonicalDescriptorDir(), candidate) ||
    isWithinDir(resolveCanonicalSvgCatalogDir(), candidate)
  );
}

/** Vitest / NODE_ENV=test — isolation enforcement is active. */
export function isCatalogIsolationTestRuntime(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return (
    env.VITEST === "true" ||
    typeof env.VITEST_WORKER_ID === "string" ||
    env.NODE_ENV === "test" ||
    (typeof env.PARAMETRIC_FACTORY_E2E_RUN_ID === "string" &&
      env.PARAMETRIC_FACTORY_E2E_RUN_ID.length > 0 &&
      env.NODE_ENV !== "production")
  );
}

export type AssertCatalogWriteOptions = {
  /** Enforce even outside test runtime (unit tests of the guard itself). */
  readonly force?: boolean;
};

export class CatalogIsolationError extends Error {
  readonly code = "catalog_isolation_violation" as const;

  constructor(message: string) {
    super(message);
    this.name = "CatalogIsolationError";
  }
}

/** Throws when a path resolves into either committed catalog tree. */
export function assertCatalogPathIsNonCanonical(targetPath: string): void {
  if (!isCanonicalCatalogPath(targetPath)) {
    return;
  }
  throw new CatalogIsolationError(
    `Catalog isolation violation: path targets committed catalog: ${path.resolve(targetPath)}.`,
  );
}

/**
 * Throws {@link CatalogIsolationError} when `targetPath` points at committed
 * catalog trees during test runtime (or when `force` is set).
 */
export function assertCatalogWriteAllowed(
  targetPath: string,
  options: AssertCatalogWriteOptions = {},
): void {
  if (!options.force && !isCatalogIsolationTestRuntime()) {
    return;
  }
  assertCatalogPathIsNonCanonical(targetPath);
}
