// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/repo_backup_upload_r2.ts");

describe("repo_backup_upload_r2 (name-mirror)", () => {
  it("archives HEAD to zip and uploads under backups/repo on R2", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("git");
    expect(src).toContain("archive");
    expect(src).toContain("--format=zip");
    expect(src).toContain("backups/repo/");
    expect(src).toContain("oofplweb-");
    expect(src).toContain("PutObjectCommand");
    expect(src).toContain("createR2CatalogClient");
    expect(src).toContain("resolveCatalogBucketName");
    expect(src).toContain("--keep-local");
  });

  it("loads env via loadEnvLocal and refuses silent missing archive status", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("loadEnvLocal");
    expect(src).toMatch(/archive\.status\s*!==\s*0/);
    expect(src).toMatch(/process\.exit/);
  });
});
