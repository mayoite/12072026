// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/generate-mini-site.mjs");

describe("generate-mini-site (name-mirror)", () => {
  it("builds static HTML docs from package.json scripts in an isolated cwd", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mini-site-"));
    try {
      fs.writeFileSync(
        path.join(tmp, "package.json"),
        JSON.stringify({
          name: "mini-site-fixture",
          scripts: {
            dev: "next dev",
            build: "next build",
            "db:types": "echo types",
            "test:unit": "vitest run",
            "docs:sync": "node scripts/docs.mjs",
            "audit:quality": "node scripts/audit.mjs",
            "tree:gen": "node scripts/tree.js",
          },
        }),
        "utf8",
      );

      execFileSync(process.execPath, [scriptPath], {
        cwd: tmp,
        encoding: "utf8",
      });

      const docsDir = path.join(tmp, "site-docs");
      expect(fs.existsSync(path.join(docsDir, "index.html"))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, "npm-commands-core.html"))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, "scripts-database.html"))).toBe(true);
      expect(fs.existsSync(path.join(docsDir, "tests-overview.html"))).toBe(true);

      const indexHtml = fs.readFileSync(path.join(docsDir, "index.html"), "utf8");
      expect(indexHtml).toContain("Platform Documentation");
      expect(indexHtml).toContain("Platform Docs");
      expect(indexHtml).toContain('id="search-input"');

      const coreHtml = fs.readFileSync(path.join(docsDir, "npm-commands-core.html"), "utf8");
      expect(coreHtml).toContain("<code>dev</code>");
      expect(coreHtml).toContain("<code>build</code>");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
