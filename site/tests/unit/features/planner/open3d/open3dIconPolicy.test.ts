import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Plan A 01A / product policy: icons are Phosphor only — no lucide-react.
 * Scans production source under site/ (excludes scripts, generated docs, lockfiles).
 */
function walkTsFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      ent.name === "node_modules" ||
      ent.name === ".next" ||
      ent.name === "tech-stack-docs" ||
      ent.name === "scripts"
    ) {
      continue;
    }
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkTsFiles(p, out);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) out.push(p);
  }
  return out;
}

describe("icon policy — Phosphor only", () => {
  it("has zero lucide-react imports in app/features/components/lib (excl. archive optional)", () => {
    const roots = ["app", "features", "components", "lib"].map((r) =>
      path.resolve(__dirname, "../../../../../", r),
    );
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of walkTsFiles(root)) {
        // Archive fabric is legacy; still migrated but allow if any residual
        if (file.includes(`${path.sep}_archive${path.sep}`)) continue;
        const src = fs.readFileSync(file, "utf8");
        if (src.includes("lucide-react")) {
          offenders.push(path.relative(path.resolve(__dirname, "../../../../../"), file));
        }
      }
    }
    expect(offenders, `lucide-react still imported:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("does not list lucide-react in site package.json dependencies", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../../../../package.json"), "utf8"),
    ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    expect(pkg.dependencies?.["lucide-react"]).toBeUndefined();
    expect(pkg.devDependencies?.["lucide-react"]).toBeUndefined();
    expect(pkg.dependencies?.["@phosphor-icons/react"]).toBeDefined();
  });
});
