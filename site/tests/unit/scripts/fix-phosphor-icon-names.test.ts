// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-phosphor-icon-names.mjs");

const FIX: Record<string, string> = {
  ChevronUp: "CaretUp",
  ChevronDown: "CaretDown",
  ShoppingCart: "ShoppingCart",
  Filter: "Funnel",
  Home: "House",
  Layers: "Stack",
};

function fixImportBody(body: string): string {
  return body
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("type ")) return part;
      const m = part.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) return part;
      const [, name, alias] = m;
      const fixed = FIX[name!] ?? name!;
      if (alias) {
        if (fixed === alias) return fixed;
        return `${fixed} as ${alias}`;
      }
      if (fixed === name) return name!;
      return `${fixed} as ${name}`;
    })
    .join(", ");
}

describe("fix-phosphor-icon-names (name-mirror)", () => {
  it("maps lucide residuals to Phosphor export names", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("@phosphor-icons/react");
    expect(src).toContain("ChevronUp");
    expect(src).toContain("CaretUp");
    expect(src).toContain("fixImportBody");
  });

  it("fixImportBody renames and preserves aliases", () => {
    expect(fixImportBody("ChevronUp, Filter, type Icon")).toBe(
      "CaretUp as ChevronUp, Funnel as Filter, type Icon",
    );
    expect(fixImportBody("ChevronDown as Down")).toBe("CaretDown as Down");
    expect(fixImportBody("ShoppingCart")).toBe("ShoppingCart");
    expect(fixImportBody("Home")).toBe("House as Home");
  });
});
