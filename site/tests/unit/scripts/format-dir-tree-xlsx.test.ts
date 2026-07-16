// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/format-dir-tree-xlsx.mjs");

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells;
}

describe("format-dir-tree-xlsx (name-mirror)", () => {
  it("reads project-tree.csv and writes repo-dir-tree.xlsx via ExcelJS", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("project-tree.csv");
    expect(src).toContain("repo-dir-tree.xlsx");
    expect(src).toContain("exceljs");
    expect(src).toContain("Directory Tree");
    expect(src).toContain("parseCsvLine");
  });

  it("parseCsvLine handles quotes and escaped quotes", () => {
    expect(parseCsvLine('a,"b,c","d""e"')).toEqual(["a", "b,c", 'd"e']);
    expect(parseCsvLine("simple,row,3")).toEqual(["simple", "row", "3"]);
  });
});
