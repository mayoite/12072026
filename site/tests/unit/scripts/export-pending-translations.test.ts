// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/export-pending-translations.mjs");

const SKIP_VALUE = /^(https?:\/\/|\/|mailto:|\+?\d[\d\s-]{8,}|[^@\s]+@[^@\s]+\.[^@\s]+)$/;

function collectLeaves(value: unknown, prefix = "", out: { path: string; value: string }[] = []) {
  if (typeof value === "string") {
    if (!SKIP_VALUE.test(value.trim()) && !/^[\d+.,\s%-]+$/.test(value.trim())) {
      out.push({ path: prefix, value });
    }
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLeaves(item, `${prefix}[${index}]`, out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      collectLeaves(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

function setByPath(root: Record<string, unknown>, pathExpr: string, value: unknown) {
  const tokens: (string | number)[] = [];
  const re = /([^.[\]]+)|\[(\d+)\]/g;
  let match = re.exec(pathExpr);
  while (match) {
    tokens.push(match[1] !== undefined ? match[1] : Number(match[2]));
    match = re.exec(pathExpr);
  }
  let cursor: Record<string | number, unknown> = root;
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i]!;
    const next = tokens[i + 1]!;
    if (cursor[token] === undefined) {
      cursor[token] = typeof next === "number" ? [] : {};
    }
    cursor = cursor[token] as Record<string | number, unknown>;
  }
  cursor[tokens.at(-1)!] = value;
}

describe("export-pending-translations (name-mirror)", () => {
  it("lives at scripts path and exports setByPath with SKIP_VALUE contract", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("pending-translations");
    expect(src).toContain("collectLeaves");
    expect(src).toMatch(/export\s*\{\s*setByPath\s*\}/);
    expect(src).toContain("SKIP_VALUE");
    expect(src).toContain("marketing-parity-manifest");
  });

  it("skips bare scheme roots phones emails and keeps translatable leaves", () => {
    // Contract matches script SKIP_VALUE (exact https?://, /, mailto:, phone, email).
    expect(SKIP_VALUE.test("https://")).toBe(true);
    expect(SKIP_VALUE.test("/")).toBe(true);
    expect(SKIP_VALUE.test("a@b.com")).toBe(true);
    expect(SKIP_VALUE.test("+12345678901")).toBe(true);
    expect(SKIP_VALUE.test("Hello world")).toBe(false);
    const leaves = collectLeaves({ title: "Welcome", link: "a@b.com", count: "12%" }, "home");
    const paths = leaves.map((l) => l.path);
    expect(paths).toContain("home.title");
    expect(paths).not.toContain("home.link");
    expect(paths).not.toContain("home.count");
  });

  it("setByPath writes nested object and array paths", () => {
    const root: Record<string, unknown> = {};
    setByPath(root, "a.b[0].c", "ok");
    expect(root).toEqual({ a: { b: [{ c: "ok" }] } });
  });
});
