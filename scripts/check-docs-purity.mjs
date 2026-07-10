/**
 * Docs law purity: ayushdocs hub + Agents INDEX must not embed stack implementation.
 * Lockedfiles current.md stubs are allowlisted.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN_RE =
  /\b(fabric@|@react-three|FeasibilityCanvas|pnpm exec|konva|three@|\bfabric\.js\b)/i;

const SCAN = [
  "Agents/INDEX.md",
  "docs/INDEX.md",
  "docs/Lockedfiles/INDEX.md",
].map((p) => path.join(root, p));

const ALLOWLIST = [
  path.normalize("docs/Lockedfiles/planner/proposed.md"),
  path.normalize("docs/Lockedfiles/tech-stack/"),
];

function allowed(rel) {
  const n = path.normalize(rel);
  if (n.includes("museum") || n.includes("conduct/AgentsLocked")) return true;
  return ALLOWLIST.some((a) => n.startsWith(a) || n.endsWith(a));
}

const violations = [];

for (const file of SCAN) {
  if (!fs.existsSync(file)) continue;
  const rel = path.relative(root, file);
  if (allowed(rel)) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (FORBIDDEN_RE.test(lines[i])) {
      violations.push(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 100)}`);
    }
  }
}

if (violations.length) {
  console.error("check:docs-purity FAIL:\n");
  violations.forEach((v) => console.error(`  ${v}`));
  process.exit(1);
}
console.log("check:docs-purity OK");
process.exit(0);
