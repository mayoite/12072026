/** Refresh results/coverage-summary.json scopes from on-disk coverage-final files (no Vitest). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  addMetrics,
  emptyMetrics,
  finalizeMetrics,
} from "./coverage-metrics.mjs";

export function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/").toLowerCase();
}

export function scopeFromPath(filePath) {
  const n = normalizePath(filePath);
  if (n.includes("/features/planner/")) return "features/planner";
  if (n.includes("/features/")) return "features/other";
  if (n.includes("/lib/")) return "lib";
  if (n.includes("/components/")) return "components";
  if (n.includes("/app/")) return "app";
  if (n.includes("/data/")) return "data";
  return "other";
}

export const SITE_SCOPE_PREFIXES = [
  "features/site/data/",
  "lib/catalog/",
  "lib/configurator/",
  "lib/catalog/site/",
  "features/shared/",
  "features/site/assistant/",
  "features/ops/",
];
export const SITE_SCOPE_EXACT = "features/site/advisor/aiadvisor.ts";

export function isSiteScopeFile(filePath) {
  const n = normalizePath(filePath);
  if (n.endsWith(SITE_SCOPE_EXACT) || n.endsWith(`/${SITE_SCOPE_EXACT}`)) {
    return true;
  }
  if (n.includes("/lib/configurator/")) {
    return n.endsWith(".ts") && !n.endsWith(".d.ts");
  }
  return SITE_SCOPE_PREFIXES.some(
    (prefix) => n.includes(`/${prefix}`) || n.includes(prefix),
  );
}

export function refreshCoverageSummary(workspaceRoot) {
  const summaryPath = path.join(workspaceRoot, "results/coverage-summary.json");
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));

  const planner = JSON.parse(
    fs.readFileSync(path.join(workspaceRoot, "results/coverage/coverage-final.json"), "utf8"),
  );
  const siteData = JSON.parse(
    fs.readFileSync(path.join(workspaceRoot, "results/coverage-site/coverage-final.json"), "utf8"),
  );

  const scopes = {
    all: emptyMetrics(),
    "features/planner": emptyMetrics(),
    "features/other": emptyMetrics(),
    lib: emptyMetrics(),
    components: emptyMetrics(),
    app: emptyMetrics(),
    data: emptyMetrics(),
  };

  for (const [fp, cov] of Object.entries(planner)) {
    addMetrics(scopes.all, cov);
    const scope = scopeFromPath(fp);
    if (scopes[scope]) addMetrics(scopes[scope], cov);
  }

  const site = emptyMetrics();
  for (const [fp, cov] of Object.entries(siteData)) {
    if (isSiteScopeFile(fp)) addMetrics(site, cov);
  }

  for (const b of Object.values(scopes)) finalizeMetrics(b);
  finalizeMetrics(site);

  summary.scopes = { ...scopes, site };
  summary.generatedAt = new Date().toISOString();
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n", "utf8");
  return summary;
}

function isMainModule() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  const repoRoot = process.cwd();
  const workspaceRoot =
    path.basename(repoRoot) === "site" ? path.resolve(repoRoot, "..") : repoRoot;
  const summary = refreshCoverageSummary(workspaceRoot);
  console.log("planner", summary.scopes["features/planner"].statements);
  console.log("site", summary.scopes.site.statements);
}
