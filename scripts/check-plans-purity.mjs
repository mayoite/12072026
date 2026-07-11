/**
 * Plans purity: buyer-law files must not embed implementation tokens.
 * Allowlist: CONSTRAINTS.md, CODE-REVIEW-REPORT.md, museum paths.
 * Exit 0 = clean. Exit 1 = violations printed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plansRoot = path.join(root, "Plans");

const FORBIDDEN_RE =
  /\b(fabric@|@react-three|FeasibilityCanvas|pnpm exec|konva|three@|\bfabric\.js\b)/i;

const ALLOWLIST_SUFFIX = [
  path.normalize("Planner-track/CONSTRAINTS.md"),
  path.normalize("CODE-REVIEW-REPORT.md"),
];

const MAX_LINES = {
  phaseCard: 45,
  codeReviewStub: 12,
  buyerLawDefault: 220,
};

const SCAN_DIRS = [
  "Planner-track/BOARD.md",
  "Planner-track/START.md",
  "Planner-track/EXECUTE.md",
  "Planner-track/CODE-REVIEWS.md",
  "Planner-track/CONSTRAINTS.md",
  // CHECKPOINTS + CHECKPOINTS are program-law hubs at Planner-track root (length-exempt).
  "Planner-track",
  "Admin-track",
  "Site-track",
  "SEO-track",
  "Security-track",
].map((p) => path.join(plansRoot, p));

/** Reference packs — not buyer-law; skip entirely. */
function isReferencePack(rel) {
  const n = path.normalize(rel).replace(/\\/g, "/");
  return (
    n.includes("/research/") ||
    n.includes("/suggestions/") ||
    n.includes("/benchmark/") ||
    n.includes("/supporting/") ||
    n.includes("/library/") ||
    n.includes("/archive-packs/") ||
    n.includes("/notes/") ||
    n.includes("/impl/") ||
    n.includes("/reviews/") ||
    n.includes("/Refer/") ||
    n.includes("/from-") ||
    n.startsWith("Plans/Refer/") ||
    n === "Plans/Refer"
  );
}

function isAllowlisted(rel) {
  const n = path.normalize(rel);
  return ALLOWLIST_SUFFIX.some((a) => n.endsWith(a) || n.includes("CODE-REVIEW-REPORT"));
}

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

function isFlatPhaseCard(rel) {
  const n = path.normalize(rel).replace(/\\/g, "/");
  return /Plans\/Planner-track\/P\d{2}-[^/]+\.md$/i.test(n);
}

function isProgramLawHub(rel) {
  const n = path.normalize(rel).replace(/\\/g, "/");
  return n === "Plans/Planner-track/CHECKPOINTS.md";
}

function lineLimitFor(rel) {
  const n = path.normalize(rel);
  if (isProgramLawHub(rel)) {
    return 5000;
  }
  if (isFlatPhaseCard(rel)) {
    return 2000;
  }
  if (
    n.includes(path.normalize("Planner-track")) &&
    n.includes(path.normalize(`${path.sep}plan${path.sep}`)) &&
    /P\d{2}-.+\.md$/i.test(n)
  ) {
    return 2000;
  }
  if (n.endsWith("CODE-REVIEW-REPORT.md") && n.includes("Planner-track")) {
    return MAX_LINES.codeReviewStub;
  }
  return MAX_LINES.buyerLawDefault;
}

for (const base of SCAN_DIRS) {
  for (const file of collectMdFiles(base)) {
    const rel = path.relative(root, file);
    if (isReferencePack(rel)) continue;
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    const limit = lineLimitFor(rel);
    if (lines.length > limit) {
      lengthViolations.push(`${rel}: ${lines.length} lines (max ${limit})`);
    }
    if (isAllowlisted(rel)) continue;
    const norm = path.normalize(rel).replace(/\\/g, "/");
    if (isFlatPhaseCard(rel)) continue;
    if (norm.includes("/plan/") && /P\d{2}-/.test(norm)) continue;
    if (norm.includes("/phases/") && norm.includes("/plan/")) continue;
    if (norm.includes("/module/plan/")) continue;
    for (let i = 0; i < lines.length; i++) {
      if (FORBIDDEN_RE.test(lines[i])) {
        violations.push(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 120)}`);
      }
    }
  }
}

if (violations.length || lengthViolations.length) {
  if (violations.length) {
    console.error("check:plans-purity FAIL — implementation tokens in buyer-law Plans files:\n");
    for (const v of violations) console.error(`  ${v}`);
  }
  if (lengthViolations.length) {
    console.error("\ncheck:plans-purity FAIL — Plans files too long (thin buyer law only):\n");
    for (const v of lengthViolations) console.error(`  ${v}`);
  }
  console.error(
    "\nMove stack/detail to CONSTRAINTS.md or Plans/Planner-track/library/from-museum/. Phase cards ~25 lines; CODE-REVIEW stubs ~8 lines.",
  );
  process.exit(1);
}

console.log("check:plans-purity OK");
process.exit(0);
