#!/usr/bin/env node
/** Remove per-file next/image and next/link vi.mock blocks (global setup owns them). */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testsRoot = path.join(siteRoot, "tests");

const IMAGE_MOCK_RE = /vi\.mock\(\s*['"]next\/image['"][\s\S]*?\}\)\);\s*\n?/g;
const LINK_MOCK_RE = /vi\.mock\(\s*['"]next\/link['"][\s\S]*?\}\)\);\s*\n?/g;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(test|spec)\.[cm]?tsx$/.test(entry)) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(testsRoot)) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(IMAGE_MOCK_RE, "").replace(LINK_MOCK_RE, "");
  if (after !== before) {
    writeFileSync(file, after, "utf8");
    changed += 1;
  }
}
console.log(`strip-test-mocks: updated ${changed} file(s)`);
