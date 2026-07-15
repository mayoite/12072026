// @vitest-environment node
import { existsSync, rmSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/prepare-svgedit-runtime.mjs");
const runtimeRoot = path.join(siteRoot, "public/vendor/svgedit");

describe("SVG-Edit runtime preparation", () => {
  it("pins dependencies and wires the deterministic preparation script into site lifecycle scripts", async () => {
    const rootPackage = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8")) as {
      packageManager?: string;
    };
    const sitePackage = JSON.parse(await readFile(path.join(siteRoot, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };

    expect(rootPackage.packageManager).toMatch(/^pnpm@/);
    expect(sitePackage.dependencies?.svgedit).toBe("7.4.2");
    expect(sitePackage.dependencies?.["@svgedit/svgcanvas"]).toBe("7.4.2");
    expect(sitePackage.scripts?.predev).toContain("prepare-svgedit-runtime.mjs");
    expect(sitePackage.scripts?.prebuild).toContain("prepare-svgedit-runtime.mjs");
  });

  it("copies upstream editor assets and license notices into an ignored public vendor runtime", async () => {
    expect(existsSync(scriptPath)).toBe(true);
    const mod = await import(pathToFileURL(scriptPath).href) as {
      prepareSvgEditRuntime(options?: { siteRoot?: string }): Promise<{ files: string[]; runtimeRoot: string }>;
    };
    rmSync(runtimeRoot, { recursive: true, force: true });

    const result = await mod.prepareSvgEditRuntime({ siteRoot });

    expect(result.runtimeRoot).toBe(runtimeRoot);
    expect(result.files).toEqual(expect.arrayContaining([
      "index.html",
      "svgedit.css",
      "iife-Editor.js",
      "LICENSE-MIT.txt",
      "licenseInfo.json",
      ".gitignore",
    ]));
    expect(await readFile(path.join(runtimeRoot, "index.html"), "utf8")).toContain("svg");
    expect(await readFile(path.join(runtimeRoot, ".gitignore"), "utf8")).toContain("*");
  });

  it("fails when prepared runtime assets contain unresolved workspace imports", async () => {
    const mod = await import(pathToFileURL(scriptPath).href) as {
      assertPreparedRuntime(options?: { runtimeRoot?: string }): Promise<void>;
    };
    await writeFile(path.join(runtimeRoot, "bad.js"), "import x from '@/workspace-only';", "utf8");
    await expect(mod.assertPreparedRuntime({ runtimeRoot })).rejects.toThrow(/unresolved workspace import/i);
  });
});
