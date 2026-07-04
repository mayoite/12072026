#!/usr/bin/env node
/**
 * Fail on eslint-disable comments under site/ (release-gate hygiene).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");

const SCAN_DIRS = ["app", "components", "features", "lib", "tests", "scripts"];
const SCAN_SKIP_FILES = new Set(["scripts/audit-eslint-disable.mjs"]);
const DISABLE_RE = /eslint-disable(?:-next-line|-line)?/;

function walk(dir, files = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return files;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (/\.[cm]?[jt]sx?$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const failures = [];

for (const dir of SCAN_DIRS) {
  const root = path.join(siteRoot, dir);
  for (const file of walk(root)) {
    const rel = path.relative(siteRoot, file).replaceAll("\\", "/");
    if (SCAN_SKIP_FILES.has(rel)) continue;
    const source = readFileSync(file, "utf8");
    if (DISABLE_RE.test(source)) {
      failures.push(path.relative(siteRoot, file).replaceAll("\\", "/"));
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`audit-eslint-disable: ${failures.length} file(s)\n`);
  for (const f of failures) {
    process.stderr.write(`  ${f}\n`);
  }
  process.exit(1);
}

process.stdout.write("audit-eslint-disable: ok\n");
