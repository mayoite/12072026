// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/render_project_docs.mjs");

describe("render_project_docs (name-mirror)", () => {
  it("renders markdown tree to HTML with title and footer credit", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "render-project-docs-"));
    const source = path.join(tmp, "docs-src");
    const output = path.join(tmp, "docs-out");
    fs.mkdirSync(path.join(source, "nested"), { recursive: true });
    fs.writeFileSync(
      path.join(source, "README.md"),
      "# Project Root\n\nIntro with `code` and [nested](nested/guide.md).\n",
      "utf8",
    );
    fs.writeFileSync(
      path.join(source, "nested", "guide.md"),
      "## Guide\n\n- item one\n- item two\n\n```ts\nconst x = 1;\n```\n",
      "utf8",
    );

    try {
      const out = execFileSync(
        process.execPath,
        [
          scriptPath,
          "--source",
          source,
          "--output",
          output,
          "--label",
          "Mirror Docs",
        ],
        { cwd: repoRoot, encoding: "utf8" },
      );
      expect(out).toMatch(/Rendered 2 markdown files/);

      const indexHtml = fs.readFileSync(path.join(output, "index.html"), "utf8");
      expect(indexHtml).toContain("Mirror Docs");
      expect(indexHtml).toContain("Project Root");
      expect(indexHtml).toContain("scripts/render_project_docs.mjs");
      expect(indexHtml).toContain("<code>code</code>");

      const guideHtml = fs.readFileSync(path.join(output, "nested", "guide.html"), "utf8");
      expect(guideHtml).toContain("Guide");
      expect(guideHtml).toContain("<li>");
      expect(guideHtml).toContain("const x = 1");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
