import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planRoot = path.join(root, "plan");
const allowedRoots = new Set(["Admin", "Planner", "Site", "TechStack"]);
const productTracks = ["Admin", "Planner", "Site", "TechStack"];
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

if (!markdown.includes("README.md")) {
  violations.push("missing: plan/README.md");
}

for (const f of markdown) {
  if (f === "README.md") continue;
  const parts = f.split("/");
  if (parts.length === 1) {
    violations.push(`extra plan root doc (only README.md allowed at plan/): plan/${f}`);
    continue;
  }
  if (parts.length !== 2 || !allowedRoots.has(parts[0])) {
    violations.push(`extra or misplaced plan doc: plan/${f}`);
  }
}

for (const track of productTracks) {
  for (const file of ["CHECKLIST.md", "FEATURES.md"]) {
    const rel = `${track}/${file}`;
    if (!markdown.includes(rel)) violations.push(`missing: plan/${rel}`);
  }
  const trackMd = markdown.filter((f) => f.startsWith(`${track}/`) && f.endsWith(".md"));
  for (const f of trackMd) {
    const base = path.posix.basename(f);
    if (base !== "CHECKLIST.md" && base !== "FEATURES.md") {
      violations.push(`extra plan doc (only CHECKLIST+FEATURES allowed): plan/${f}`);
    }
  }
}

for (const f of markdown) {
  if (/(^|\/)(OUTSTANDING(-ITEMS)?|FINISH-PLAN|COMPLETION-CONTRACT)\.md$/i.test(f)) {
    violations.push(`retired plan doc name: plan/${f}`);
  }
}

for (const track of productTracks) {
  const file = `${track}/CHECKLIST.md`;
  if (!markdown.includes(file)) continue;
  const text = fs.readFileSync(path.join(planRoot, file), "utf8");
  if (/\[x\]/i.test(text)) violations.push(`checked item: plan/${file}`);
}

if (violations.length) {
  console.error("check:plans-purity FAIL:\n" + violations.map((item) => `  ${item}`).join("\n"));
  process.exit(1);
}

console.log("check:plans-purity OK — each track: CHECKLIST.md + FEATURES.md only");
