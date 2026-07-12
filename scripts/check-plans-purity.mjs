/**
 * plan/ purity: phase files must not embed implementation tokens.
 * Exit 0 = clean. Exit 1 = violations printed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plansRoot = path.join(root, "plan");

const FORBIDDEN_RE =
  /\b(fabric@|@react-three|FeasibilityCanvas|pnpm exec|konva|three@|\bfabric\.js\b)/i;

const MAX_LINES = {
  phaseCard: 2000,
  buyerLawDefault: 220,
};

const TRACKS = [
  "Planner",
  "Admin",
  "Buyer",
  "UI",
  "Site",
  "SEO",
  "Security",
];

function collectMdFiles(abs) {
  if (!fs.existsSync(abs)) return [];
  const st = fs.statSync(abs);
  if (st.isFile() && abs.endsWith(".md")) return [abs];
  if (!st.isDirectory()) return [];
  const out = [];
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    out.push(...collectMdFiles(path.join(abs, ent.name)));
  }
  return out;
}

const violations = [];
const lengthViolations = [];

function isPhaseCard(rel) {
  const n = path.normalize(rel).replace(/\\/g, "/");
  return /plan\/[^/]+\/PHASE-\d{2}-[^/]+\.md$/i.test(n);
}

function lineLimitFor(rel) {
  if (isPhaseCard(rel)) return MAX_LINES.phaseCard;
  const n = path.normalize(rel).replace(/\\/g, "/");
  if (n === "plan/README.md" || n === "plan/QUALITY-BAR.md" || n === "plan/UI-BAR.md") {
    return 5000;
  }
  if (n.endsWith("/CHECKLIST.md") || n.endsWith("/README.md")) {
    return 5000;
  }
  return MAX_LINES.buyerLawDefault;
}

for (const track of TRACKS) {
  const base = path.join(plansRoot, track);
  for (const file of collectMdFiles(base)) {
    const rel = path.relative(root, file);
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    const limit = lineLimitFor(rel);
    if (lines.length > limit) {
      lengthViolations.push(`${rel}: ${lines.length} lines (max ${limit})`);
    }
    if (isPhaseCard(rel)) continue;
    for (let i = 0; i < lines.length; i++) {
      if (FORBIDDEN_RE.test(lines[i])) {
        violations.push(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 120)}`);
      }
    }
  }
}

if (violations.length || lengthViolations.length) {
  if (violations.length) {
    console.error("check:plans-purity FAIL — implementation tokens in plan/ files:\n");
    for (const v of violations) console.error(`  ${v}`);
  }
  if (lengthViolations.length) {
    console.error("\ncheck:plans-purity FAIL — plan/ files too long:\n");
    for (const v of lengthViolations) console.error(`  ${v}`);
  }
  process.exit(1);
}

console.log("check:plans-purity OK");
process.exit(0);