// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/apply-pending-translations.mjs");
const setByPathSourcePath = path.join(siteRoot, "scripts/export-pending-translations.mjs");

function loadSetByPath(): (root: Record<string, unknown>, pathExpr: string, value: unknown) => void {
  // Load only the pure helper from source text — do not import the module
  // (export-pending-translations.mjs mutates i18n/pending-translations on import).
  const source = fs.readFileSync(setByPathSourcePath, "utf8");
  const match = source.match(/function setByPath\(root, pathExpr, value\) \{[\s\S]*?\n\}/);
  if (!match) throw new Error("setByPath not found in export-pending-translations.mjs");
  const sandbox: {
    Number: typeof Number;
    Array: typeof Array;
    setByPath?: (root: Record<string, unknown>, pathExpr: string, value: unknown) => void;
  } = { Number, Array };
  vm.runInNewContext(`${match[0]}; this.setByPath = setByPath;`, sandbox);
  if (!sandbox.setByPath) throw new Error("setByPath failed to load");
  return sandbox.setByPath;
}

describe("apply-pending-translations", () => {
  it("applies pending translations via setByPath into locale message namespaces", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("pending-translations");
    expect(source).toContain("setByPath");
    expect(source).toContain("export-pending-translations.mjs");
    expect(source).toContain("deferredLocales");
    expect(source).toContain("marketing-parity-manifest.json");
  });

  it("uses setByPath the same way the script merges translated leaves", () => {
    const setByPath = loadSetByPath();
    const translated: Record<string, string> = {
      "Home.hero.title": "Bienvenido",
      "Home.hero.items[0]": "Uno",
      "Products.cta": "Comprar",
    };
    const merged: Record<string, Record<string, unknown>> = {
      Home: { hero: { title: "Welcome", items: ["One", "Two"] } },
      Products: { cta: "Buy" },
    };

    for (const [pathKey, value] of Object.entries(translated)) {
      const [namespace] = pathKey.split(".");
      const innerPath = pathKey.slice(namespace.length + 1);
      if (!merged[namespace]) merged[namespace] = {};
      setByPath(merged[namespace], innerPath, value);
    }

    expect(merged.Home.hero).toEqual({ title: "Bienvenido", items: ["Uno", "Two"] });
    expect(merged.Products.cta).toBe("Comprar");
  });

  it("creates missing namespace objects before setByPath", () => {
    const setByPath = loadSetByPath();
    const merged: Record<string, Record<string, unknown>> = {};
    const pathKey = "NewNs.deep.leaf";
    const [namespace] = pathKey.split(".");
    const innerPath = pathKey.slice(namespace.length + 1);
    if (!merged[namespace]) merged[namespace] = {};
    setByPath(merged[namespace], innerPath, "value");
    expect(merged.NewNs).toEqual({ deep: { leaf: "value" } });
  });
});
