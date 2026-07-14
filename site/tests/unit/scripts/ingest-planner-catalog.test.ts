// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CSV_DIR,
  PLANNER_CSV_FILES,
  catalogItemIdentityKey,
  dedupeCatalogItems,
  parseCsvFileWithAudit,
} from "@/features/planner/catalog-api/ingest/csvCatalogIngest";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/ingest-planner-catalog.ts");

describe("ingest-planner-catalog (name-mirror)", () => {
  it("wires the catalog ingest script to the CSV ingest pipeline and source files", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain('from "@/features/planner/catalog-api/ingest/csvCatalogIngest"');
    expect(source).toContain("parseCsvFileWithAudit");
    expect(source).toContain("dedupeCatalogItems");
    expect(source).toContain("generatedCatalogItemsPart1.ts");
    expect(source).toContain("generatedCatalogItemsPart2.ts");
    expect(source).toContain("planner-catalog-golden.json");
    expect(PLANNER_CSV_FILES.length).toBeGreaterThan(0);

    const present = PLANNER_CSV_FILES.filter((file) =>
      fs.existsSync(path.join(siteRoot, CSV_DIR, file)),
    );
    expect(present.length).toBeGreaterThan(0);
  });

  it("parses at least one planner CSV and dedupes by identity key", () => {
    const file = PLANNER_CSV_FILES.find((name) =>
      fs.existsSync(path.join(siteRoot, CSV_DIR, name)),
    );
    expect(file, "at least one PLANNER_CSV_FILES entry must exist on disk").toEqual(
      expect.any(String),
    );

    const raw = fs.readFileSync(path.join(siteRoot, CSV_DIR, file as string), "utf8");
    const parsed = parseCsvFileWithAudit(file as string, raw);
    expect(parsed.items.length).toBeGreaterThan(0);
    expect(typeof parsed.family).toBe("string");
    expect(parsed.family.length).toBeGreaterThan(0);

    const first = parsed.items[0] as CatalogItem;
    expect(catalogItemIdentityKey(first).length).toBeGreaterThan(0);

    const doubled = [...parsed.items, ...parsed.items];
    const unique = dedupeCatalogItems(doubled);
    expect(unique.length).toBe(parsed.items.length);
    expect(unique.length).toBeLessThan(doubled.length);
  });
});
