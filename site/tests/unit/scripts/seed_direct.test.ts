// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed_direct.ts");

describe("seed_direct (name-mirror)", () => {
  it("rewrites seed inserts onto catalog_* tables and re-applies migration SQL", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("PRODUCTS_DATABASE_URL");
    expect(src).toContain("seed_data.sql");
    expect(src).toContain("INSERT INTO catalog_products");
    expect(src).toContain("INSERT INTO catalog_categories");
    expect(src).toContain("20260309113000_add_canonical_catalog_fields.sql");
    expect(src).toContain("CREATE OR REPLACE");
  });

  it("parses PRODUCTS_DATABASE_URL with a single capture group for host credentials", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("rawUrl.match(/^postgresql:");
    expect(src).toContain("decodeURIComponent(passwordPart)");
    expect(src).toContain('ssl: "require"');
    expect(src).toContain("passwordPart");
    expect(src).toContain("username");
  });
});
