// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/extract-home-design-base.mjs");

describe("extract-home-design-base (name-mirror)", () => {
  it("targets home components and writes design-base-home inventories", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("design-base-home");
    expect(src).toContain("HOME-CLASSES.txt");
    expect(src).toContain("HOME-TOKENS-SAMPLE.txt");
    expect(src).toContain("components/home");
    expect(src).toContain("app/(site)/page.tsx");
  });

  it("class and token regexes extract home/shell/type/btn and CSS vars", () => {
    const sample =
      'className="home-hero shell-xl typ-h1 btn-primary" style={{ color: "var(--color-brand)" }}';
    const classes = new Set<string>();
    const tokens = new Set<string>();
    for (const m of sample.matchAll(
      /\b(home-[a-z0-9-]+|shell-[a-z0-9-]+|typ-[a-z0-9-]+|btn-[a-z0-9-]+)\b/g,
    )) {
      classes.add(m[1]!);
    }
    for (const m of sample.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) {
      tokens.add(m[1]!);
    }
    expect([...classes].sort()).toEqual(["btn-primary", "home-hero", "shell-xl", "typ-h1"]);
    expect([...tokens]).toEqual(["--color-brand"]);
  });
});
