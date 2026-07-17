#!/usr/bin/env node
/**
 * Static audit for API route safety gaps (CSRF, auth, rate-limit, rejection header).
 *
 * Catches the class of bugs fixed on planner/plans routes:
 *   - mutating handlers without CSRF
 *   - CSRF rejects without `x-csrf-rejected` (browserApiFetch retry signal)
 *   - admin routes without session gate
 *   - protected mutators without rate limiting
 *   - CSRF failures coded as INVALID_INPUT instead of CSRF_FAILED
 *
 * Usage:
 *   node scripts/audit-api-route-safety.mjs
 *   node scripts/audit-api-route-safety.mjs --json
 *   node scripts/audit-api-route-safety.mjs --warn-only
 *
 * Exit 1 when any error-severity issue is found (unless --warn-only).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const apiRoot = path.join(siteRoot, "app", "api");

const jsonMode = process.argv.includes("--json");
const warnOnly = process.argv.includes("--warn-only");

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Relative api paths (posix, no leading slash) that intentionally skip CSRF. */
const CSRF_OPTIONAL = new Set([
  "tracking",
  "log-error",
  "customer-queries",
  "recommendations",
  "nav-search",
  "filter",
  "generate-alt",
  "ai-assist",
  "ai-advisor",
  "ai/advisor",
  "configurator/smart-wizard",
  "audit",
]);

/**
 * Paths that always require CSRF on mutating methods (prefix match).
 * Public marketing mutators stay optional via CSRF_OPTIONAL exact match first.
 */
const CSRF_REQUIRED_PREFIXES = [
  "admin/",
  "planner/",
  "plans",
  "theme/manage",
  "customer-queries/manage",
  "admin",
];

const ADMIN_AUTH_MARKERS = [
  /withAuth\s*[<(]/,
  /requireAdminSession\s*\(/,
  /resolveAuthContext\s*\(\s*["']admin["']\s*\)/,
  /role\s*:\s*["']admin["']/,
];

const RATE_LIMIT_MARKERS = [
  /withAuth\s*[<(]/,
  /\brateLimit\s*\(/,
  /\benforceAdminRateLimit\s*\(/,
  /\benforcePublicApiRateLimit\s*\(/,
  /\benforceRateLimit\s*\(/,
];

const CSRF_CHECK_MARKERS = [
  /requireCsrf\s*:\s*true/,
  /validateCsrfRequest\s*\(/,
];

const CSRF_REJECTION_HEADER_MARKERS = [
  /CSRF_REJECTION_HEADER_NAME/,
  /["']x-csrf-rejected["']/,
];

function walk(dir, files = []) {
  if (!statSync(dir).isDirectory()) return files;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (entry === "route.ts" || entry === "route.js") {
      files.push(full);
    }
  }
  return files;
}

function toApiPath(absFile) {
  const rel = path.relative(apiRoot, absFile).replaceAll("\\", "/");
  return rel.replace(/\/route\.(ts|js)$/, "");
}

function extractExportedMethods(source) {
  const methods = new Set();
  // export async function POST / export function GET
  for (const m of source.matchAll(
    /\bexport\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/g,
  )) {
    methods.add(m[1]);
  }
  // export const POST = withAuth(...) / export const GET = ...
  for (const m of source.matchAll(
    /\bexport\s+const\s+(GET|POST|PUT|PATCH|DELETE)\s*=/g,
  )) {
    methods.add(m[1]);
  }
  return [...methods];
}

function hasAny(source, patterns) {
  return patterns.some((re) => re.test(source));
}

function csrfRequiredForPath(apiPath) {
  if (CSRF_OPTIONAL.has(apiPath)) return false;
  return CSRF_REQUIRED_PREFIXES.some(
    (prefix) => apiPath === prefix || apiPath.startsWith(prefix),
  );
}

function isAdminPath(apiPath) {
  return apiPath === "admin" || apiPath.startsWith("admin/");
}

function isPlannerPath(apiPath) {
  return apiPath === "planner" || apiPath.startsWith("planner/");
}

/**
 * Detect requireCsrf: true on withAuth wrappers that export mutating methods.
 * Heuristic: if file has requireCsrf:true anywhere and exports a mutator via withAuth.
 */
function hasWithAuthCsrf(source) {
  return /requireCsrf\s*:\s*true/.test(source) && /withAuth\s*[<(]/.test(source);
}

function hasManualCsrf(source) {
  return /validateCsrfRequest\s*\(/.test(source);
}

function hasCsrfCoverage(source) {
  return hasWithAuthCsrf(source) || hasManualCsrf(source);
}

function hasCsrfRejectionHeader(source) {
  // withAuth + requireCsrf sets the header inside withAuth implementation
  if (hasWithAuthCsrf(source)) return true;
  return hasAny(source, CSRF_REJECTION_HEADER_MARKERS);
}

function hasWrongCsrfCode(source) {
  // CSRF failure path coded as INVALID_INPUT (historical bug on plans routes)
  if (!hasManualCsrf(source) && !/CSRF|csrf/.test(source)) return false;
  const csrfBlocks = [
    ...source.matchAll(
      /validateCsrfRequest[\s\S]{0,400}?API_ERROR_CODES\.(\w+)/g,
    ),
  ];
  return csrfBlocks.some((m) => m[1] === "INVALID_INPUT");
}

/**
 * Per-method CSRF: if export is withAuth and file has requireCsrf:true, all
 * withAuth mutators are covered. Manual validateCsrfRequest is per-function —
 * check each mutating function body contains validateCsrfRequest.
 */
function mutatingMethodMissingCsrf(source, method) {
  if (hasWithAuthCsrf(source)) {
    // Prefer withAuth export pattern
    const withAuthExport = new RegExp(
      `export\\s+const\\s+${method}\\s*=\\s*withAuth`,
    );
    if (withAuthExport.test(source)) return false;
    // function export but withAuth used elsewhere — still check body
  }

  // Extract function body for this method (export async function METHOD)
  const fnRe = new RegExp(
    `export\\s+(?:async\\s+)?function\\s+${method}\\s*\\([\\s\\S]*?\\)\\s*\\{`,
  );
  const fnMatch = fnRe.exec(source);
  if (fnMatch) {
    const start = fnMatch.index + fnMatch[0].length;
    const body = sliceBalancedBlock(source, start - 1);
    if (/validateCsrfRequest\s*\(/.test(body)) return false;
    if (/requireCsrf\s*:\s*true/.test(body)) return false;
    // Delegate to shared helper that validates CSRF
    if (/assertCsrf|ensureCsrf|checkCsrf|csrfFailedResponse/.test(body)) {
      return false;
    }
    return true;
  }

  // export const METHOD = withAuth(...)
  const constWithAuth = new RegExp(
    `export\\s+const\\s+${method}\\s*=\\s*withAuth`,
  );
  if (constWithAuth.test(source)) {
    return !/requireCsrf\s*:\s*true/.test(source);
  }

  // export const METHOD = something else
  const constAny = new RegExp(`export\\s+const\\s+${method}\\s*=`);
  if (constAny.test(source)) {
    return !hasCsrfCoverage(source);
  }

  return true;
}

function sliceBalancedBlock(source, openBraceIndex) {
  let depth = 0;
  for (let i = openBraceIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(openBraceIndex, i + 1);
    }
  }
  return source.slice(openBraceIndex);
}

function adminMissingAuth(source) {
  return !hasAny(source, ADMIN_AUTH_MARKERS);
}

function missingRateLimit(source) {
  return !hasAny(source, RATE_LIMIT_MARKERS);
}

const issues = [];

function addIssue({ file, apiPath, method, id, severity, message }) {
  issues.push({ file, apiPath, method: method ?? null, id, severity, message });
}

if (!statSync(apiRoot).isDirectory()) {
  process.stderr.write(`audit-api-route-safety: missing ${apiRoot}\n`);
  process.exit(1);
}

const routeFiles = walk(apiRoot).sort();

for (const abs of routeFiles) {
  const apiPath = toApiPath(abs);
  const rel = path.relative(siteRoot, abs).replaceAll("\\", "/");
  const source = readFileSync(abs, "utf8");
  const methods = extractExportedMethods(source);
  const mutators = methods.filter((m) => MUTATING.has(m));
  const needsCsrf = csrfRequiredForPath(apiPath) && mutators.length > 0;

  // Admin: every route must gate auth (GET included)
  if (isAdminPath(apiPath) && methods.length > 0 && adminMissingAuth(source)) {
    addIssue({
      file: rel,
      apiPath,
      id: "missing-admin-auth",
      severity: "error",
      message:
        "admin route has no withAuth(role:admin) / requireAdminSession / resolveAuthContext(admin)",
    });
  }

  if (needsCsrf) {
    for (const method of mutators) {
      if (mutatingMethodMissingCsrf(source, method)) {
        addIssue({
          file: rel,
          apiPath,
          method,
          id: "missing-csrf",
          severity: "error",
          message: `${method} mutator lacks requireCsrf:true or validateCsrfRequest`,
        });
      }
    }

    // Rejection header so browserApiFetch can refresh token + retry
    if (hasCsrfCoverage(source) && !hasCsrfRejectionHeader(source)) {
      addIssue({
        file: rel,
        apiPath,
        id: "missing-csrf-rejection-header",
        severity: "error",
        message:
          "CSRF check present but response never sets x-csrf-rejected (CSRF_REJECTION_HEADER_NAME)",
      });
    }

    if (hasWrongCsrfCode(source)) {
      addIssue({
        file: rel,
        apiPath,
        id: "csrf-wrong-error-code",
        severity: "error",
        message:
          "CSRF failure uses API_ERROR_CODES.INVALID_INPUT; use CSRF_FAILED",
      });
    }
  }

  // Rate limit on protected mutators
  if (
    mutators.length > 0 &&
    (isAdminPath(apiPath) || isPlannerPath(apiPath) || apiPath.startsWith("plans")) &&
    missingRateLimit(source)
  ) {
    addIssue({
      file: rel,
      apiPath,
      id: "missing-rate-limit",
      severity: "error",
      message:
        "protected mutator has no rateLimit / withAuth / enforceAdminRateLimit",
    });
  }

  // Planner + member plans mutators must use withAuth (CSRF header via requireCsrf)
  if (
    (isPlannerPath(apiPath) || apiPath === "plans" || apiPath.startsWith("plans/")) &&
    mutators.length > 0
  ) {
    if (!/withAuth\s*[<(]/.test(source)) {
      addIssue({
        file: rel,
        apiPath,
        id: "planner-mutator-no-withAuth",
        severity: "error",
        message:
          "planner/plans mutator must use withAuth + requireCsrf (not manual CSRF-only)",
      });
    } else if (!/requireCsrf\s*:\s*true/.test(source)) {
      addIssue({
        file: rel,
        apiPath,
        id: "planner-mutator-no-requireCsrf",
        severity: "error",
        message: "withAuth mutator missing requireCsrf: true",
      });
    }
  }
}

const errors = issues.filter((i) => i.severity === "error");
const warns = issues.filter((i) => i.severity === "warn");

if (jsonMode) {
  process.stdout.write(
    JSON.stringify(
      {
        ok: errors.length === 0,
        routesScanned: routeFiles.length,
        errorCount: errors.length,
        warnCount: warns.length,
        issues,
      },
      null,
      2,
    ) + "\n",
  );
} else {
  process.stdout.write(
    `audit-api-route-safety: scanned ${routeFiles.length} route file(s)\n`,
  );
  if (issues.length === 0) {
    process.stdout.write("audit-api-route-safety: ok\n");
  } else {
    process.stderr.write(
      `audit-api-route-safety: ${errors.length} error(s), ${warns.length} warning(s)\n`,
    );
    for (const i of issues) {
      const where = i.method ? `${i.file} [${i.method}]` : i.file;
      process.stderr.write(`  ${i.severity.toUpperCase()} ${i.id} — ${where}\n`);
      process.stderr.write(`    ${i.message}\n`);
    }
  }
}

if (!warnOnly && errors.length > 0) {
  process.exit(1);
}

process.exit(0);
