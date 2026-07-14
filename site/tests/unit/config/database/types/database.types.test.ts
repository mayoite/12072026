// @vitest-environment node
/**
 * Contract: generated Supabase Database types exist and export Database (and Json).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type {
  Database as PublicDatabase,
  Json as PublicJson,
} from "../../../../../config/database/types/database.types";
import type {
  Database as AdminDatabase,
  Json as AdminJson,
} from "../../../../../config/database/types/database.admin.types";

const siteRoot = path.resolve(__dirname, "../../../../..");
const publicTypesPath = path.join(
  siteRoot,
  "config",
  "database",
  "types",
  "database.types.ts",
);
const adminTypesPath = path.join(
  siteRoot,
  "config",
  "database",
  "types",
  "database.admin.types.ts",
);

describe("database.types.ts", () => {
  it("file exists under config/database/types/", () => {
    expect(fs.existsSync(publicTypesPath), publicTypesPath).toBe(true);
  });

  it("source exports type Database and Json", () => {
    const source = fs.readFileSync(publicTypesPath, "utf8");
    expect(source).toMatch(/export\s+type\s+Database\s*=/);
    expect(source).toMatch(/export\s+type\s+Json\s*=/);
  });

  it("types are importable and checkable", () => {
    const dummyJson: PublicJson = { key: "value" };
    expect(dummyJson).toBeDefined();

    const dbKeys: (keyof PublicDatabase)[] = ["public", "__InternalSupabase"];
    expect(dbKeys).toContain("public");
    expect(dbKeys).toContain("__InternalSupabase");
  });
});

describe("database.admin.types.ts", () => {
  it("file exists under config/database/types/", () => {
    expect(fs.existsSync(adminTypesPath), adminTypesPath).toBe(true);
  });

  it("source exports type Database and Json", () => {
    const source = fs.readFileSync(adminTypesPath, "utf8");
    expect(source).toMatch(/export\s+type\s+Database\s*=/);
    expect(source).toMatch(/export\s+type\s+Json\s*=/);
  });

  it("types are importable and checkable", () => {
    const dummyJson: AdminJson = { key: "value" };
    expect(dummyJson).toBeDefined();

    const dbKeys: (keyof AdminDatabase)[] = ["public"];
    expect(dbKeys).toContain("public");
  });
});
