/**
 * One-shot: find scripts that reference missing packages, feature dirs, or dead routes.
 * Usage: node scripts/_audit-stale-scripts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsDir = path.join(siteRoot, "scripts");
const pkg = JSON.parse(fs.readFileSync(path.join(siteRoot, "package.json"), "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "generate-svg") {
        // still scan generate-svg briefly
      }
      walk(abs, pred, out);
    } else if (pred(entry.name)) out.push(abs);
  }
  return out;
}

function walkPages(appDir) {
  const routes = new Set();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.name === "page.tsx") {
        const rel = path.relative(appDir, abs).replace(/\\/g, "/");
        const segs = rel
          .split("/")
          .filter((s) => s !== "page.tsx" && !(s.startsWith("(") && s.endsWith(")")));
        const route = `/${segs.join("/")}`.replace(/\/+/g, "/") || "/";
        routes.add(route === "/" ? "/" : route.replace(/\/$/, "") || "/");
      }
    }
  }
  walk(appDir);
  return routes;
}

const routes = walkPages(path.join(siteRoot, "app"));
const routeExists = (r) => {
  if (routes.has(r)) return true;
  // dynamic: /portal/[id] matches /portal/foo loosely for static probes only exact
  return [...routes].some((x) => x === r);
};

const featureChecks = {
  "features/planner/tldraw": fs.existsSync(path.join(siteRoot, "features/planner/tldraw")),
  "features/buddy-planner": fs.existsSync(path.join(siteRoot, "features/buddy-planner")),
  "lib/configurator": fs.existsSync(path.join(siteRoot, "lib/configurator")),
  "public/tldraw-assets": fs.existsSync(path.join(siteRoot, "public/tldraw-assets")),
  "block-descriptors": fs.existsSync(path.join(siteRoot, "block-descriptors")),
};

const packageChecks = {
  tldraw: Boolean(deps.tldraw || deps["@tldraw/tldraw"]),
  konva: Boolean(deps.konva || deps["react-konva"]),
  "nova-act": Boolean(deps["nova-act"]),
  fabric: Boolean(deps.fabric),
  three: Boolean(deps.three),
  "@playwright/test": Boolean(deps["@playwright/test"]),
};

const scriptFiles = walk(
  scriptsDir,
  (name) => /\.(mjs|js|ts|cjs|py|ps1)$/.test(name) && !name.startsWith("_audit"),
);

/** @type {Array<{file:string, issues:string[]}>} */
const findings = [];

const hardRoutes = [
  "/configurator/guest",
  "/configurator",
  "/buddy-planner",
  "/buddy-planner/editor",
  "/buddy-planner/guest",
  "/oando-planner/canvas",
];

for (const abs of scriptFiles) {
  const rel = path.relative(siteRoot, abs).replace(/\\/g, "/");
  const text = fs.readFileSync(abs, "utf8");
  const issues = [];

  if (/tldraw/i.test(text) && !featureChecks["features/planner/tldraw"]) {
    issues.push("references tldraw but features/planner/tldraw missing");
  }
  if (/buddy-planner|buddyPlanner|features\/buddy/i.test(text) && !featureChecks["features/buddy-planner"]) {
    issues.push("references buddy-planner path/feature missing");
  }
  if (/from\s+['"]nova_act['"]|require\(['"]nova.act['"]\)|nova-act/i.test(text) && !packageChecks["nova-act"]) {
    issues.push("imports nova-act but package not in package.json");
  }
  if (/lib\/configurator/i.test(text) && !featureChecks["lib/configurator"]) {
    // allow @/lib/catalog/configuratorCatalog
    if (!/lib\/catalog\/configurator/i.test(text) || /lib\/configurator\//i.test(text)) {
      if (/[\"']@\/lib\/configurator|lib\/configurator\//.test(text)) {
        issues.push("references lib/configurator/ tree missing");
      }
    }
  }
  for (const r of hardRoutes) {
    if (text.includes(r) && !routeExists(r)) {
      issues.push(`hardcodes route ${r} which has no app page`);
    }
  }
  // dead package-like script names
  if (/tldraw-coverage/i.test(path.basename(abs)) && !featureChecks["features/planner/tldraw"]) {
    issues.push("script exists solely for removed tldraw coverage");
  }

  if (issues.length) findings.push({ file: rel, issues: [...new Set(issues)] });
}

// Known whole-script archive candidates (by basename purpose)
const archiveByName = [
  "tldraw-coverage-report.mjs",
  "screenshot_all_pages.py", // nova_act + API key hardcoded
  "scrapeAfcChairs.ts", // competitor scrape risk
  "tmp-run-features.mjs",
];

const report = {
  generatedAt: new Date().toISOString(),
  packages: packageChecks,
  featureDirs: featureChecks,
  samplePlannerRoutes: [...routes].filter((r) => r.includes("planner")).sort(),
  hardRoutesMissing: hardRoutes.filter((r) => !routeExists(r)),
  findings,
  archiveCandidatesByName: archiveByName.filter((n) =>
    fs.existsSync(path.join(scriptsDir, n)),
  ),
  summary: {
    scriptsScanned: scriptFiles.length,
    scriptsWithIssues: findings.length,
  },
};

const outDir = path.join(siteRoot, "..", "results", "site", "scripts-audit");
fs.mkdirSync(outDir, { recursive: true });
const outJson = path.join(outDir, "stale-scripts-audit.json");
const outMd = path.join(outDir, "STALE-SCRIPTS.md");
fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");

const md = [
  "# Stale scripts audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  "## Packages present?",
  "",
  ...Object.entries(packageChecks).map(([k, v]) => `- **${k}**: ${v ? "yes" : "**NO**"}`),
  "",
  "## Feature dirs present?",
  "",
  ...Object.entries(featureChecks).map(([k, v]) => `- **${k}**: ${v ? "yes" : "**MISSING**"}`),
  "",
  "## Dead hard-coded routes (no page.tsx)",
  "",
  ...report.hardRoutesMissing.map((r) => `- \`${r}\``),
  "",
  `## Scripts with issues (${findings.length}/${scriptFiles.length})`,
  "",
  ...findings.flatMap((f) => [
    `### \`${f.file}\``,
    ...f.issues.map((i) => `- ${i}`),
    "",
  ]),
  "## Archive candidates (name-based)",
  "",
  ...report.archiveCandidatesByName.map((n) => `- \`site/scripts/${n}\``),
  "",
  "## Notes",
  "",
  "- Fabric canvas-audit scripts may still be valid (fabric package present; destination engine).",
  "- Prefer **archive** over delete per AGENTS.md.",
  "- Do not run `screenshot_all_pages.py` (hardcoded API key + nova_act missing).",
  "",
].join("\n");

fs.writeFileSync(outMd, md, "utf8");
console.log(md);
console.log("\nWrote", outMd);
