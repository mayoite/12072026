import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planRoot = path.join(root, "plan");
// svgblunder = SVG-Edit recovery plan (reference track; Admin checklist is Excalidraw-first).
const allowedRoots = new Set([
  "Admin",
  "Planner",
  "Site",
  "Security",
  "Phase-2",
  "svgblunder",
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
  "Admin/README.md",
  "Admin/CHECKLIST.md",
  "Planner/README.md",
  "Planner/CHECKLIST.md",
  "Site/README.md",
  "Site/CHECKLIST.md",
  "Security/README.md",
  "Security/CHECKLIST.md",
  "Phase-2/README.md",
]) {
  if (!markdown.includes(required)) violations.push(`missing: plan/${required}`);
}

for (const track of ["Admin", "Planner", "Site", "Security"]) {
  const checklists = markdown.filter((file) => file.startsWith(`${track}/`) && file.endsWith("CHECKLIST.md"));
  if (checklists.length !== 1) violations.push(`${track} must have exactly one checklist`);
  for (const file of checklists) {
    const text = fs.readFileSync(path.join(planRoot, file), "utf8");
    if (/\[x\]/i.test(text)) violations.push(`checked item: plan/${file}`);
  }
}

// Recovery plan may keep task [x] marks; it is not a product-track checklist.
// Still forbid accidental CHECKLIST.md under svgblunder.
for (const file of markdown.filter((f) => f.startsWith("svgblunder/") && f.endsWith("CHECKLIST.md"))) {
  violations.push(`svgblunder must not use product CHECKLIST.md: plan/${file}`);
}

const phaseTwo = fs.readFileSync(path.join(planRoot, "Phase-2/README.md"), "utf8");
if (/\[[ x]\]/i.test(phaseTwo)) violations.push("Phase-2 must not contain checkboxes");

if (violations.length) {
  console.error("check:plans-purity FAIL:\n" + violations.map((item) => `  ${item}`).join("\n"));
  process.exit(1);
}

console.log("check:plans-purity OK");
