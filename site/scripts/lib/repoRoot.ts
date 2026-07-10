import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsLibDir = path.dirname(fileURLToPath(import.meta.url));

export const SITE_PACKAGE_ROOT = path.resolve(scriptsLibDir, "..");
export const REPO_ROOT = path.resolve(SITE_PACKAGE_ROOT, "..");

export function resolveRepoRootFromCwd(cwd = process.cwd()): string {
  return path.basename(cwd) === "site" ? path.resolve(cwd, "..") : cwd;
}
