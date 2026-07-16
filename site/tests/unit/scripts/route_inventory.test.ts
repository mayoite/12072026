// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/route_inventory.mjs");

describe("route_inventory (name-mirror)", () => {
  it("classifies page files and emits reconciliation JSON", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "route-inventory-"));
    const appDir = path.join(tmp, "apps", "site", "app");
    fs.mkdirSync(path.join(appDir, "admin"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "planner", "guest"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "products", "seating"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "api", "health"), { recursive: true });
    fs.writeFileSync(path.join(appDir, "admin", "page.tsx"), "export default function Page(){return null}");
    fs.writeFileSync(
      path.join(appDir, "planner", "guest", "page.tsx"),
      "export default function Page(){return null}",
    );
    fs.writeFileSync(
      path.join(appDir, "products", "seating", "page.tsx"),
      "export default function Page(){return null}",
    );
    fs.writeFileSync(
      path.join(appDir, "api", "health", "route.ts"),
      "export function GET(){return new Response('ok')}",
    );

    const dataDir = path.join(tmp, "apps", "site", "data", "site");
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, "localCatalogIndex.json"), "[]", "utf8");

    try {
      const raw = execFileSync(process.execPath, [scriptPath], {
        cwd: tmp,
        encoding: "utf8",
      });
      const report = JSON.parse(raw) as {
        pageFileCount: number;
        routeFileCount: number;
        pageFiles: {
          admin: string[];
          planner: string[];
          products: string[];
          other: string[];
        };
        reconciliation: { missingSolutionRoutes: string[] };
        manifests: { hasPrerenderManifest: boolean };
      };
      expect(report.pageFileCount).toBe(3);
      expect(report.routeFileCount).toBe(1);
      // Classifier keys are app/*-relative; monorepo walk yields apps/site/app/* → other.
      const allPages = [
        ...report.pageFiles.admin,
        ...report.pageFiles.planner,
        ...report.pageFiles.products,
        ...report.pageFiles.other,
      ];
      expect(allPages).toHaveLength(3);
      expect(allPages.some((p) => p.includes("admin"))).toBe(true);
      expect(allPages.some((p) => p.includes("planner"))).toBe(true);
      expect(allPages.some((p) => p.includes("products"))).toBe(true);
      expect(report.manifests.hasPrerenderManifest).toBe(false);
      expect(report.reconciliation.missingSolutionRoutes).toEqual(
        expect.arrayContaining(["/solutions/seating", "/solutions/workstations"]),
      );
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("defines admin/planner/products classifiers in source", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("classifyPageFile");
    expect(src).toContain("classifyStaticRoute");
    expect(src).toContain("missingSolutionRoutes");
    expect(src).toContain("localCatalogIndex.json");
  });
});
