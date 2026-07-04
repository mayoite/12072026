import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const repoRoot = path.resolve(siteRoot, "..");
const apiDir = path.join(siteRoot, "app", "api");
const outFile = path.join(repoRoot, "docs", "api", "ROUTE-INDEX.md");

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const NOTES = `## Notes

- **Auth:** Most user routes use Supabase session cookies via \`createServerClient()\`. Admin routes use \`withAuth({ role: "admin" })\`. Some routes accept \`Authorization: Bearer\` (e.g. recommendations).
- **CSRF:** \`POST\`/\`PUT\`/\`DELETE\` on \`/api/plans\` require a valid CSRF token (\`GET /api/csrf\` first).
- **Deprecated catalog shims:** Prefer \`/api/admin/catalogs/{type}\` over legacy \`/api/admin/catalog\`, \`buddy-catalog\`, and \`planner-catalog\` paths.`;

function walkRouteFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkRouteFiles(abs, out);
    else if (entry.name === "route.ts") out.push(abs);
  }
  return out;
}

function deriveApiPath(filePath) {
  const rel = path.relative(path.join(siteRoot, "app"), filePath).replace(/\\/g, "/");
  const segments = rel.split("/").filter((segment) => segment !== "route.ts");
  return `/${segments.join("/")}`;
}

function extractMethodsFromHeader(source) {
  const header = source.match(/\/\*\*([\s\S]*?)\*\//);
  if (!header) return [];
  const apiLine = header[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .find((line) => /\/api\//.test(line));
  if (!apiLine) return [];
  return HTTP_METHODS.filter((method) => new RegExp(`\\b${method}\\b`).test(apiLine));
}

function extractMethods(source) {
  const methods = new Set();
  for (const method of HTTP_METHODS) {
    const fnRe = new RegExp(`export\\s+(?:async\\s+)?function\\s+${method}\\b`);
    const constRe = new RegExp(`export\\s+const\\s+${method}\\s*=`);
    if (fnRe.test(source) || constRe.test(source)) methods.add(method);
  }
  for (const method of extractMethodsFromHeader(source)) methods.add(method);
  return HTTP_METHODS.filter((method) => methods.has(method));
}

function extractDeprecationNote(source) {
  const preferred = source.match(/@deprecated\s+Use\s+`([^`]+)`\s+instead/i);
  if (preferred) return ` *(deprecated shim → ${preferred[1]})*`;
  if (/@deprecated/i.test(source)) return " *(deprecated)*";
  return "";
}

function buildRows() {
  const rows = [];
  for (const filePath of walkRouteFiles(apiDir)) {
    const source = fs.readFileSync(filePath, "utf8");
    const methods = extractMethods(source);
    if (!methods.length) continue;
    const routePath = deriveApiPath(filePath);
    const suffix = extractDeprecationNote(source);
    const typeHint =
      routePath === "/api/admin/catalogs/[type]" ? " — `type`: `standard`, `configurator`, `buddy`" : "";
    rows.push({
      methods: methods.join(", "),
      display: `\`${routePath}\`${typeHint}${suffix}`,
    });
  }
  rows.sort((left, right) => left.display.localeCompare(right.display));
  return rows;
}

function renderMarkdown(rows) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    "# API route index",
    "",
    "**Source of truth:** `site/app/api/**/route.ts`",
    "",
    `Generated from route handlers on ${today}.`,
    "",
    "Regenerate: `pnpm --filter oando-site run docs:sync:routes` (from repo root).",
    "",
    "| Methods | Path |",
    "|---------|------|",
    ...rows.map((row) => `| ${row.methods} | ${row.display} |`),
    "",
    NOTES,
    "",
  ];
  return `${lines.join("\n")}`;
}

const rows = buildRows();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, renderMarkdown(rows), "utf8");
console.log(`Wrote ${path.relative(repoRoot, outFile)} (${rows.length} routes)`);
