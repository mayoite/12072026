import {
  existsSync,
  lstatSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import {
  CATALOG_LIFECYCLE_MANIFEST,
  type CatalogLifecycleManifest,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.shared";

import {
  assertCatalogPathIsNonCanonical,
  isWithinDir,
} from "@/features/admin/svg-editor/storage/catalogWriteIsolation";
import { resolveSitePackageRoot } from "@/lib/paths/sitePackageRoot";

const RUN_ID_PATTERN = /^[a-z0-9-]{8,64}$/;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

export type ParametricFactoryE2eRoot = {
  readonly runId: string;
  readonly repoRoot: string;
  readonly siteRoot: string;
  readonly runtimeRoot: string;
  readonly descriptorDir: string;
  readonly lifecycleDir: string;
  readonly svgDir: string;
  descriptorPath(slug: string): string;
  svgPath(slug: string): string;
  previewUrl(slug: string): string;
};

export type ResolveParametricFactoryE2eRootOptions = {
  readonly env?: NodeJS.ProcessEnv;
  readonly nodeEnv?: string;
  readonly siteRoot?: string;
};

function samePath(left: string, right: string): boolean {
  const normalize = (value: string) =>
    process.platform === "win32"
      ? path.resolve(value).toLowerCase()
      : path.resolve(value);
  return normalize(left) === normalize(right);
}

function nearestExistingPath(candidate: string): string {
  let current = path.resolve(candidate);
  while (!existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`No existing ancestor for E2E path: ${candidate}`);
    }
    current = parent;
  }
  return current;
}

function assertNoReparseEscape(trustedRoot: string, candidate: string): void {
  const existingTrustedRoot = nearestExistingPath(trustedRoot);
  const resolvedTrustedRoot = realpathSync.native(existingTrustedRoot);
  const existing = nearestExistingPath(candidate);
  const resolvedExisting = realpathSync.native(existing);
  if (!isWithinDir(resolvedTrustedRoot, resolvedExisting)) {
    throw new Error(`Parametric factory path escapes through a reparse point: ${candidate}`);
  }

  let current = existing;
  while (!samePath(current, trustedRoot)) {
    if (lstatSync(current).isSymbolicLink()) {
      const target = realpathSync.native(current);
      if (!isWithinDir(resolvedTrustedRoot, target)) {
        throw new Error(`Parametric factory symbolic link escapes its root: ${current}`);
      }
    }
    const parent = path.dirname(current);
    if (parent === current || !isWithinDir(trustedRoot, parent)) break;
    current = parent;
  }
}

function assertBoundedPath(
  trustedRoot: string,
  parent: string,
  candidate: string,
  label: string,
): void {
  if (!isWithinDir(parent, candidate)) {
    throw new Error(`Parametric factory ${label} escapes its parent: ${candidate}`);
  }
  assertCatalogPathIsNonCanonical(candidate);
  assertNoReparseEscape(trustedRoot, candidate);
}

function assertSlug(slug: string): void {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid parametric factory slug: ${slug}`);
  }
}

export function resolveParametricFactoryE2eRoot(
  options: ResolveParametricFactoryE2eRootOptions = {},
): ParametricFactoryE2eRoot | undefined {
  const env = options.env ?? process.env;
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const runId = env.PARAMETRIC_FACTORY_E2E_RUN_ID;
  if (!runId || nodeEnv === "production") {
    return undefined;
  }
  if (!RUN_ID_PATTERN.test(runId)) {
    throw new Error(`Invalid parametric factory E2E run id: ${runId}`);
  }

  const siteRoot = path.resolve(options.siteRoot ?? resolveSitePackageRoot());
  const repoRoot = path.dirname(siteRoot);
  const runtimeParent = path.join(repoRoot, ".e2e-runtime", "parametric-factory");
  const expectedRuntimeRoot = path.join(runtimeParent, runId);
  const configuredRuntimeRoot = env.PARAMETRIC_FACTORY_E2E_ROOT;
  if (!configuredRuntimeRoot || !samePath(configuredRuntimeRoot, expectedRuntimeRoot)) {
    throw new Error(
      `PARAMETRIC_FACTORY_E2E_ROOT must equal the exact run root: ${expectedRuntimeRoot}`,
    );
  }

  const runtimeRoot = path.resolve(configuredRuntimeRoot);
  const descriptorDir = path.join(runtimeRoot, "inventory", "descriptors");
  const lifecycleDir = path.join(runtimeRoot, "inventory", "lifecycle");
  const svgParent = path.join(siteRoot, "public", ".e2e-svg-catalog");
  const svgDir = path.join(svgParent, runId);

  assertBoundedPath(repoRoot, runtimeParent, runtimeRoot, "run root");
  assertBoundedPath(repoRoot, runtimeRoot, descriptorDir, "descriptor root");
  assertBoundedPath(repoRoot, runtimeRoot, lifecycleDir, "lifecycle root");
  assertBoundedPath(siteRoot, svgParent, svgDir, "SVG root");

  return {
    runId,
    repoRoot,
    siteRoot,
    runtimeRoot,
    descriptorDir,
    lifecycleDir,
    svgDir,
    descriptorPath: (slug) => {
      assertSlug(slug);
      const candidate = path.join(descriptorDir, `${slug}.json`);
      assertBoundedPath(runtimeRoot, descriptorDir, candidate, "descriptor path");
      return candidate;
    },
    svgPath: (slug) => {
      assertSlug(slug);
      const candidate = path.join(svgDir, `${slug}.svg`);
      assertBoundedPath(svgDir, svgDir, candidate, "SVG path");
      return candidate;
    },
    previewUrl: (slug) => {
      assertSlug(slug);
      return `/.e2e-svg-catalog/${runId}/${slug}.svg`;
    },
  };
}

export function cleanupParametricFactoryE2eRoot(
  root: ParametricFactoryE2eRoot,
): void {
  if (!RUN_ID_PATTERN.test(root.runId)) {
    throw new Error(`Invalid parametric factory E2E run id: ${root.runId}`);
  }
  const trustedSiteRoot = path.resolve(resolveSitePackageRoot());
  const trustedRepoRoot = path.dirname(trustedSiteRoot);
  if (
    !samePath(root.siteRoot, trustedSiteRoot) ||
    !samePath(root.repoRoot, trustedRepoRoot)
  ) {
    throw new Error(`Refusing cleanup with untrusted parametric factory roots`);
  }
  const expectedRuntimeRoot = path.join(
    trustedRepoRoot,
    ".e2e-runtime",
    "parametric-factory",
    root.runId,
  );
  if (!samePath(root.runtimeRoot, expectedRuntimeRoot)) {
    throw new Error(`Refusing cleanup outside the exact parametric factory run root`);
  }
  const expectedSvgDir = path.join(
    trustedSiteRoot,
    "public",
    ".e2e-svg-catalog",
    root.runId,
  );
  if (!samePath(root.svgDir, expectedSvgDir)) {
    throw new Error(`Refusing cleanup outside the exact parametric factory SVG root`);
  }
  if (existsSync(root.runtimeRoot) && lstatSync(root.runtimeRoot).isSymbolicLink()) {
    throw new Error(`Refusing cleanup through a parametric factory reparse point`);
  }
  if (existsSync(root.svgDir) && lstatSync(root.svgDir).isSymbolicLink()) {
    throw new Error(`Refusing cleanup through a parametric factory SVG reparse point`);
  }
  assertBoundedPath(
    trustedRepoRoot,
    path.dirname(root.runtimeRoot),
    root.runtimeRoot,
    "run root",
  );
  assertBoundedPath(
    trustedSiteRoot,
    path.dirname(root.svgDir),
    root.svgDir,
    "SVG root",
  );
  rmSync(root.runtimeRoot, { recursive: true, force: true });
  rmSync(root.svgDir, { recursive: true, force: true });
}

export function readParametricFactoryLifecycle(
  root: ParametricFactoryE2eRoot,
): CatalogLifecycleManifest {
  const manifestPath = path.join(root.lifecycleDir, CATALOG_LIFECYCLE_MANIFEST);
  assertBoundedPath(root.runtimeRoot, root.lifecycleDir, manifestPath, "lifecycle manifest");
  if (!existsSync(manifestPath)) return {};
  const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as unknown;
  if (!parsed || typeof parsed !== "object") return {};
  const manifest: CatalogLifecycleManifest = {};
  for (const [slug, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as Record<string, unknown>;
    if (
      (entry.state === "live" || entry.state === "draft" || entry.state === "retired") &&
      typeof entry.updatedAt === "string"
    ) {
      manifest[slug] = { state: entry.state, updatedAt: entry.updatedAt };
    }
  }
  return manifest;
}
