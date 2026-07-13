/**
 * Fail if forbidden layout paths exist (owner: one results tree, no site dumps).
 * Exit 0 = clean. Exit 1 = violations.
 *
 * Forbidden under site/: results, test-results, .cursor, .firecrawl,
 * generated documents and legacy generated roots
 * Required: repo-root results/ and agent-reports/ (directories may be empty)
 * Results may not contain Markdown reports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GENERATED_ROOT_DIR,
  LEGACY_GENERATED_ROOTS,
  LEGACY_SOURCE_PACKAGE_DIR,
  SOURCE_PACKAGE_DIR,
} from "../tech-docs-generator/scripts/output-contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN = [
  "site/results",
  "site/test-results",
  "site/.cursor",
  "site/.firecrawl",
  `site/${GENERATED_ROOT_DIR}`,
  `${SOURCE_PACKAGE_DIR}/node_modules`,
  LEGACY_SOURCE_PACKAGE_DIR,
  ...LEGACY_GENERATED_ROOTS,
];

const FORBIDDEN_FILES = [
  `${SOURCE_PACKAGE_DIR}/package-lock.json`,
  `${LEGACY_SOURCE_PACKAGE_DIR}/package-lock.json`,
];

const REQUIRED_DIRS = ["results", "agent-reports"];

const violations = [];

for (const rel of FORBIDDEN) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    violations.push(`FORBIDDEN present: ${rel}`);
  }
}

for (const rel of FORBIDDEN_FILES) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    violations.push(`FORBIDDEN present: ${rel} (use root pnpm-lock.yaml only)`);
  }
}

for (const rel of REQUIRED_DIRS) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    violations.push(`REQUIRED missing: ${rel}/`);
  }
}

const resultsDir = path.join(root, "results");
if (fs.existsSync(resultsDir) && fs.statSync(resultsDir).isDirectory()) {
  const entries = fs.readdirSync(resultsDir, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      violations.push(`FORBIDDEN Markdown report in results/: ${entry.parentPath ? path.relative(root, path.join(entry.parentPath, entry.name)) : entry.name}`);
    }
  }
}

try {
  const { execSync } = await import("node:child_process");
  const tracked = execSync(
    `git ls-files site/results site/test-results site/.cursor site/.firecrawl site/${GENERATED_ROOT_DIR} ${LEGACY_SOURCE_PACKAGE_DIR} ${LEGACY_GENERATED_ROOTS.join(" ")} ${SOURCE_PACKAGE_DIR}/package-lock.json ${SOURCE_PACKAGE_DIR}/node_modules`,
    {
      cwd: root,
      encoding: "utf8",
    },
  )
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  for (const f of tracked) {
    if (fs.existsSync(path.join(root, f))) {
      violations.push(`FORBIDDEN tracked in git: ${f}`);
    }
  }
} catch {
  // no git — skip index check
}

if (violations.length > 0) {
  console.error("check-repo-layout FAILED (AGENTS.md layout):\n");
  for (const v of violations) console.error(`  - ${v}`);
  console.error("\nMove artifacts to repo-root results/ or remove. Do not commit site/ dumps.");
  process.exit(1);
}

console.log("check-repo-layout OK — no forbidden site/ paths");
process.exit(0);
