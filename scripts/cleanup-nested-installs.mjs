/**
 * Remove stray nested installs under site/ (not pnpm workspace shims).
 * Safe to run after root `pnpm install`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const REMOVE_DIRS = ["tech-stack-generator/node_modules"];

const REMOVE_FILES = ["tech-stack-generator/package-lock.json"];

let removed = 0;

for (const rel of REMOVE_DIRS) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true });
    console.log(`cleanup-nested-installs: removed ${rel}/`);
    removed += 1;
  }
}

for (const rel of REMOVE_FILES) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { force: true });
    console.log(`cleanup-nested-installs: removed ${rel}`);
    removed += 1;
  }
}

if (removed === 0) {
  console.log("cleanup-nested-installs: nothing to remove");
}
