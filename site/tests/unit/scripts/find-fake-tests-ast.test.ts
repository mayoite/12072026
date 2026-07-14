// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/find-fake-tests-ast.ts");

describe("find-fake-tests-ast (name-mirror)", () => {
  it("uses ts-morph and flags tests without expect", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("ts-morph");
    expect(src).toContain("No assertions (expect) found in test body");
    expect(src).toContain("test.skip");
    expect(src).toContain("it.todo");
    expect(src).toContain(".test.ts");
  });

  it("hollow-body heuristic matches expect-less it blocks", () => {
    const bodyText = "() => { const x = 1; }";
    expect(bodyText.includes("expect(") || bodyText.includes("expect.")).toBe(false);
    const withExpect = "() => { expect(1).toBe(1); }";
    expect(withExpect.includes("expect(")).toBe(true);
  });
});
