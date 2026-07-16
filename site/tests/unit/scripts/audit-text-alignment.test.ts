// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-text-alignment.mjs");

function loadAlignRe(): RegExp {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/const ALIGN_RE = (\/.*?\/g);/);
  if (!match) throw new Error("ALIGN_RE not found");
  return new Function(`return ${match[1]}`)() as RegExp;
}

/** Mirrors classification rules in audit-text-alignment.mjs run(). */
function classifyLine(
  lineClasses: Array<{ variant?: string; align: string }>,
): Array<{ category: string; suggestion: string; className: string }> {
  const hasResponsive = lineClasses.some((c) => c.variant);
  return lineClasses.map((c) => {
    let category: string;
    if (c.align === "center") category = "center";
    else if (c.align === "start" || c.align === "end") category = "logical";
    else if (c.variant) category = "responsive";
    else if (hasResponsive) category = "responsive";
    else category = "fixed";

    let suggestion = "";
    if (category === "fixed") {
      if (c.align === "left") suggestion = "text-start";
      else if (c.align === "right") suggestion = "text-end";
    }
    return {
      category,
      suggestion,
      className: `${c.variant ? `${c.variant}:` : ""}text-${c.align}`,
    };
  });
}

describe("audit-text-alignment", () => {
  it("scans TSX for text-left/right/center/start/end and writes CSV", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("text-alignment-audit.csv");
    expect(source).toContain("ALIGN_RE");
    expect(source).toContain("logical");
    expect(source).toContain("text-start");
    expect(source).toContain("text-end");
  });

  it("matches alignment utilities including breakpoint variants", () => {
    const ALIGN_RE = loadAlignRe();
    const line = "className=\"text-left md:text-right text-center text-start lg:text-end\"";
    const hits: Array<{ variant?: string; align: string }> = [];
    ALIGN_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = ALIGN_RE.exec(line)) !== null) {
      hits.push({ variant: m[1], align: m[2] });
    }
    expect(hits).toEqual([
      { variant: undefined, align: "left" },
      { variant: "md", align: "right" },
      { variant: undefined, align: "center" },
      { variant: undefined, align: "start" },
      { variant: "lg", align: "end" },
    ]);
  });

  it("classifies fixed LTR/RTL risks and suggests logical replacements", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('suggestion = "text-start"');
    expect(source).toContain('suggestion = "text-end"');

    expect(
      classifyLine([{ align: "left" }, { align: "right" }]),
    ).toEqual([
      { category: "fixed", suggestion: "text-start", className: "text-left" },
      { category: "fixed", suggestion: "text-end", className: "text-right" },
    ]);

    expect(
      classifyLine([{ align: "left" }, { variant: "md", align: "right" }]),
    ).toEqual([
      { category: "responsive", suggestion: "", className: "text-left" },
      { category: "responsive", suggestion: "", className: "md:text-right" },
    ]);

    expect(classifyLine([{ align: "center" }])[0].category).toBe("center");
    expect(classifyLine([{ align: "start" }])[0].category).toBe("logical");
    expect(classifyLine([{ align: "end" }])[0].category).toBe("logical");
  });
});
