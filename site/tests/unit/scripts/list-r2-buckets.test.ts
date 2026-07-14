// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/list-r2-buckets.mjs");

describe("list-r2-buckets (name-mirror)", () => {
  it("runs ListBuckets or fails with Missing R2 credentials", () => {
    let stdout = "";
    let stderr = "";
    let status = 0;
    try {
      stdout = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
      });
    } catch (error) {
      const err = error as { status?: number; stderr?: string; stdout?: string };
      status = err.status ?? 1;
      stderr = err.stderr ?? "";
      stdout = err.stdout ?? "";
    }

    const combined = `${stdout}\n${stderr}`;
    if (status === 0) {
      expect(combined).toMatch(/Account endpoint:/);
      expect(combined).toMatch(/Buckets \(\d+\):/);
    } else {
      expect(status).toBeGreaterThan(0);
      // Missing env, invalid keys, or R2 401 all prove the CLI entry ran.
      expect(combined).toMatch(/Missing R2 credentials|Unauthorized|AccessDenied|InvalidAccessKeyId/i);
    }
  });

  it("uses S3 ListBuckets against the Cloudflare R2 endpoint shape", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("ListBucketsCommand");
    expect(source).toContain("S3Client");
    expect(source).toContain("r2.cloudflarestorage.com");
    expect(source).toContain("Buckets");
    expect(source).toContain('region: "auto"');
  });
});
