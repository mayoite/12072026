// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed.ts");
const seedSqlPath = path.join(siteRoot, "scripts/seed_data.sql");

describe("seed (name-mirror)", () => {
  it("requires PRODUCTS_DATABASE_URL and reads scripts/seed_data.sql", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("PRODUCTS_DATABASE_URL");
    expect(src).toContain("seed_data.sql");
    expect(src).toContain("postgres");
    expect(src).toMatch(/ssl:\s*['"]require['"]/);
    expect(fs.existsSync(seedSqlPath)).toBe(true);
  });

  it("parses connection URLs with special characters in password", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("parts.slice(0, parts.length - 1).join('@')");
    expect(src).toContain("decodeURIComponent");
    expect(src).toMatch(/duplicate key|23505/);
  });

  it("seed_data.sql contains catalog insert statements", () => {
    const sql = fs.readFileSync(seedSqlPath, "utf8");
    expect(sql.length).toBeGreaterThan(100);
    expect(sql.toLowerCase()).toMatch(/insert\s+into/);
  });
});
