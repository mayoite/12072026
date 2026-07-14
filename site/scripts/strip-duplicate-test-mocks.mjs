#!/usr/bin/env node
/** Remove per-file next/image and next/link vi.mock blocks (global setup owns them). */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testsRoot = path.join(siteRoot, "tests");

export const IMAGE_MOCK_RE = /vi\.mock\(\s*['"]next\/image['"][\s\S]*?\}\)\);\s*\n?/g;
export const LINK_MOCK_RE = /vi\.mock\(\s*['"]next\/link['"][\s\S]*?\}\)\);\s*\n?/g;

export function stripDuplicateMocks(source) {
  return source.replace(IMAGE_MOCK_RE, "").replace(LINK_MOCK_RE, "");
}

export function walkTestFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walkTestFiles(full, files);
    else if (/\.(test|spec)\.[cm]?tsx$/.test(entry)) files.push(full);
  }
  return files;
}

export function stripDuplicateMocksInTree(rootDir = testsRoot, { dryRun = false } = {}) {
  let changed = 0;
  for (const file of walkTestFiles(rootDir)) {
    const before = readFileSync(file, "utf8");
    const after = stripDuplicateMocks(before);
    if (after !== before) {
      if (!dryRun) writeFileSync(file, after, "utf8");
      changed += 1;
    }
  }
  return changed;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  const changed = stripDuplicateMocksInTree();
  console.log(`strip-test-mocks: updated ${changed} file(s)`);
}
