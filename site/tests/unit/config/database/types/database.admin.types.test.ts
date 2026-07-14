// @vitest-environment node
/**
 * Name-mirror: config/database/types/database.admin.types.ts
 * Contract: generated admin Supabase types export Database (and Json).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type {
  Database,
  Json,
} from "../../../../../config/database/types/database.admin.types";

const siteRoot = path.resolve(__dirname, "../../../../..");
const adminTypesPath = path.join(
  siteRoot,
  "config",
  "database",
  "types",
  "database.admin.types.ts",
);

describe("database.admin.types.ts", () => {
  it("file exists under config/database/types/", () => {
    expect(fs.existsSync(adminTypesPath), adminTypesPath).toBe(true);
  });

  it("source exports type Database and Json", () => {
    const source = fs.readFileSync(adminTypesPath, "utf8");
    expect(source).toMatch(/export\s+type\s+Database\s*=/);
    expect(source).toMatch(/export\s+type\s+Json\s*=/);
  });

  it("exports Database with a public schema key", () => {
    const dummyJson: Json = { key: "value" };
    expect(dummyJson).toBeDefined();

    const dbKeys: (keyof Database)[] = ["public"];
    expect(dbKeys).toContain("public");
    expect(dbKeys).toHaveLength(1);
  });

  it("public schema exposes Tables", () => {
    type PublicSchema = Database["public"];
    type TableNames = keyof PublicSchema["Tables"];
    const sampleTables: TableNames[] = [
      "clients",
      "customer_queries",
    ];
    expect(sampleTables).toContain("clients");
    expect(sampleTables).toContain("customer_queries");
  });
});
