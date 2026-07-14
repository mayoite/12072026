// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/generate-app-inventory-csv.mjs");
const LAYER_COUNT = 6;
const SEGMENTS = new Set(["admin", "api", "crm", "offline", "planner"]);

function csvEscape(s: unknown) {
  const v = String(s ?? "");
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function routeFromPage(relAppPath: string) {
  let seg = relAppPath.replace(/^app\//, "");
  seg = seg.replace(/\/page\.tsx$/, "");
  seg = seg.replace(/\([^)]+\)\//g, "").replace(/\([^)]+\)$/, "");
  if (!seg) return "/";
  return ("/" + seg.replace(/\[([^\]]+)\]/g, "[$1]")).replace(/\/+$/, "") || "/";
}

function pathLayers(relFile: string) {
  const parts = relFile.split("/");
  const root = parts[0] || "app";
  const file = parts[parts.length - 1] || "";
  const folders = parts.slice(1, -1);
  const layers = Array.from({ length: LAYER_COUNT }, (_, i) => folders[i] || "");
  return { root, layers, file, depth: folders.length };
}

describe("generate-app-inventory-csv (name-mirror)", () => {
  it("emits app-pages-inventory.csv with layer columns", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("app-pages-inventory.csv");
    expect(src).toContain("LAYER_COUNT = 6");
    expect(src).toContain("layer_");
    expect(src).toContain("EXCLUDED_PAGE_FILES");
  });

  it("routeFromPage strips route groups and csvEscape quotes commas", () => {
    expect(routeFromPage("app/(site)/about/page.tsx")).toBe("/about");
    expect(routeFromPage("app/(site)/page.tsx")).toBe("/");
    expect(routeFromPage("app/admin/plans/[id]/page.tsx")).toBe("/admin/plans/[id]");
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape("plain")).toBe("plain");
    const layers = pathLayers("app/(site)/products/page.tsx");
    expect(layers.root).toBe("app");
    expect(layers.depth).toBe(2);
    expect(layers.layers).toHaveLength(6);
    expect(SEGMENTS.has("planner")).toBe(true);
  });
});
