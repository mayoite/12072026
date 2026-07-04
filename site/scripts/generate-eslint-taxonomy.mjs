#!/usr/bin/env node
/**
 * Parse ESLint output (default formatter) into P/A/M/U/T/S taxonomy buckets.
 * Usage: pnpm --filter oando-site run lint 2>&1 | node scripts/generate-eslint-taxonomy.mjs
 *    or: node scripts/generate-eslint-taxonomy.mjs path/to/lint.log
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const resultsDir = path.join(siteRoot, "results");

const RULE_BUCKETS = {
  P: ["@typescript-eslint/no-explicit-any", "no-explicit-any"],
  A: ["@typescript-eslint/no-unused-vars", "no-unused-vars"],
  M: ["vitest/expect-expect", "jest/expect-expect"],
  U: ["@typescript-eslint/no-unsafe", "no-unsafe"],
  T: ["@typescript-eslint/consistent-type-imports", "import/order"],
  S: ["eqeqeq", "no-console", "secretlint"],
};

function bucketForRule(ruleId) {
  const id = String(ruleId ?? "");
  for (const [bucket, rules] of Object.entries(RULE_BUCKETS)) {
    if (rules.some((r) => id.includes(r))) return bucket;
  }
  return "O";
}

function parseLintLog(text) {
  const lines = text.split(/\r?\n/);
  const byBucket = { P: 0, A: 0, M: 0, U: 0, T: 0, S: 0, O: 0 };
  const byRule = {};
  let errors = 0;
  let warnings = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("D:") || trimmed.startsWith("$")) continue;
    const m = trimmed.match(/^(\d+):(\d+)\s+(error|warning)\s+(.+?)\s{2,}(\S+)$/);
    if (!m) continue;
    const [, , , severity, , ruleId] = m;
    if (severity === "error") errors += 1;
    else warnings += 1;
    const bucket = bucketForRule(ruleId);
    byBucket[bucket] += 1;
    byRule[ruleId] = (byRule[ruleId] ?? 0) + 1;
  }

  const bucketSum = Object.values(byBucket).reduce((a, b) => a + b, 0);
  return {
    generatedAt: new Date().toISOString(),
    errors,
    warnings,
    totalProblems: errors + warnings,
    byBucket,
    bucketSum,
    byRule,
  };
}

function readLogText(filePath) {
  const buf = readFileSync(filePath);
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString("utf16le");
  }
  return buf.toString("utf8").replace(/^\uFEFF/, "");
}

const inputPath = process.argv[2];
const input = inputPath ? readLogText(path.resolve(inputPath)) : readFileSync(0, "utf8");

const taxonomy = parseLintLog(input);
mkdirSync(resultsDir, { recursive: true });
const outPath = path.join(resultsDir, "baseline-eslint-taxonomy.json");
writeFileSync(outPath, `${JSON.stringify(taxonomy, null, 2)}\n`, "utf8");

process.stdout.write(
  `Wrote ${outPath} — ${taxonomy.errors} errors, ${taxonomy.warnings} warnings, bucket sum ${taxonomy.bucketSum}\n`,
);
