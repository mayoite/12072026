#!/usr/bin/env node
/**
 * Fail on hollow Vitest cases (release-gate Phase 04b).
 * Usage: node scripts/audit-hollow-tests.mjs [--exclude-marketing]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const testsRoot = path.join(siteRoot, "tests");

const excludeMarketing = process.argv.includes("--exclude-marketing");
const MARKETING_SEGMENT = `${path.sep}tests${path.sep}unit${path.sep}app${path.sep}(site)${path.sep}`;

const HOLLOW_PATTERNS = [
  { id: "expect-true", re: /expect\s*\(\s*true\s*\)\s*\.\s*toBe\s*\(\s*true\s*\)/ },
  { id: "sole-truthy", re: /expect\s*\([^)]+\)\s*\.\s*toBeTruthy\s*\(\s*\)/ },
  { id: "empty-catch", re: /catch\s*\([^)]*\)\s*\{\s*\}/ },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function countExpects(source) {
  const matches = source.match(/\bexpect\s*\(/g);
  return matches ? matches.length : 0;
}

const failures = [];

for (const file of walk(testsRoot)) {
  const rel = path.relative(siteRoot, file).replaceAll("\\", "/");
  if (excludeMarketing && file.includes(MARKETING_SEGMENT)) continue;

  const source = readFileSync(file, "utf8");

  for (const { id, re } of HOLLOW_PATTERNS) {
    if (re.test(source)) {
      failures.push({ file: rel, reason: id });
    }
  }

  const itBlocks = [...source.matchAll(/\bit\s*\(\s*['"`][^'"`]+['"`]/g)];
  if (itBlocks.length > 0 && countExpects(source) === 0) {
    failures.push({ file: rel, reason: "zero-expect" });
  }
}

if (failures.length > 0) {
  process.stderr.write(`audit-hollow-tests: ${failures.length} issue(s)\n`);
  for (const f of failures) {
    process.stderr.write(`  ${f.file} — ${f.reason}\n`);
  }
  process.exit(1);
}

process.stdout.write("audit-hollow-tests: ok\n");
