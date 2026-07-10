/**
 * AGENTS.md must stay a short constitution — detail in Agents/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "AGENTS.md");
const MAX_LINES = 65;

const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
if (lines.length > MAX_LINES) {
  console.error(`check:agents-md FAIL: AGENTS.md is ${lines.length} lines (max ${MAX_LINES})`);
  console.error("Move detail to Agents/ — AGENTS.md is constitution only (~60 lines).");
  process.exit(1);
}
console.log(`check:agents-md OK (${lines.length}/${MAX_LINES} lines)`);
process.exit(0);
