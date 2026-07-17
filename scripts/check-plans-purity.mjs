import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planRoot = path.join(root, "plan");
const allowedRoots = new Set([
  "Admin",
  "Planner",
  "Site",
  "Security",
  "TechStack",
  "svgblunder",
  // Docs design notes only — not a product track checklist root
  "_meta",
]);
const violations = [];

function collect(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? collect(absolute) : [path.relative(planRoot, absolute).replace(/\\/g, "/")];
  });
}

for (const entry of fs.readdirSync(planRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !allowedRoots.has(entry.name)) {
    violations.push(`extra track: plan/${entry.name}`);
  }
}

const markdown = collect(planRoot).filter((file) => file.endsWith(".md"));
for (const required of [
  "README.md",
  "Planner/FINISH-PLAN.md",
  "Planner/FEATURES.md",
  "Admin/FEATURES.md",
  "Site/FEATURES.md",
  "TechStack/COMPLETION-CONTRACT.md",
  "TechStack/FEATURES.md",
  "TechStack/FINISH-PLAN.md",
]) {
  if (!markdown.includes(required)) violations.push(`missing: plan/${required}`);
}

const checklists = markdown.filter((file) => file.endsWith("CHECKLIST.md"));
if (checklists.length !== 0) {
  violations.push("stale CHECKLIST.md found; Planner/FINISH-PLAN.md is the active execution plan");
}
for (const file of ["Planner/FINISH-PLAN.md"]) {
  const text = fs.readFileSync(path.join(planRoot, file), "utf8");
  if (/\[x\]/i.test(text)) violations.push(`checked item: plan/${file}`);
}

// Recovery plan may keep task [x] marks; it is not a product-track checklist.
// Still forbid accidental CHECKLIST.md under svgblunder.
for (const file of markdown.filter((f) => f.startsWith("svgblunder/") && f.endsWith("CHECKLIST.md"))) {
  violations.push(`svgblunder must not use product CHECKLIST.md: plan/${file}`);
}

if (violations.length) {
  console.error("check:plans-purity FAIL:\n" + violations.map((item) => `  ${item}`).join("\n"));
  process.exit(1);
}

console.log("check:plans-purity OK");
