/**
 * Active law-layer doc budget: max 150 markdown files.
 * Museum + archive + results + site + docs/architecture are NOT counted.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_ACTIVE = 150;

/** Glob-like explicit roots — only buyer/owner/process hubs. */
const ACTIVE_ROOTS = [
  "AGENTS.md",
  "DOC-MAP.md",
  "Agents",
  "ayushdocs",
  "Plans",
  "docs/INDEX.md",
  "docs/Lockedfiles/INDEX.md",
  "docs/Lockedfiles/01-planner-current.md",
];

function collectMd(abs) {
  if (!fs.existsSync(abs)) return [];
  const st = fs.statSync(abs);
  if (st.isFile() && abs.endsWith(".md")) return [abs];
  if (!st.isDirectory()) return [];
  const out = [];
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.name === "node_modules") continue;
    // Plans reference packs — consolidated history, not law-layer budget.
    const underPlans = /[/\\]Plans([/\\]|$)/.test(abs);
    if (
      underPlans &&
      (ent.name === "research" ||
        ent.name === "suggestions" ||
        ent.name === "benchmark" ||
        ent.name === "supporting" ||
        ent.name === "library" ||
        ent.name === "archive-packs" ||
        ent.name === "notes" ||
        ent.name === "impl" ||
        ent.name === "reviews" ||
        ent.name.startsWith("from-"))
    ) {
      continue;
    }
    out.push(...collectMd(path.join(abs, ent.name)));
  }
  return out;
}

const files = new Set();
for (const rel of ACTIVE_ROOTS) {
  for (const f of collectMd(path.join(root, rel))) {
    files.add(path.normalize(f));
  }
}

const relPaths = [...files]
  .map((f) => path.relative(root, f))
  .sort((a, b) => a.localeCompare(b));

if (relPaths.length > MAX_ACTIVE) {
  console.error(`check:active-docs FAIL: ${relPaths.length} active MDs (max ${MAX_ACTIVE}):\n`);
  relPaths.forEach((p) => console.error(`  ${p}`));
  console.error("\nMove detail out of active budget or merge into track BOARD.md / Lockedfiles *-current.md.");
  process.exit(1);
}

console.log(`check:active-docs OK (${relPaths.length}/${MAX_ACTIVE})`);
process.exit(0);
