import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "Agents");
const allowed = new Set([
  "INDEX.md",
  "Agents-01-STANDARD.md",
  "Agents-04-testing.md",
  "Agents-05-browser.md",
  "Agents-06-failure.md",
  "Agents-07-docs.md",
  "Agents-08-architecture.md",
  "Agents-09-css.md",
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
