import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolve the `site/` package root whether process.cwd() is the monorepo root
 * or the Next.js package directory (pnpm --filter oando-site).
 */
export function resolveSitePackageRoot(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "features", "planner"))) {
    return cwd;
  }
  const nested = path.join(cwd, "site");
  if (existsSync(path.join(nested, "features", "planner"))) {
    return nested;
  }
  return nested;
}

export function resolveBlockDescriptorsDir(): string {
  return path.join(resolveSitePackageRoot(), "block-descriptors");
}

export function resolvePublicDir(): string {
  return path.join(resolveSitePackageRoot(), "public");
}