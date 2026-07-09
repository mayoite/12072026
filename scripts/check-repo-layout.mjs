/**
 * Fail if forbidden layout paths exist (owner: one results tree, no site dumps).
 * Exit 0 = clean. Exit 1 = violations.
 *
 * Forbidden under site/: results, test-results, .cursor, .firecrawl,
 * tech-stack-docs, tech-stack-generated
 * Required: repo-root results/ (directory may be empty)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN = [
  "site/results",
  "site/test-results",
  "site/.cursor",
  "site/.firecrawl",
  "site/tech-stack-docs",
  "site/tech-stack-generated",
];

const REQUIRED_DIRS = ["results"];

const violations = [];

for (const rel of FORBIDDEN) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) {
    violations.push(`FORBIDDEN present: ${rel}`);
  }
}

for (const rel of REQUIRED_DIRS) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    violations.push(`REQUIRED missing: ${rel}/`);
  }
}

// Tracked files under site/results (git index) — catch re-adds even if empty dir gone
// Optional: only when git is available
try {
  const { execSync } = await import("node:child_process");
  const tracked = execSync("git ls-files site/results site/test-results site/.cursor site/.firecrawl site/tech-stack-docs site/tech-stack-generated", {
    cwd: root,
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  for (const f of tracked) {
    violations.push(`FORBIDDEN tracked in git: ${f}`);
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
