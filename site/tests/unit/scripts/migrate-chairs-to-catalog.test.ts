// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const scriptPath = path.join(siteRoot, "scripts/migrate-chairs-to-catalog.ts");
const chairsDir = path.join(siteRoot, "public/images/chairs");
const tsxCli = path.join(repoRoot, "node_modules/tsx/dist/cli.mjs");

describe("migrate-chairs-to-catalog (name-mirror)", () => {
  it("encodes dry-run WebP migration into oando-seating catalog folders", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("--dry-run");
    expect(source).toContain("public/images/chairs");
    expect(source).toContain("public/images/catalog");
    expect(source).toContain("oando-seating--");
    expect(source).toContain("image-");
    expect(source).toContain(".webp");
    expect(source).toContain("WEBP_QUALITY");
    expect(source).toContain("sharp");
  });

  it(
    "fails clearly when chairs source dir is missing, or dry-runs when present",
    () => {
      if (!fs.existsSync(chairsDir)) {
        let stderr = "";
        let status = 0;
        try {
          execFileSync(process.execPath, [tsxCli, scriptPath, "--dry-run"], {
            cwd: siteRoot,
            encoding: "utf8",
          });
        } catch (error) {
          const err = error as { status?: number; stderr?: string; stdout?: string };
          status = err.status ?? 1;
          stderr = `${err.stderr ?? ""}${err.stdout ?? ""}`;
        }
        expect(status).toBe(1);
        expect(stderr).toMatch(/public\/images\/chairs\/ not found/);
        return;
      }

      const output = execFileSync(process.execPath, [tsxCli, scriptPath, "--dry-run"], {
        cwd: siteRoot,
        encoding: "utf8",
      });
      expect(output).toMatch(/Found \d+ chair product folders/);
      expect(output).toContain("DRY RUN");
      expect(output).toMatch(/Converted: \d+ images/);
    },
    60_000,
  );
});
