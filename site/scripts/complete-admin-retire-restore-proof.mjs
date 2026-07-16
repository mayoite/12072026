/**
 * Post-success for admin-svg-retire-restore.spec.ts exit 0.
 * - Removes Failures.md OPEN retire/restore section
 * - Does NOT write [x] into checklists (plan purity forbids checked boxes)
 * - Features map is updated manually or by owner; this only clears Failures.md
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const failuresPath = path.join(repoRoot, "Failures.md");

if (!existsSync(failuresPath)) {
  console.warn("Failures.md missing — skip");
  process.exit(0);
}

const failures = readFileSync(failuresPath, "utf8");
const sectionPattern =
  /(?:\r?\n---\r?\n)?\r?\n## OPEN: Planner retire\/restore canvas[\s\S]*?(?=\r?\n---\r?\n|\r?\n## |\s*$)/;
const updated = failures.replace(sectionPattern, "\n");
if (updated === failures) {
  console.warn("Failures.md section not found — already removed or renamed");
} else {
  writeFileSync(failuresPath, `${updated.trimEnd()}\n`, "utf8");
  console.log("Removed Planner retire/restore canvas from Failures.md");
}

console.log(
  "Checklist: do not write [x] (plan purity). Evidence lives under results/admin/retire-restore-canvas/ and FEATURES.md.",
);
