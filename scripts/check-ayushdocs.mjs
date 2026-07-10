/**
 * ayushdocs = exactly 5 owner files. No agent law. No absolute paths.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "ayushdocs");

const ALLOWED = new Set([
  "00-PENDING.md",
  "12-WORKFLOW.md",
  "18-PRODUCT-CONTEXT.md",
  "19-GOALS-SLICES.md",
  "SESSION-RECAP.md",
]);

const ABS_RE = /[A-Za-z]:\\|\/Users\/|D:\\\\websites/i;
const AGENT_LAW_RE = /Agents\/Agents-|Agents-ELON/i;

if (!fs.existsSync(dir)) {
  console.error("check:ayushdocs FAIL: ayushdocs/ missing");
  process.exit(1);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
const violations = [];

for (const f of files) {
  if (!ALLOWED.has(f)) {
    violations.push(`extra file: ayushdocs/${f} (owner folder = 5 files only)`);
  }
}

for (const f of ALLOWED) {
  if (!files.includes(f)) {
    violations.push(`missing: ayushdocs/${f}`);
  }
}

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ABS_RE.test(line)) {
      violations.push(`ayushdocs/${f}:${i + 1}: absolute path — use repo-relative names`);
    }
    if (AGENT_LAW_RE.test(line)) {
      violations.push(`ayushdocs/${f}:${i + 1}: agent handbook belongs in Agents/ — not ayushdocs`);
    }
  }
}

if (violations.length) {
  console.error("check:ayushdocs FAIL:\n");
  violations.forEach((v) => console.error(`  ${v}`));
  console.error("\nMove detail to archive/museum/ayushdocs-detail/.");
  process.exit(1);
}

console.log("check:ayushdocs OK (5 owner files)");
process.exit(0);
