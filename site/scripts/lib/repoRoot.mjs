import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsLibDir = path.dirname(fileURLToPath(import.meta.url));

/** `site/` package root (parent of `scripts/`). */
export const SITE_PACKAGE_ROOT = path.resolve(scriptsLibDir, "..", "..");

/** Monorepo root (parent of `site/`). */
export const REPO_ROOT = path.resolve(SITE_PACKAGE_ROOT, "..");

/** Repo root when `process.cwd()` may be `site/` or repo root. */
export function resolveRepoRootFromCwd(cwd = process.cwd()) {
  return path.basename(cwd) === "site" ? path.resolve(cwd, "..") : cwd;
}
