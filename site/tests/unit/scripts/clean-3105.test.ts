// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/clean-3105.mjs");

describe("clean-3105 (name-mirror)", () => {
  it("rewrites 3105 references under an isolated temp tree", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "clean-3105-"));
    try {
      const note = path.join(tmp, "note.md");
      fs.writeFileSync(note, "see 3105archive and only-in-3105 paths\n", "utf8");
      const output = execFileSync(process.execPath, [scriptPath, tmp], {
        cwd: siteRoot,
        encoding: "utf8",
      });
      expect(output).toContain(`Cleaning "3105" references under: ${tmp}`);
      expect(output).toMatch(/1 updated/);
      const rewritten = fs.readFileSync(note, "utf8");
      expect(rewritten).toContain("archive");
      expect(rewritten).toContain("only-in-base");
      expect(rewritten).not.toContain("3105");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("reports changes without writing when --dry-run is set", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "clean-3105-dry-"));
    try {
      const note = path.join(tmp, "note.md");
      fs.writeFileSync(note, "legacy 3105 token\n", "utf8");
      const output = execFileSync(process.execPath, [scriptPath, tmp, "--dry-run"], {
        cwd: siteRoot,
        encoding: "utf8",
      });
      expect(output).toContain("(dry run)");
      expect(output).toContain("would update:");
      expect(fs.readFileSync(note, "utf8")).toBe("legacy 3105 token\n");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
