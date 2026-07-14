// @vitest-environment node
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const mod = require("../../../scripts/prepare-review-folders.js") as {
  CODE_EXTS: Set<string>;
  folders: Record<string, { description: string; sources: unknown[] }>;
  isCodeFile: (p: string) => boolean;
  isRouteFile: (p: string) => boolean;
  buildBrief: (folderName: string, fileCount: number, fileList: string[]) => string;
};

describe("prepare-review-folders (name-mirror)", () => {
  it("classifies code and route files", () => {
    expect(mod.CODE_EXTS.has(".tsx")).toBe(true);
    expect(mod.isCodeFile("app/page.tsx")).toBe(true);
    expect(mod.isCodeFile("readme.md")).toBe(false);
    expect(mod.isRouteFile("app/(site)/about/page.tsx")).toBe(true);
    expect(mod.isRouteFile("app/api/foo/route.ts")).toBe(true);
    expect(mod.isRouteFile(`lib${path.sep}api${path.sep}x.ts`)).toBe(true);
    expect(mod.isRouteFile("components/Header.tsx")).toBe(false);
  });

  it("defines five review critic folders with sources", () => {
    const names = Object.keys(mod.folders);
    expect(names).toEqual(
      expect.arrayContaining([
        "UX-UI-Critic",
        "Route-Engineer",
        "Code-Expert-Frontend",
        "Code-Expert-Packages",
        "Code-Expert-Platform",
      ]),
    );
    expect(names).toHaveLength(5);
    for (const name of names) {
      expect(mod.folders[name]?.sources.length).toBeGreaterThan(0);
      expect(mod.folders[name]?.description.length).toBeGreaterThan(10);
    }
  });

  it("builds a brief with file list and deliverable section", () => {
    const brief = mod.buildBrief("UX-UI-Critic", 2, ["app/page.tsx", "components/Header.tsx"]);
    expect(brief).toContain("# UX-UI-Critic Review Brief");
    expect(brief).toContain("Files included (2)");
    expect(brief).toContain("`app/page.tsx`");
    expect(brief).toContain("Deliverable");
  });
});
