// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-hosted-runtime.mjs");

type Helpers = {
  getArgValue: (name: string) => string;
  normalizeBaseUrl: (value: string) => string;
  pushFailure: (
    failures: Array<Record<string, unknown>>,
    check: { url: string; status: number; error: string },
    reason: string,
  ) => void;
  DEFAULT_BASE_URL: string;
};

function loadHelpers(argv: string[] = []): Helpers {
  const source = fs.readFileSync(scriptPath, "utf8");
  const defaultUrl = source.match(/const DEFAULT_BASE_URL = ("[^"]+");/)?.[1];
  const getArg = source.match(/function getArgValue\(name\) \{[\s\S]*?\n\}/)?.[0];
  const normalize = source.match(/function normalizeBaseUrl\(value\) \{[\s\S]*?\n\}/)?.[0];
  const push = source.match(/function pushFailure\(failures, check, reason\) \{[\s\S]*?\n\}/)?.[0];
  if (!defaultUrl || !getArg || !normalize || !push) {
    throw new Error("helpers not found in audit-hosted-runtime.mjs");
  }

  const sandbox: {
    args: string[];
    Date: typeof Date;
    Error: typeof Error;
    String: typeof String;
    Array: typeof Array;
    JSON: typeof JSON;
    fetch?: unknown;
    exports?: Helpers;
  } = {
    args: argv,
    Date,
    Error,
    String,
    Array,
    JSON,
  };

  vm.runInNewContext(
    `
      const DEFAULT_BASE_URL = ${defaultUrl};
      ${getArg}
      ${normalize}
      ${push}
      this.exports = { getArgValue, normalizeBaseUrl, pushFailure, DEFAULT_BASE_URL };
    `,
    sandbox,
  );
  if (!sandbox.exports) throw new Error("failed to load hosted runtime helpers");
  return sandbox.exports;
}

describe("audit-hosted-runtime", () => {
  it("is a hosted route/image probe with no forced live network in unit tests", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("DEFAULT_BASE_URL");
    expect(source).toContain("normalizeBaseUrl");
    expect(source).toContain("/api/categories/");
    expect(source).toContain("Missing Supabase runtime env vars");
    expect(source).toContain("fetchCheck");
    // main always runs on import — unit tests must not import the module directly
    expect(source).toMatch(/main\(\)/);
  });

  it("normalizes base URLs with protocol and without trailing slashes", () => {
    const { normalizeBaseUrl, DEFAULT_BASE_URL } = loadHelpers();
    expect(DEFAULT_BASE_URL).toBe("https://workingoando.vercel.app");
    expect(normalizeBaseUrl("")).toBe(DEFAULT_BASE_URL);
    expect(normalizeBaseUrl("   ")).toBe(DEFAULT_BASE_URL);
    expect(normalizeBaseUrl("https://example.com/")).toBe("https://example.com");
    expect(normalizeBaseUrl("http://example.com///")).toBe("http://example.com");
    expect(normalizeBaseUrl("example.com")).toBe("https://example.com");
    expect(normalizeBaseUrl("https://example.com/path/")).toBe("https://example.com/path");
  });

  it("parses --url=value and --url value argv forms", () => {
    const spaced = loadHelpers(["--url", "https://a.example"]);
    expect(spaced.getArgValue("--url")).toBe("https://a.example");

    const equals = loadHelpers(["--url=https://b.example"]);
    expect(equals.getArgValue("--url")).toBe("https://b.example");

    const missing = loadHelpers([]);
    expect(missing.getArgValue("--url")).toBe("");
  });

  it("records structured probe failures", () => {
    const { pushFailure } = loadHelpers();
    const failures: Array<Record<string, unknown>> = [];
    pushFailure(
      failures,
      { url: "https://x/api", status: 500, error: "boom" },
      "route_status_not_ok",
    );
    expect(failures).toEqual([
      {
        url: "https://x/api",
        status: 500,
        reason: "route_status_not_ok",
        error: "boom",
      },
    ]);
  });
});
