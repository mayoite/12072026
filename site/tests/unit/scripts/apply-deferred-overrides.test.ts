// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/apply-deferred-overrides.mjs");

function loadDeepMerge(): (
  base: Record<string, unknown>,
  overrides: Record<string, unknown> | null | undefined,
) => Record<string, unknown> {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/function deepMerge\(base, overrides\) \{[\s\S]*?\n\}/);
  if (!match) throw new Error("deepMerge not found in apply-deferred-overrides.mjs");
  const sandbox: {
    structuredClone: typeof structuredClone;
    deepMerge?: (
      base: Record<string, unknown>,
      overrides: Record<string, unknown> | null | undefined,
    ) => Record<string, unknown>;
  } = { structuredClone };
  vm.runInNewContext(`${match[0]}; this.deepMerge = deepMerge;`, sandbox);
  if (!sandbox.deepMerge) throw new Error("deepMerge failed to load");
  return sandbox.deepMerge as (
    base: Record<string, unknown>,
    overrides: Record<string, unknown> | null | undefined,
  ) => Record<string, unknown>;
}

describe("apply-deferred-overrides", () => {
  it("is a locale override merger wired to marketing-parity deferredLocales", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("deferred-overrides");
    expect(source).toContain("marketing-parity-manifest.json");
    expect(source).toContain("deferredLocales");
    expect(source).toContain("function deepMerge");
    expect(source).toContain("i18n");
  });

  it("deep-merges nested objects without mutating the base reference tree blindly", () => {
    const deepMerge = loadDeepMerge();
    const base = {
      home: { hero: { title: "Hello", subtitle: "Sub" }, meta: { a: 1 } },
      keep: "yes",
    };
    const overrides = {
      home: { hero: { title: "Hola" }, extra: true },
      flat: "new",
    };

    const merged = deepMerge(base, overrides);

    expect(merged).toEqual({
      home: { hero: { title: "Hola", subtitle: "Sub" }, meta: { a: 1 }, extra: true },
      keep: "yes",
      flat: "new",
    });
    // structuredClone base: original base object values for nested keys remain intact
    expect(base.home.hero.title).toBe("Hello");
  });

  it("replaces arrays and primitives instead of merging them", () => {
    const deepMerge = loadDeepMerge();
    const merged = deepMerge(
      { tags: ["a"], count: 1, nested: { ok: true } },
      { tags: ["b", "c"], count: 2 },
    );
    expect(merged.tags).toEqual(["b", "c"]);
    expect(merged.count).toBe(2);
    expect(merged.nested).toEqual({ ok: true });
  });

  it("handles nullish overrides by returning a clone of base", () => {
    const deepMerge = loadDeepMerge();
    const base = { a: 1 };
    const merged = deepMerge(base, null);
    expect(merged).toEqual({ a: 1 });
    expect(merged).not.toBe(base);
  });
});
