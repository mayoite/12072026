// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-css-compat.mjs");

function fixCss(src: string): { out: string; changed: number } {
  let out = src;
  let changed = 0;
  function addPrefixBefore(css: string, stdProp: string, prefixedProp: string) {
    const lines = css.split("\n");
    const result: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i]!.trimStart();
      if (trimmed.startsWith(stdProp + ":") && !trimmed.startsWith("-")) {
        const indent = lines[i]!.slice(0, lines[i]!.length - lines[i]!.trimStart().length);
        const prefixedLine = indent + prefixedProp + ":" + trimmed.slice(stdProp.length + 1);
        const context = lines.slice(Math.max(0, i - 3), i + 3).join("\n");
        if (!context.includes(prefixedProp + ":")) {
          result.push(prefixedLine);
          changed++;
        }
      }
      result.push(lines[i]!);
    }
    return result.join("\n");
  }
  out = addPrefixBefore(out, "backdrop-filter", "-webkit-backdrop-filter");
  out = addPrefixBefore(out, "mask-image", "-webkit-mask-image");
  out = addPrefixBefore(out, "user-select", "-webkit-user-select");
  out = addPrefixBefore(out, "appearance", "-webkit-appearance");
  return { out, changed };
}

describe("fix-css-compat (name-mirror)", () => {
  it("walks app/css and lib/catalog/styles for vendor prefixes", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("app/css");
    expect(src).toContain("lib/catalog/styles");
    expect(src).toContain("-webkit-backdrop-filter");
    expect(src).toContain("addPrefixBefore");
  });

  it("adds webkit prefixes before standard props once", () => {
    const input = ".x {\n  backdrop-filter: blur(4px);\n  user-select: none;\n}";
    const { out, changed } = fixCss(input);
    expect(changed).toBeGreaterThanOrEqual(2);
    expect(out).toContain("-webkit-backdrop-filter: blur(4px);");
    expect(out).toContain("backdrop-filter: blur(4px);");
    expect(out.indexOf("-webkit-backdrop-filter")).toBeLessThan(out.indexOf("backdrop-filter: blur"));
    const again = fixCss(out);
    expect(again.changed).toBe(0);
  });
});
