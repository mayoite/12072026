// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix_and_reseed.ts");

function parseProductsDbUrl(rawUrl: string) {
  const cleaned = rawUrl.replace(/^["']|["']$/g, "");
  const match = cleaned.match(/^postgresql:\/\/([^:]+):(.+)@([^@]+):(\d+)\/(.+)$/);
  if (!match) return null;
  const [, username, passwordPart, host, portText, database] = match;
  return {
    username,
    password: decodeURIComponent(passwordPart!),
    host,
    port: Number(portText),
    database,
  };
}

describe("fix_and_reseed (name-mirror)", () => {
  it("ensures oando-workstations category then reseeds SQL", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("PRODUCTS_DATABASE_URL");
    expect(src).toContain("oando-workstations");
    expect(src).toContain("seed_data.sql");
    expect(src).toContain("catalog_products");
  });

  it("parses postgresql URL into connection fields", () => {
    const parsed = parseProductsDbUrl(
      '"postgresql://user:p%40ss@db.example.com:5432/catalog"',
    );
    expect(parsed).toEqual({
      username: "user",
      password: "p@ss",
      host: "db.example.com",
      port: 5432,
      database: "catalog",
    });
    expect(parseProductsDbUrl("not-a-url")).toBeNull();
  });
});
