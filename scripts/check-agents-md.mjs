import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const agents = path.join(root, "AGENTS.md");
const text = fs.readFileSync(agents, "utf8");

const requiredHandbooks = [
  "Agents/01 — Standard.md",
  "Agents/02 — Testing.md",
  "Agents/03 — Browser.md",
  "Agents/04 — Failures.md",
  "Agents/05 — Documentation.md",
  "Agents/06 — Architecture.md",
  "Agents/07 — CSS.md",
];

const violations = [];
for (const rel of ["Testing-handbook.md", ...requiredHandbooks]) {
  if (!fs.existsSync(path.join(root, rel))) {
    violations.push(`missing: ${rel}`);
  }
}

const handbookSection = text.includes("## Mandatory Handbook Routing");
if (!handbookSection) {
  violations.push("AGENTS.md: missing handbook routing section");
}

if (violations.length) {
  console.error("check:agents-md FAIL:\n" + violations.map((item) => `  ${item}`).join("\n"));
  process.exit(1);
}

console.log(`check:agents-md OK (${requiredHandbooks.length + 1} authority files)`);
