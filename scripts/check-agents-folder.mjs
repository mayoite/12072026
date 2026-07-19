import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "Agents");

/** Must match `AGENTS.md` handbook routing + workflow roles. */
const allowed = new Set([
  "INDEX.md",
  "01 — Standard.md",
  "02 — Testing.md",
  "03 — Browser.md",
  "04 — Failures.md",
  "05 — Documentation.md",
  "06 — Architecture.md",
  "07 — CSS.md",
  "WORKFLOW-INDEX.md",
  "A — UI Researcher.md",
  "B — Executor.md",
  "C — Critic.md",
]);

const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
const violations = [];

for (const file of files) {
  if (!allowed.has(file)) violations.push(`extra: Agents/${file}`);
}
for (const file of allowed) {
  if (!files.includes(file)) violations.push(`missing: Agents/${file}`);
}

if (violations.length) {
  console.error("check:agents-folder FAIL:\n" + violations.map((item) => `  ${item}`).join("\n"));
  process.exit(1);
}

console.log(`check:agents-folder OK (${files.length} files; no line caps)`);
