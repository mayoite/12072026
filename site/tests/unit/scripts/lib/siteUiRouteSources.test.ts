// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  collectPageSources,
  deriveSiteRoutePath,
  findSitePagePath,
  resolveAlias,
  walkSitePageFiles,
} from "../../../../scripts/lib/siteUiRouteSources.mjs";

describe("siteUiRouteSources (name-mirror)", () => {
  const temps: string[] = [];

  afterEach(() => {
    for (const t of temps.splice(0)) {
      fs.rmSync(t, { recursive: true, force: true });
    }
  });

  function makeSiteTree(): { siteRoot: string; appDir: string } {
    const siteRoot = fs.mkdtempSync(path.join(os.tmpdir(), "site-ui-routes-"));
    temps.push(siteRoot);
    const appDir = path.join(siteRoot, "app");
    const aboutDir = path.join(appDir, "(site)", "about");
    fs.mkdirSync(aboutDir, { recursive: true });
    fs.mkdirSync(path.join(siteRoot, "features", "site"), { recursive: true });

    fs.writeFileSync(
      path.join(appDir, "(site)", "page.tsx"),
      `import { HomePageView } from "@/features/site/HomePageView";\nexport default function Page() { return <HomePageView />; }\n`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(aboutDir, "page.tsx"),
      `export default function About() { return <div>about</div>; }\n`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(siteRoot, "features", "site", "HomePageView.tsx"),
      `export function HomePageView() { return <main>home</main>; }\n`,
      "utf8",
    );
    return { siteRoot, appDir };
  }

  it("walkSitePageFiles finds (site) page.tsx files only", () => {
    const { appDir } = makeSiteTree();
    const files = walkSitePageFiles(appDir).map((f: string) => f.replace(/\\/g, "/"));
    expect(files.some((f: string) => f.endsWith("(site)/page.tsx"))).toBe(true);
    expect(files.some((f: string) => f.endsWith("(site)/about/page.tsx"))).toBe(true);
    expect(files).toHaveLength(2);
  });

  it("deriveSiteRoutePath strips route groups", () => {
    const { appDir } = makeSiteTree();
    const home = path.join(appDir, "(site)", "page.tsx");
    const about = path.join(appDir, "(site)", "about", "page.tsx");
    expect(deriveSiteRoutePath(appDir, home)).toBe("/");
    expect(deriveSiteRoutePath(appDir, about)).toBe("/about");
  });

  it("findSitePagePath resolves / and nested routes", () => {
    const { appDir } = makeSiteTree();
    expect(findSitePagePath(appDir, "/")).toMatch(/page\.tsx$/);
    expect(findSitePagePath(appDir, "/about")).toMatch(/about[/\\]page\.tsx$/);
    expect(findSitePagePath(appDir, "/missing")).toBeNull();
  });

  it("resolveAlias and collectPageSources pull @/ PageView modules", () => {
    const { siteRoot, appDir } = makeSiteTree();
    const alias = resolveAlias(siteRoot, "@/features/site/HomePageView");
    expect(alias).toBeDefined();
    expect(fs.existsSync(alias!)).toBe(true);

    const home = path.join(appDir, "(site)", "page.tsx");
    const sources = collectPageSources(siteRoot, home);
    expect(sources).toContain("HomePageView");
    expect(sources).toContain("<main>home</main>");
  });
});
