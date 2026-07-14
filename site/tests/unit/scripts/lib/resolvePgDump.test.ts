// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { resolvePgDumpExecutable } from "@/scripts/lib/resolvePgDump";

describe("resolvePgDump (name-mirror)", () => {
  const originalPath = process.env.PG_DUMP_PATH;

  afterEach(() => {
    if (originalPath === undefined) {
      delete process.env.PG_DUMP_PATH;
    } else {
      process.env.PG_DUMP_PATH = originalPath;
    }
  });

  it("returns PG_DUMP_PATH when it points at an existing file", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pg-dump-"));
    const fake = path.join(tmp, "pg_dump.exe");
    fs.writeFileSync(fake, "fake");
    process.env.PG_DUMP_PATH = fake;

    expect(resolvePgDumpExecutable()).toBe(fake);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("ignores PG_DUMP_PATH when missing and either finds a candidate or throws a clear error", () => {
    process.env.PG_DUMP_PATH = path.join(os.tmpdir(), "no-such-pg-dump-binary-xyz");

    try {
      const resolved = resolvePgDumpExecutable();
      expect(typeof resolved).toBe("string");
      expect(resolved.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toMatch(/pg_dump not found/i);
      expect((err as Error).message).toMatch(/PG_DUMP_PATH/);
    }
  });
});
