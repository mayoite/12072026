// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-text-alignment.mjs");
const ALIGN_RE = /(?:(sm|md|lg|xl|2xl):)?text-(left|right)\b/g;

function applyAlign(line: string): string {
  let newLine = line;
  ALIGN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ALIGN_RE.exec(newLine)) !== null) {
    const [full, variant, align] = m;
    const replacement = `${variant ? variant + ":" : ""}text-${align === "left" ? "start" : "end"}`;
    newLine = newLine.slice(0, m.index) + replacement + newLine.slice(m.index + full.length);
    ALIGN_RE.lastIndex = m.index + replacement.length;
  }
  return newLine;
}

describe("fix-text-alignment (name-mirror)", () => {
  it("dry-runs physical→logical text alignment on tsx files", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("text-start");
    expect(src).toContain("text-end");
    expect(src).toContain("--write");
    expect(src).toContain("text-(left|right)");
  });

  it("rewrites left/right and responsive variants; leaves center", () => {
    expect(applyAlign('className="text-left md:text-right text-center"')).toBe(
      'className="text-start md:text-end text-center"',
    );
    expect(applyAlign("text-leftover")).toBe("text-leftover");
  });
});
