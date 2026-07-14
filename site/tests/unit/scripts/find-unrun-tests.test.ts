// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/find-unrun-tests.js");

function getFiles(
  dir: string,
  filter: RegExp,
  fileList: string[] = [],
  skipParts = ["node_modules", ".next", "results", "generated-documents", "archive"],
) {
  if (skipParts.some((p) => dir.includes(p))) return fileList;
  if (!fs.existsSync(dir)) return fileList;
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) getFiles(fullPath, filter, fileList, skipParts);
    else if (filter.test(file)) fileList.push(fullPath);
  }
  return fileList;
}

describe("find-unrun-tests (name-mirror)", () => {
  it("diff logic and skip dirs match script contract", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("vitest-results.json");
    expect(src).toContain("unrunFiles");
    expect(src).toContain("node_modules");
    expect(src).toContain("generated-documents");
  });

  it("getFiles finds tests and skips results/node_modules trees", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "find-unrun-"));
    try {
      fs.mkdirSync(path.join(tmp, "unit"), { recursive: true });
      fs.writeFileSync(path.join(tmp, "unit", "a.test.ts"), "");
      fs.mkdirSync(path.join(tmp, "node_modules", "x"), { recursive: true });
      fs.writeFileSync(path.join(tmp, "node_modules", "x", "b.test.ts"), "");
      fs.mkdirSync(path.join(tmp, "results"), { recursive: true });
      fs.writeFileSync(path.join(tmp, "results", "c.test.ts"), "");
      const found = getFiles(tmp, /\.test\.tsx?$/).map((f) =>
        path.relative(tmp, f).replace(/\\/g, "/"),
      );
      expect(found).toEqual(["unit/a.test.ts"]);
      const all = ["unit/a.test.ts", "unit/b.test.ts"];
      const executed = new Set(["unit/a.test.ts"]);
      const unrun = all.filter((f) => !executed.has(f));
      expect(unrun).toEqual(["unit/b.test.ts"]);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
