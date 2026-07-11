/**
 * Agents/ = tight handbooks. ELON max 100 lines. Peers max 40. INDEX max 25.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "Agents");

const ALLOWED = new Set([
  "INDEX.md",
  "Agents-ELON-STANDARD.md",
  "Agents-tracks.md",
  "Agents-Plan.md",
  "Agents-testing.md",
  "Agents-browser.md",
  "Agents-failure.md",
  "Agents-docs.md",
  "Agents-architecture.md",
  "Agents-css.md",
]);

const MAX_LINES = {
  "Agents-ELON-STANDARD.md": 100,
  "INDEX.md": 25,
  default: 40,
};

const ABS_RE = /[A-Za-z]:\\|\/Users\//;

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
const violations = [];

for (const f of files) {
  if (!ALLOWED.has(f)) violations.push(`extra: Agents/${f}`);
}
for (const f of ALLOWED) {
  if (!files.includes(f)) violations.push(`missing: Agents/${f}`);
}

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const lines = text.split(/\r?\n/);
  const cap = MAX_LINES[f] ?? MAX_LINES.default;
  if (lines.length > cap) {
    violations.push(`Agents/${f}: ${lines.length} lines (max ${cap})`);
  }
  lines.forEach((line, i) => {
    if (ABS_RE.test(line)) {
      violations.push(`Agents/${f}:${i + 1}: absolute path`);
    }
  });
}

if (violations.length) {
  console.error("check:agents-folder FAIL:\n");
  violations.forEach((v) => console.error(`  ${v}`));
  console.error("\nMove essays to Plans/Planner-track/library/from-museum/. Keep handbooks tight.");
  process.exit(1);
}
console.log(`check:agents-folder OK (${files.length} handbooks, ELON≤100)`);
process.exit(0);
